const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

async function runParseProject() {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'charset': 'utf-8'
      },
      data: qs.stringify({
        api_key: process.env.PARSE_API_KEY
      })
    };
    const response = await axios(`https://www.parsehub.com/api/v2/projects/${process.env.PROJECT_TOKEN}/run`, options);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}

async function getParseRunStatus(runToken) {
  try {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'charset': 'utf-8'
      },
      params: {
        api_key: process.env.PARSE_API_KEY
      }
    };
    const response = await axios(`https://www.parsehub.com/api/v2/runs/${runToken}`, options);
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
}

async function getParseRunData(runToken) {
  try {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'charset': 'utf-8'
      },
      params: {
        api_key: process.env.PARSE_API_KEY,
        format: 'json'
      }
    };
    const response = await axios(`https://www.parsehub.com/api/v2/runs/${runToken}/data`, options);
    // console.log(response.data);
    // const data = response.data;

    let result = postprocessParseRunData(response.data);
    console.log(result.categories);
    result.categories.forEach(item => {
      console.log(item.subcategories);
    })
  } catch (error) {
    console.log(error);
  }
}

function postprocessParseRunData(data) {
  const resultObject = {
    "name": "SELVER",
    "website": "https://www.selver.ee/",
    categories: []
  }

  function createDataStructure(categoryList, categoryKeyName, dataCatArray, dataCatIndex, product) {
    let isFound = false;
    //if product category not found - leave recursion
    if(!dataCatArray[dataCatIndex]) return;
    //map current level of categories in result object
    categoryList.forEach(resCat => {
      //if category was found
      if(dataCatArray[dataCatIndex] == resCat[categoryKeyName]) {
        isFound = true;
        //continue recursion for next level of categories
        createDataStructure(resCat.subcategories, 'subcategory_et', dataCatArray, dataCatIndex + 1, product)
      };
    })
    //if category was not found
    if(!isFound) {
      //if it is not last category of product, then create new level of subcategories
      if(dataCatArray[dataCatIndex + 1]) {
        categoryList.push({
          [categoryKeyName]: dataCatArray[dataCatIndex],
          subcategories: []
        });
      }
      //else - dont create next level
      else {
        categoryList.push({
          [categoryKeyName]: dataCatArray[dataCatIndex],
        });
      }
      createDataStructure(categoryList[categoryList.length - 1].subcategories, 'subcategory_et', dataCatArray, dataCatIndex + 1, product)
    }
    //if it is last category of product - add product to this category
    if(!dataCatArray[dataCatIndex + 1]) {
      categoryList.products = [];
      categoryList.products.push(product);
    }
  }

  //map all parsed products
  data.nav_links.forEach(product => {
    //split "categories" string of each product
    let categories = product.category.split('/').slice(1);
    createDataStructure(resultObject.categories, 'category_et', categories, 0, product);
  })

  return resultObject;
}

// runParseProject();
getParseRunData('tWtjCECXr1dr');
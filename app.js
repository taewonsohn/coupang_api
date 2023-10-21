const axios = require('axios');
const { generateHmac } = require('./hmacGenerator');
require('dotenv').config();

const util = require('util');

const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_KEY = process.env.SECRET_KEY;

async function generateDeeplink(ACCESS_KEY, SECRET_KEY) {
    const REQUEST_METHOD = "POST";
    const DOMAIN = "https://api-gateway.coupang.com";
    const URL = "/v2/providers/affiliate_open_api/apis/openapi/v1/deeplink";

    // Define your REQUEST object with appropriate data
    const REQUEST = {
        "coupangUrls": [
            "https://www.coupang.com/np/search?component=&q=good&channel=user",
            "https://www.coupang.com/np/coupangglobal"
        ]
    };

    const authorization = generateHmac(REQUEST_METHOD, URL, SECRET_KEY, ACCESS_KEY);
    axios.defaults.baseURL = DOMAIN;

    try {
        const response = await axios.request({
            method: REQUEST_METHOD,
            url: URL,
            headers: { Authorization: authorization },
            data: REQUEST
        });
        return response.data;
    } catch (err) {
        console.error(err.response.data);
        throw err;
    }
}


generateDeeplink(ACCESS_KEY, SECRET_KEY)
    .then((deeplinkResponse) => {
        console.log(deeplinkResponse);
    })
    .catch((err) => {
        console.error(err);
    });




async function searchProducts(ACCESS_KEY, SECRET_KEY, keyword, limit) {
    const REQUEST_METHOD = "GET";
    const DOMAIN = "https://api-gateway.coupang.com";
    const URL = "/v2/providers/affiliate_open_api/apis/openapi/products/search";

    const subId = "your_sub_id"; // Optional
    const imageSize = "512x512"; // Optional
    const srpLinkOnly = false; // Optional

    const requestUrl = `${URL}?keyword=${keyword}&limit=${limit}`;
    const authorization = generateHmac(REQUEST_METHOD, requestUrl, SECRET_KEY, ACCESS_KEY);

    axios.defaults.baseURL = DOMAIN;

    try {
        const response = await axios.get(requestUrl, {
            headers: { Authorization: authorization }
        });
        return response.data;
    } catch (err) {
        console.error(err.response.data);
        throw err;
    }
}


searchProducts(ACCESS_KEY, SECRET_KEY, encodeURIComponent("초콜릿"), 5)
    .then((response) => {
        products = response.data.productData;
        
        products.forEach((product,index)=>{
            console.log(index+1);
            console.log(product.productName);
            console.log(product.productPrice);
            console.log(product.productImage);
            console.log(product.productUrl);
            console.log('---');
        });
    })
    .catch((err) => {
        console.error(err);
    });

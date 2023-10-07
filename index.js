// lambda.js

const AWS = require('aws-sdk');
var converter = require('api-spec-converter');
const query = require('querystring');

exports.handler = async (event) => {
  try {
    
    console.log(event);
    const swagger2 = JSON.parse(event.body);
    
    
  var oas30 = {};
  oas30 = await converter.convert({
    from: 'swagger_2',
    to: 'openapi_3',
    source: swagger2,
  });
  }
  catch(error) {
    console.log(error);
    return {
      statusCode: 500,
      body: error
    };
  }
        return {
          statusCode: 200,
          body: oas30
        };
      };
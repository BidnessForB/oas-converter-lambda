// lambda.js

const AWS = require('aws-sdk');
var converter = require('api-spec-converter');

exports.handler = async (event) => {
  console.log("event: ", event);
  //console.log("Body");
  //console.log(event.body);
  const swagger2 = JSON.parse(event.body);
  try {
  const oas30 = await converter.convert({
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
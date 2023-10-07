// lambda.js

const AWS = require('aws-sdk');
var converter = require('./converter.js');

exports.handler = async (event) => {
  //console.log("event: ", event);
  const swagger2 = event;
  const oas30 = await     converter.convert({
    from: 'swagger_2',
    to: 'openapi_3',
    source: swagger2,
  });
        return {
          statusCode: 200,
          body: oas30.stringify()
        };
      };
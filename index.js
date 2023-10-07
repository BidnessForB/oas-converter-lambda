// lambda.js

const AWS = require('aws-sdk');
const query = require('querystring');
var converter = require('api-spec-converter');
var jsyaml = require('js-yaml');
var fs = require('fs');

exports.handler = async (event) => {
  try {
    
//    console.log(event);

console.log("Here: 1");

    const supportedAPITypes = [
    "swagger_1"
    ,"swagger_2"
    ,"openapi_3"
    ,"api_blueprint"
    ,"io_docs"
    ,"google"
    ,"raml"
    ,"wadl"
  ]
  console.log("Here: 2");
  const supportFileFormats =[
    "yaml"
    ,"yml"
    ,"json"
  ]
  console.log("Here: 3", event.rawQueryString);
  console.log("TYpeof querystring: ", (typeof event.rawQueryString));
  const rawParams = new URLSearchParams(event.rawQueryString);

  // Get all values.
  const params = Object.fromEntries(rawParams);
      
      console.log("Here: 3.5", params);
    if(typeof params === 'undefined' || params == null) {
      console.log("Here: 4");
      params = {};
      params.outputFileFormat = 'yaml'
      params.inputFileFormat = 'json'
      params.inputAPIType = 'swagger_2'
      params.outputAPIType = 'openapi_3'
    }
    
    else {
      console.log("Here: 4");
      params.outputFileFormat = Object.hasOwnProperty.bind(params)("outputFileFormat") ? params.outputFileFormat : 'yaml';
      params.inputFileFormat = Object.hasOwnProperty.bind(params)("inputFileFormat") ? params.inputFileFormat : 'json';
      params.inputAPIType = Object.hasOwnProperty.bind(params)("inputAPIType") ? params.inputAPIType : 'swagger_2';
      params.outputAPIType = Object.hasOwnProperty.bind(params)("outputAPIType") ? params.outputAPIType : 'swagger_2';
    }
    if(!supportedAPITypes.includes(params.inputAPIType)) {
      throw new Error("Unsupported input API type: ", params.inputAPIType);
    }
    if(!supportedAPITypes.includes(params.outputAPIType)) {
      throw new Error("Unsupported output API type: " + params.outputAPIType);
    }
    if(!supportFileFormats.includes(params.inputFileFormat)) {
      throw new Error("Unsupported input file format: ", params.inputFileFormat);
    }
    if(!supportFileFormats.includes(params.outputFileFormat)) {
      throw new Error("Unsupported output file format: ", params.outputFileFormat);
    }
    console.log("Here: 5");
    console.log("Params: ")
    console.log(params);
    var b64 = JSON.parse(event.body).b64
    if(params.inputFileFormat == 'yaml' || params.inputFileFormat == 'yml') {
      console.log("Transforming YAML")
      console.log("b64", JSON.parse(event.body).b64);
      apispec = Buffer.from(b64,'base64').toString('utf-8');
      //var data = Buffer.from(b64Yaml,'base64').toString('utf-8');
      var yamlData = jsyaml.load(apispec);
      apispec = JSON.parse(JSON.stringify((yamlData)));
      console.log("Transforming YAML COMPLETE")
    }
    else {
      console.log("Here: 6");
      apispec = JSON.parse(Buffer.from(b64,'base64').toString('utf-8'));
    }

    console.log("Transformed API Spec");
    console.log(apispec);
    console.log("Here 7");
    
  var oas30 = {};
  oas30 = await converter.convert({
    from: params.inputAPIType,
      to: params.outputAPIType,
  syntax: params.outputFileFormat,
    source: apispec
  });
  console.log("Here: 8");
if(params.outputFileFormat == 'yaml' || params.outputFileFormat == 'yml') {
    oas30.spec = (jsyaml.dump(oas30.spec));
    console.log("Here: 9");
 }
 console.log("Here: 10", oas30);
 oas30.b64 = Buffer.from(JSON.stringify(oas30.spec)).toString('base64');
 console.log("Here: 11");
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
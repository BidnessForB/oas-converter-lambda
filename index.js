// lambda.js

const AWS = require('aws-sdk');
const query = require('querystring');
var converter = require('api-spec-converter');
var jsyaml = require('js-yaml');
var fs = require('fs');

exports.handler = async (event) => {
  try {

//Despite this list, only `swagger_2` is supported for input and `openapi_3` for output
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

  //Supported input/output file formats
  const supportFileFormats =[
    "yaml"
    ,"yml"
    ,"json"
  ]
//Parse the query parameter string on the URL
  const rawParams = new URLSearchParams(event.rawQueryString);

  // The querystring object does not inherit from Object, so we have to 
  // cast it to an Object in order to use standard methods.

  const params = Object.fromEntries(rawParams);

 // Set the input file format parameter to the user selection if it is valid
// or to the default `json` if the parameter is invalid or missing
 
    if(typeof params === 'undefined' || params == null) {
      console.log("Here: 4");
      params = {};
      params.outputFileFormat = 'yaml'
      params.inputFileFormat = 'json'
      params.inputAPIType = 'swagger_2'
      params.outputAPIType = 'openapi_3'
    }
    
    else {
      // Fill in any missing parameters with reasonable defaults
      params.outputFileFormat = Object.hasOwnProperty.bind(params)("outputFileFormat") ? params.outputFileFormat : 'yaml';
      params.inputFileFormat = Object.hasOwnProperty.bind(params)("inputFileFormat") ? params.inputFileFormat : 'json';
      params.inputAPIType = Object.hasOwnProperty.bind(params)("inputAPIType") ? params.inputAPIType : 'swagger_2';
      params.outputAPIType = Object.hasOwnProperty.bind(params)("outputAPIType") ? params.outputAPIType : 'swagger_2';
    }
    // If the requested API Type is not supported, throw and error and bail
    if(!supportedAPITypes.includes(params.inputAPIType)) {
      throw new Error("Unsupported input API type: ", params.inputAPIType);
    }
    if(!supportedAPITypes.includes(params.outputAPIType)) {
      throw new Error("Unsupported output API type: " + params.outputAPIType);
    }
    // If the provided file format is not supported, throw and error and bail
    if(!supportFileFormats.includes(params.inputFileFormat)) {
      throw new Error("Unsupported input file format: ", params.inputFileFormat);
    }
    if(!supportFileFormats.includes(params.outputFileFormat)) {
      throw new Error("Unsupported output file format: ", params.outputFileFormat);
    }
    
    // Schemas are delivered in base-64 encoding
    // YAML schemas require transformation to JSON before processing
    var b64 = JSON.parse(event.body).b64
    if(params.inputFileFormat == 'yaml' || params.inputFileFormat == 'yml') {
      console.log("Transforming YAML")
      console.log("b64", JSON.parse(event.body).b64);
      apispec = Buffer.from(b64,'base64').toString('utf-8');
      var yamlData = jsyaml.load(apispec);
      apispec = JSON.parse(JSON.stringify((yamlData)));
      console.log("Transforming YAML COMPLETE")
    }
    else {
      // JSCN schemas can just be decoded
      apispec = JSON.parse(Buffer.from(b64,'base64').toString('utf-8'));
    }

  // Feed the converter the params provided and wait for the conversion to complete  
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
 // base64 encoded the generated spec
 oas30.b64 = Buffer.from(JSON.stringify(oas30.spec)).toString('base64');
 
  }
  catch(error) {
    //rut roh
    console.log(error);
    return {
      statusCode: 500,
      body: error
    };
  }
  // Deliver the goods
        return {
          statusCode: 200,
          body: oas30
        };
      };
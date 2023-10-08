# oas-converter-lambda

Code for an [AWS lambda function](https://us-east-2.console.aws.amazon.com/lambda/home?region=us-east-2#/functions/brkc-oas-converter?tab=code) to convert API Definitions (schemas) from  OAS2.0 to OAS3.0

Works in conjunction with the [Convert OAS 2.0 to 3.0](https://v10-technical-enablement.postman.co/workspace/BRKC-Utilities~b300ef5a-6cf8-4295-9712-0cfecc414f50/environment/23889826-f4729082-c30a-4d98-b09e-be72a0a669ca?action=share&creator=23889826&active-environment=23889826-f4729082-c30a-4d98-b09e-be72a0a669ca) Postman collection.

### Lambda interface
You'd think I'd have an OAS spec for this, wouldn't ya? 🤡

`https://<lambda_url>?outputFileFormat=<json|(yaml|yml)>&inputFileFormat=<json|(yaml|yml)>&inputAPIType=swagger_2&outputAPIType=openapi_3`

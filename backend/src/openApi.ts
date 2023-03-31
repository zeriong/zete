import { OpenApiNestFactory } from 'nest-openapi-tools';
import { DocumentBuilder } from '@nestjs/swagger';

export const useOpenApi = (app) => {
  return OpenApiNestFactory.configure(
    app,
    new DocumentBuilder()
      .setTitle('My API')
      .setDescription('An API to do awesome things')
      .addBearerAuth(),
    {
      // web-api-docs (web-swagger-docs)
      webServerOptions: {
        enabled: process.env.NODE_ENV !== 'production',
        path: 'api-docs',
      },

      // made openapi.yaml from openApi library
      fileGeneratorOptions: {
        enabled: process.env.NODE_ENV !== 'production',
        outputFilePath: './openapi.yaml', // or ./openapi.json
      },

      // openapi.yaml output to frontend

      clientGeneratorOptions: {
        enabled: process.env.NODE_ENV !== 'production',
        type: 'typescript-axios', //typescript-axios
        outputFolderPath: '../frontend/src/openapi',
        additionalProperties:
          'apiPackage=apis,modelPackage=models,withoutPrefixEnums=true,withSeparateModelsAndApi=true',
        openApiFilePath: './openapi.yaml', // or ./openapi.json
        skipValidation: true, // optional, false by default
      },
    },
    {
      operationIdFactory: (c: string, method: string) => method, // type-default = string
    },
  );
};

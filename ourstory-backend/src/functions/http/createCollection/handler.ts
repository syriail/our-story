import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import httpErrorHandler from "@middy/http-error-handler";
import cors from '@middy/http-cors'
import { APIGatewayProxyResult } from "aws-lambda";
import schema from "./schema";

const createCollectionHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async(event):Promise<APIGatewayProxyResult> =>{
    return {
        statusCode: 201,
        body: JSON.stringify(event.body)
    }
}

export const main = middyfy(createCollectionHandler).use(httpErrorHandler()).use(cors({
    credentials: true
}))
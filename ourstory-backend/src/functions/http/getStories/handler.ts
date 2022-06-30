import { middyfy } from "@libs/lambda";
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import * as AWSXRay from "aws-xray-sdk"
import * as createError from 'http-errors'
import { getStoriesByCollection } from '../../../businessLogic/stories'
if(process.env.IS_OFFLINE) AWSXRay.setContextMissingStrategy("IGNORE_ERROR")


const getCollections: APIGatewayProxyHandler = async(event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult>=>{
    const collectionId = event.pathParameters.collectionId
    const locale = event.queryStringParameters.locale
    try{
        const stories = await getStoriesByCollection(collectionId, locale)
    return {
        statusCode: 200,
        body: JSON.stringify({stories})
    }
    }catch(error){
        throw new createError.InternalServerError(error.message)
    }
    
}

export const main = middyfy(getCollections).use(httpErrorHandler()).use(cors({
    credentials: true
}))
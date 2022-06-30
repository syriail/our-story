import { middyfy } from "@libs/lambda";
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import * as AWSXRay from "aws-xray-sdk"
import * as createError from 'http-errors'
import { getStoryDetails } from '../../../businessLogic/stories'
if(process.env.IS_OFFLINE) AWSXRay.setContextMissingStrategy("IGNORE_ERROR")


const getCollections: APIGatewayProxyHandler = async(event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult>=>{
    const storyId = event.pathParameters.storyId
    const locale = event.queryStringParameters.locale
    try{
        const story = await getStoryDetails(storyId, locale)
    return {
        statusCode: 200,
        body: JSON.stringify(story)
    }
    }catch(error){
        throw new createError.InternalServerError(error.message)
    }
    
}

export const main = middyfy(getCollections).use(httpErrorHandler()).use(cors({
    credentials: true
}))
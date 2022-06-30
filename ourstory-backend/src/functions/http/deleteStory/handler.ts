import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import * as AWSXRay from "aws-xray-sdk"
import { middyfy } from '@libs/lambda';
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import * as createError from 'http-errors'
import {deleteStory} from '../../../businessLogic/stories'

if(process.env.IS_OFFLINE) AWSXRay.setContextMissingStrategy("IGNORE_ERROR")

const deleteStoryHandler: APIGatewayProxyHandler = async(event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult> =>{
    const storyId = event.pathParameters.storyId
    try{
        await deleteStory(storyId)
        return {
            statusCode: 204,
            body:'Deleted'
        }
    }catch(error){
        throw new createError.InternalServerError(error.mesage)
    }
}

export const main = middyfy(deleteStoryHandler).use(httpErrorHandler()).use(cors({
    credentials: true
}))
import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { APIGatewayProxyResult } from "aws-lambda";
import * as AWSXRay from "aws-xray-sdk"
import { middyfy } from '@libs/lambda';
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import * as createError from 'http-errors'
import CreateStoryRequest from '../../../requests/CreateStoryRequest'
import schema from "./schema";
import {updateStory} from '../../../businessLogic/stories'

if(process.env.IS_OFFLINE) AWSXRay.setContextMissingStrategy("IGNORE_ERROR")

const updateStoryHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async(event):Promise<APIGatewayProxyResult> =>{
    if(!validateRequest(event)) throw new createError.BadRequest
    const request: CreateStoryRequest = event.body
    const storyId = event.pathParameters.storyId

    try{
        const story = await updateStory(storyId, request)
        return {
            statusCode: 200,
            body: JSON.stringify({story})
        }
    }catch(error){
        throw new createError.InternalServerError(error.message)
    }

}

export const main = middyfy(updateStoryHandler).use(httpErrorHandler()).use(cors({
    credentials: true
}))
const validateRequest=(event)=>{
    //API gateway validication does not work offline
    if(process.env.IS_OFFLINE) return !!event.body.storyTitle && !!event.body.defaultLocale && !!event.body.collectionId
    return true
  }
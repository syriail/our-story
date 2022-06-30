import * as AWSXRay from "aws-xray-sdk"
import { middyfy } from "@libs/lambda";
import httpErrorHandler from "@middy/http-error-handler";
import cors from '@middy/http-cors'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { getUploadUrls } from '../../../businessLogic/stories'
import { MediaFormat } from '../../../models'
if(process.env.IS_OFFLINE) AWSXRay.setContextMissingStrategy("IGNORE_ERROR")

const getUploadUrlHandler: APIGatewayProxyHandler = async(event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult> =>{
    const storyId = event.pathParameters.storyId
    const mediaFormat = event.queryStringParameters.mediaFormat
    const fileExtension = event.queryStringParameters.fileExtension
    const urls = getUploadUrls(storyId, MediaFormat[mediaFormat.toUpperCase()], fileExtension)
    return {
      statusCode: 200,
      body: JSON.stringify(urls)
    }

}

export const main = middyfy(getUploadUrlHandler).use(httpErrorHandler()).use(cors({
    credentials: true
}))

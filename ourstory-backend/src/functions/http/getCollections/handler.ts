import { middyfy } from "@libs/lambda";
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import httpErrorHandler from '@middy/http-error-handler'
import cors from '@middy/http-cors'
import * as AWSXRay from "aws-xray-sdk"
// import * as createError from 'http-errors'
import {formatJSONResponse} from '@libs/api-gateway'
import { getUserId } from '../../utils';
import { getCollectionsByEmployee } from '../../../businessLogic/collections'
if(process.env.IS_OFFLINE) AWSXRay.setContextMissingStrategy("IGNORE_ERROR")


const getCollections: APIGatewayProxyHandler = async(event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult>=>{
    const userId = getUserId(event.headers)
    const locale = event.queryStringParameters.locale
    const collections = await getCollectionsByEmployee(userId, locale)
    return formatJSONResponse({collections})
}

export const main = middyfy(getCollections).use(httpErrorHandler()).use(cors({
    credentials: true
}))
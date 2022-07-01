import { CollectionAccess } from "../dataLayer/collectionsAccess";
import { Collection, Employee } from "../models";
import EmployeesAccess from "../dataLayer/employeesAccess";
import * as uuid from 'uuid'
import { CreateCollectionRequest } from "src/requests/CreateCollectionRequest";
import {createLogger} from '../libs/logger'
const collectionAccess = new CollectionAccess()
const employeesAccess = new EmployeesAccess()



export const getCollectionsByEmployee = async(userId: string, locale: string): Promise<Collection[]>=>{
    const collections: Collection[] = []
    try{
        const baseCollections = await collectionAccess.getCollections(userId)
        for(const baseCollection of baseCollections){
            //If the required locale is not available as translation, the default locale will be fetched
            let targetLocale = locale
            if(!baseCollection.availableTranslations.includes(locale)) targetLocale = baseCollection.defaultLocale
            const translation = await collectionAccess.getCollectionTranslation(baseCollection.id, targetLocale)
            const editors = await employeesAccess.getEmployeesByIds(baseCollection.editors)
            const manager = await employeesAccess.getEmployee(baseCollection.managerId)
            let collection: Collection = {
                id: baseCollection.id,
                defaultLocale: baseCollection.defaultLocale,
                name: translation.collectionName,
                createdAt: baseCollection.createdAt,
                manager,
                availableTranslations: baseCollection.availableTranslations,
                editors
    
            }
            if(translation.collectionDescription) collection.description = translation.collectionDescription
            collections.push(collection)
    
        }
        return collections
    }catch(error){
        throw error
    }
    
}

export const getCollectionDetails = async(collectionId: string, locale: string):Promise<Collection>=>{
    const baseCollection = await collectionAccess.getCollection(collectionId)
    let targetLocale = locale
    if(!baseCollection.availableTranslations.includes(locale)) targetLocale = baseCollection.defaultLocale
    const translation = await collectionAccess.getCollectionTranslation(baseCollection.id, targetLocale)
    const editors = await employeesAccess.getEmployeesByIds(baseCollection.editors)
    const manager = await employeesAccess.getEmployee(baseCollection.managerId)
    const tags = await collectionAccess.getCollectionTagsTranslation(collectionId, targetLocale)
    let collection: Collection = {
        id: baseCollection.id,
        defaultLocale: baseCollection.defaultLocale,
        name: translation.collectionName,
        createdAt: baseCollection.createdAt,
        manager,
        availableTranslations: baseCollection.availableTranslations,
        editors,
        tags

    }
    if(translation.collectionDescription) collection.description = translation.collectionDescription
    return collection

}

export const createCollection = async(request: CreateCollectionRequest, userId: string, requestId: string):Promise<Collection> =>{
    const logger = createLogger(requestId, 'BusinessLogic', 'createCollection')
    const id = uuid.v4()
    const createdAt = new Date().toISOString()
    const editors: Employee[] = await employeesAccess.getEmployeesByIds(request.editors)
    const manager: Employee = await employeesAccess.getEmployee(userId)
    let collection: Collection = {
        id,
        createdAt,
        manager,
        defaultLocale: request.defaultLocale,
        availableTranslations: [],
        tags: request.tags ? request.tags : [],
        name: request.name,
        editors
    }
    logger.info('Create Collection: ', {message: collection})
    if(request.description) collection.description = request.description
    await collectionAccess.createCollection(collection, requestId)
    logger.info('Return the created collection')
    return collection
    
    
    
}

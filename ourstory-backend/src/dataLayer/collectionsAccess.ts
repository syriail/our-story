import { Collection, TranslableType, Tag } from '../models'
import {createDynamodbClient} from './dynamodb-infrastructure'



export class CollectionAccess{
    constructor (
        private readonly documentClient = createDynamodbClient(),
        private readonly collectionTable = process.env.COLLECTIONS_TABLE,
        private readonly translationsTable = process.env.TRANSLATIONS_TABLE,
        private readonly translationByTypeIndex = process.env.TRANSLATION_BY_TYPE_INDEX
    ){}
    async getCollection(collectionId: string):Promise<{[key:string]:any}>{
        const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
            TableName: this.collectionTable,
            Key:{
                id: collectionId
            }
        }
        const response = await this.documentClient.get(params).promise()
        return response.Item
    }
    async getCollections(userId:string):Promise<{[key:string]:any}[]>{
        const query: AWS.DynamoDB.DocumentClient.ScanInput = {
            TableName: this.collectionTable,
            FilterExpression: 'contains(editors, :userId) OR managerId = :userId',
            ExpressionAttributeValues:{
                ':userId': userId
            }
        }
        const response = await this.documentClient.scan(query).promise()
        return response.Items
    }

    async getCollectionTranslation(collectionId: string, locale: string):Promise<{[key:string]: any}>{
        try{
            const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
                TableName: this.translationsTable,
                Key:{
                    id: collectionId,
                    locale: locale
                }
            }
        const response = await this.documentClient.get(params).promise()
        return response.Item
        }catch(error){
            console.log('Error Call getCollectionTranslation with: ' + collectionId + ',' + locale)
            console.error(error)
            throw error
        }
        
        
    }

    async createCollection(collection: Collection){
        const slugs = collection.tags? collection.tags.map(tag=> tag.slug) : []
        const editorsIds = collection.editors.map(editor => editor.id)
        let transactItems: AWS.DynamoDB.DocumentClient.TransactWriteItemList = []
        const putCollection: AWS.DynamoDB.DocumentClient.TransactWriteItem = {
            Put:{
                TableName: this.collectionTable,
                Item:{
                    id: collection.id,
                    managerId: collection.manager.id,
                    createdAt: collection.createdAt,
                    defaultLocale: collection.defaultLocale,
                    availableTranslations: collection.availableTranslations,
                    tags: slugs,
                    editors: editorsIds
                }
            }
        }
        transactItems.push(putCollection)

        for(const tag of collection.tags){
            const putTagTranslation: AWS.DynamoDB.DocumentClient.TransactWriteItem = {
                Put:{
                    TableName: this.translationsTable,
                    Item:{
                        id: `${collection.id}#${tag.slug}`,
                        translatedType: TranslableType.TAG,
                        tagName: tag.name,
                        locale: collection.defaultLocale
                    }
                }
            }
            transactItems.push(putTagTranslation)
        }
        let translationItem: AWS.DynamoDB.DocumentClient.PutItemInputAttributeMap = {
            id: collection.id,
            translatedType: TranslableType.COLLECTION,
            locale: collection.defaultLocale,
            collectionName: collection.name
        }
        if(collection.description){
            translationItem['collectionDescription'] = collection.description
        }
        const putCollectionTranslation: AWS.DynamoDB.DocumentClient.TransactWriteItem = {
            Put:{
                TableName: this.translationsTable,
                Item:translationItem
            }
        }
        transactItems.push(putCollectionTranslation)

        let transation: AWS.DynamoDB.DocumentClient.TransactWriteItemsInput = {
            TransactItems: transactItems
        }
        try{
            await this.documentClient.transactWrite(transation).promise()
        }catch(error){
            throw error
        }
        
    }
    async getCollectionTagsTranslation(collectionId: string, locale: string):Promise<Tag[]>{
        try{
            const params: AWS.DynamoDB.DocumentClient.QueryInput = {
                TableName: this.translationsTable,
                IndexName: this.translationByTypeIndex,
                KeyConditionExpression:'translatedType = :tag AND begins_with(id, :collectionId)',
                FilterExpression: 'locale = :locale',
                ExpressionAttributeValues:{
                    ':tag': TranslableType.TAG,
                    ':collectionId': collectionId,
                    ':locale': locale
                }
            }
            const response = await this.documentClient.query(params).promise()
            return parseTags(response.Items)
        }catch(error){
            console.log('Error Call getCollectionTagsTranslation with: ' + collectionId + ',' + locale)
            console.error(error)
            throw error
        }
        

    }
    async getAllTagsTranslations(locale: string): Promise<Tag[]>{
        const params: AWS.DynamoDB.DocumentClient.QueryInput = {
            TableName: this.translationsTable,
            IndexName: this.translationByTypeIndex,
            KeyConditionExpression:'translatedType = :tag',
            FilterExpression: 'locale = :locale',
            ExpressionAttributeValues:{
                ':tag': TranslableType.TAG,
                ':locale': locale
            }
        }
        const response = await this.documentClient.query(params).promise()
        return parseTags(response.Items)
    }
    async getTagTranslation(collectionId: string, slug: string, locale: string):Promise<Tag>{
        const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
            TableName: this.translationsTable,
            Key:{
                id: `${collectionId}#${slug}`,
                locale
            }

        }
        const response = await this.documentClient.get(params).promise()
        return parseTag(response.Item)
    }
}



const parseTags = (items: AWS.DynamoDB.DocumentClient.ItemList):Tag[]=>{
    let tags: Tag[] = []
    for(const item of items){
        const tag = parseTag(item)
        tags.push(tag)
    }
    return tags
}

const parseTag = (item: AWS.DynamoDB.DocumentClient.AttributeMap): Tag =>{
    if(!item) return null
    const id = item.id
        const parts = id.split('#')
        const slug = parts[1]
    return {
        slug,
        name: item.tagName
    }
}



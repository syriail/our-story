import {createDynamodbClient} from './dynamodb-infrastructure'
import {MediaFormat, Story, TagValue, TranslableType} from '../models'
import { createLogger } from '../libs/logger'
export class StoryAccess{
    constructor(
        private readonly documentClient = createDynamodbClient(),
        private readonly storiesTable = process.env.STORIES_TABLE,
        private readonly translationsTable = process.env.TRANSLATIONS_TABLE,
        private readonly tagValuesTable = process.env.TAG_VALUES_TABLE,
        private readonly byCollectionIndex = process.env.STORIES_BY_COLLECTION_INDEX
    ){}

    async getStoriesByCollectionId(collectionId: string, requestId: string):Promise<{[key:string]:any}[]>{
        const logger = createLogger(requestId, 'StoryAccess', 'getStoriesByCollectionId')
        logger.info('Collection id: ' + collectionId)
        const parmas: AWS.DynamoDB.DocumentClient.QueryInput = {
            TableName: this.storiesTable,
            IndexName: this.byCollectionIndex,
            KeyConditionExpression: 'collectionId = :collectionId',
            ExpressionAttributeValues:{
                ':collectionId': collectionId
            }
        }
        const response = await this.documentClient.query(parmas).promise()
        logger.info(`Found ${response.Items.length} collection`)
        return response.Items
    }
    async getStroyTranslation(storyId: string, locale: string, requestId: string):Promise<{[key: string]: any}>{
        const logger = createLogger(requestId, 'StoryAccess', 'getStroyTranslation')
        logger.info(`Story id: ${storyId}, locale: ${locale}`)
        const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
            TableName: this.translationsTable,
            Key:{
                id: storyId,
                locale
            }
        }
        const response = await this.documentClient.get(params).promise()
        logger.info('Return story translation')
        return response.Item
    }

    async getStoryById(id: string, requestId: string):Promise<{[key: string]: any}>{
        const logger = createLogger(requestId, 'StoryAccess', 'getStoryById')
        logger.info('Get base story: ' + id)
        const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
            TableName: this.storiesTable,
            Key:{
                id
            }
        }
        const response = await this.documentClient.get(params).promise()
        logger.info('Return base story')
        return response.Item
    }

    async getStoryTagValues(storyId: string, locale: string, requestId: string):Promise<TagValue[]>{
        const logger = createLogger(requestId, 'StoryAccess', 'getStoryTagValues')
        logger.info(`Get tag values of story ${storyId}, locale: ${locale}`)
        const params: AWS.DynamoDB.DocumentClient.QueryInput = {
            TableName: this.tagValuesTable,
            KeyConditionExpression: 'storyId = :storyId',
            FilterExpression: 'locale = :locale',
            ExpressionAttributeValues:{
                ':storyId': storyId,
                ':locale': locale
            }
        }
        const response = await this.documentClient.query(params).promise()
        const tagValues: TagValue[] = []
        for(const item of response.Items){
            const tagIdParts = item.tagId.split('#')
            const tagValue: TagValue = {
                storyId: item.storyId,
                collectionId: tagIdParts[0],
                slug: tagIdParts[1],
                locale,
                name: item.name,
                value: item.value
            }
            tagValues.push(tagValue)
        }
        logger.info(`Found ${tagValues.length} tags`)
        return tagValues
    }
    async createStory(story: Story, requestId: string){
        const logger = createLogger(requestId, 'StoryAccess', 'createStory')
        logger.info('Start create story transaction')
        let transactItems: AWS.DynamoDB.DocumentClient.TransactWriteItemList = []
        //Build the base story with non-translable fields
        let baseStory = {
            id: story.id,
            collectionId: story.collectionId,
            defaultLocale: story.defaultLocale,
            availableTranslations: story.availableTranslations,
            storyType: story.storyType
        }
        if(story.storyTellerAge) baseStory['storyTellerAge'] = story.storyTellerAge
        if(story.storyTellerGender) baseStory['storyTellerGender'] = story.storyTellerGender
        const putStroy: AWS.DynamoDB.DocumentClient.TransactWriteItem = {
            Put:{
                TableName: this.storiesTable,
                Item: baseStory
            }
        }
        transactItems.push(putStroy)
        //Add translation of the translable fields
        let translation = {
            id: story.id,
            storyTitle: story.storyTitle,
            locale: story.defaultLocale,
            translatedType: TranslableType.STORY
        }
        if(story.storyAbstraction) translation['storyAbstraction'] = story.storyAbstraction
        if(story.storyTranscript) translation['storyTranscript'] = story.storyTranscript
        if(story.storyTellerName) translation['storyTellerName'] = story.storyTellerName
        if(story.storyTellerPlaceOfOrigin) translation['storyTellerPlaceOfOrigin'] = story.storyTellerPlaceOfOrigin
        if(story.storyTellerResidency) translation['storyTellerResidency'] = story.storyTellerResidency
        if(story.storyCollectorName) translation['storyCollectorName'] = story.storyCollectorName

        const putTranslation: AWS.DynamoDB.DocumentClient.TransactWriteItem = {
            Put:{
                TableName: this.translationsTable,
                Item: translation
            }
        }
        logger.info(JSON.stringify(putTranslation))
        transactItems.push(putTranslation)
        //Add tag value for each tag
        for(const tag of story.tags){
            const putTagValue: AWS.DynamoDB.DocumentClient.TransactWriteItem = {
                Put:{
                    TableName: this.tagValuesTable,
                    Item: {
                        storyId: story.id,
                        tagId: `${story.collectionId}#${tag.slug}`,
                        locale: story.defaultLocale,
                        name: tag.name,
                        value: tag.value
                    }
                }
            }
            transactItems.push(putTagValue)
        }

        let transation: AWS.DynamoDB.DocumentClient.TransactWriteItemsInput = {
            TransactItems: transactItems
        }
        try{
            await this.documentClient.transactWrite(transation).promise()
            logger.info('Story has been created in Dynamodb')
        }catch(error){
            logger.error(error)
            throw error
        }
    }
    async updateStory(story: Story, requestId: string){
        const logger = createLogger(requestId, 'StoryAccess', 'updateStory')
        logger.info('Start create story transaction')
        let transactItems: AWS.DynamoDB.DocumentClient.TransactWriteItemList = []

        let updateStoryExp = 'SET storyType = :storyType'
        let updateStoryValues = {
            ':storyType': story.storyType
        }
        
        let toSet = []
        let toRemove = []
        story.storyTellerAge ? toSet.push('storyTellerAge') : toRemove.push('storyTellerAge')
        story.storyTellerGender ? toSet.push('storyTellerGender') : toRemove.push('storyTellerGender')
        //Setall fields included in story object
        for(const attr  of toSet){
            updateStoryExp = updateStoryExp + `, ${attr} = :${attr}`
            updateStoryValues[`:${attr}`] = story[attr]
        }
        //Remove all fields which are not included in the updated story
        if(toRemove.length > 0){
            updateStoryExp = updateStoryExp + ` REMOVE ${toRemove[0]}`
            for(let i = 1; i < toRemove.length; i++){
                updateStoryExp = updateStoryExp + `, ${toRemove[i]}`
            }
        }

        const updateStroy: AWS.DynamoDB.DocumentClient.TransactWriteItem = {
            Update:{
                TableName: this.storiesTable,
                Key:{
                    id: story.id
                },
                UpdateExpression: updateStoryExp,
                ExpressionAttributeValues: updateStoryValues
            }
        }
        transactItems.push(updateStroy)

        let updateTranslationExp = 'SET storyTitle = :storyTitle'
        let updateTranslationValues = {
            ":storyTitle": story.storyTitle
        }

        toSet = []
        toRemove = []
        story.storyAbstraction ? toSet.push('storyAbstraction') : toRemove.push('storyAbstraction')
        story.storyTranscript ? toSet.push('storyTranscript') : toRemove.push('storyTranscript')
        story.storyTellerName ? toSet.push('storyTellerName') : toRemove.push('storyTellerName')
        story.storyTellerPlaceOfOrigin ? toSet.push('storyTellerPlaceOfOrigin') : toRemove.push('storyTellerPlaceOfOrigin')
        story.storyTellerResidency ? toSet.push('storyTellerResidency') : toRemove.push('storyTellerResidency')
        story.storyCollectorName ? toSet.push('storyCollectorName') : toRemove.push('storyCollectorName')

        for(const attr  of toSet){
            updateTranslationExp = updateTranslationExp + `, ${attr} = :${attr}`
            updateTranslationValues[`:${attr}`] = story[attr]
        }
        if(toRemove.length > 0){
            updateTranslationExp = updateTranslationExp + ` REMOVE ${toRemove[0]}`
            for(let i = 1; i < toRemove.length; i++){
                updateTranslationExp = updateTranslationExp + `, ${toRemove[i]}`
            }
        }
        const updateTranslation: AWS.DynamoDB.DocumentClient.TransactWriteItem = {
            Update:{
                TableName: this.translationsTable,
                Key:{
                    id: story.id,
                    locale: story.defaultLocale
                },
                UpdateExpression: updateTranslationExp,
                ExpressionAttributeValues: updateTranslationValues
            }
        }
        transactItems.push(updateTranslation)

        for(const tag of story.tags){

            //Using Update won't work when the tag value does not exist
            //Using Add will add the item if not exists or replace it otherwise
            const putTagValue: AWS.DynamoDB.DocumentClient.TransactWriteItem = {
                Put:{
                    TableName: this.tagValuesTable,
                    Item: {
                        storyId: story.id,
                        tagId: `${story.collectionId}#${tag.slug}`,
                        locale: story.defaultLocale,
                        name: tag.name,
                        value: tag.value
                    }
                }
            }
            transactItems.push(putTagValue)
        }


        let transation: AWS.DynamoDB.DocumentClient.TransactWriteItemsInput = {
            TransactItems: transactItems
        }
        try{
            await this.documentClient.transactWrite(transation).promise()
            logger.info('Story has been updated in Dynamodb')
        }catch(error){
            logger.error(error)
            throw error
        }
    }

    async deleteStory(storyId: string, requestId: string){
        const logger = createLogger(requestId, 'StoryAccess', 'deleteStory')
        logger.info('Start delete story transaction' + storyId)
        //Get base story to know how many translations available, to be deleted also
        const baseStory = await this.getStoryById(storyId, requestId)
        let transactItems: AWS.DynamoDB.DocumentClient.TransactWriteItemList = []
        const deleteStroy: AWS.DynamoDB.DocumentClient.TransactWriteItem = {
            Delete:{
                TableName: this.storiesTable,
                Key:{
                    id: storyId
                }
            }
        }
        transactItems.push(deleteStroy)
        //Delete default translation
        const deleteDefaultTranslation: AWS.DynamoDB.DocumentClient.TransactWriteItem = {
            Delete:{
                TableName: this.translationsTable,
                Key:{
                    id: storyId,
                    locale: baseStory.defaultLocale
                }
            }
        }
        transactItems.push(deleteDefaultTranslation)
        //Delete all available translations
        for(const locale of baseStory.availableTranslations){
            const deleteTranslation: AWS.DynamoDB.DocumentClient.TransactWriteItem = {
                Delete:{
                    TableName: this.translationsTable,
                    Key:{
                        id: storyId,
                        locale: locale
                    }
                }
            }
            transactItems.push(deleteTranslation)
        }

        //Delete all tagValues if any
        const tagValuesQuery: AWS.DynamoDB.DocumentClient.QueryInput = {
            TableName: this.tagValuesTable,
            KeyConditionExpression: 'storyId = :storyId',
            ExpressionAttributeValues: {
                ":storyId": storyId
            }
        }
        const tagValuesRes = await this.documentClient.query(tagValuesQuery).promise()
        const tags = tagValuesRes.Items
        for(const tag of tags){
            const deleteTag: AWS.DynamoDB.DocumentClient.TransactWriteItem = {
                Delete:{
                    TableName: this.tagValuesTable,
                    Key:{
                        storyId: storyId,
                        tagId: tag.tagId
                    }
                }
            }
            transactItems.push(deleteTag)
        }
        let transation: AWS.DynamoDB.DocumentClient.TransactWriteItemsInput = {
            TransactItems: transactItems
        }
        
        try{
            await this.documentClient.transactWrite(transation).promise()
            logger.info('Story has been deleted')
        }catch(error){
            logger.error(error)
            throw error
        }

    }

    async addMediaToStory(storyId: string, path: string, format: MediaFormat){
        const fileToAdd = [{
            mediaPath: path,
            format
        }]
        //TODO chenge the exprestion to SET mediaFile = list_append(mediaFiles, :mediaFile)
        const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
            TableName: this.storiesTable,
            Key:{
                id: storyId
            },
            UpdateExpression: 'SET mediaFiles = :mediaFile',
            ExpressionAttributeValues:{
                ':mediaFile': fileToAdd
            }
        }
        await this.documentClient.update(params).promise()
    }
}
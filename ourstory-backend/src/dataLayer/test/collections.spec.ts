import * as AWSXRay from "aws-xray-sdk"
import {Collection} from '../../models'
import {CollectionAccess} from '../collectionsAccess'
const seededCollections = require('../../../db-seeds/collections.json')
const seededTranslations = require('../../../db-seeds/translations.json')
AWSXRay.setContextMissingStrategy("IGNORE_ERROR")

const collectionsAccess  = new CollectionAccess()

describe('Data Access getCollections by employee', ()=>{
    it('Should return the base collections whose ids are 1 and 2 since the employee 2 is either manager or editor in them', async ()=>{
        const employeeId = "2"
        const expectedCollections = seededCollections.filter(collection => collection.managerId === employeeId || collection.editors.includes(employeeId))
        console.log(expectedCollections)
        const baseCollections = await collectionsAccess.getCollections(employeeId)
        expect(baseCollections).toStrictEqual(expectedCollections)
    })
    it('Should return empty list', async ()=>{
        const expectedValue = []
        const baseCollections = await collectionsAccess.getCollections("852")
        expect(baseCollections).toStrictEqual(expectedValue)
    })
})

describe('Data Access getCollection', ()=>{
    it('Should fetch the correct collection 2', async()=>{
        const collectionId = '2'
        const expectedCollection = seededCollections.find(c => c.id === collectionId)
        const receivedCollection = await collectionsAccess.getCollection(collectionId)
        expect(receivedCollection).toStrictEqual(expectedCollection)
    })
})

describe('Data Access getCollectionTranslation', ()=>{
    it('Should return the translation of the given collection', async()=>{
        const id = '1'
        const locale = 'ar'
        const expectedTranslation = seededTranslations.find(t => t.locale === locale && t.id === id)
        const received = await collectionsAccess.getCollectionTranslation(id, locale)
        expect(received).toStrictEqual(expectedTranslation)
    })
    it('Should return undefined since the English translation is not available for collection 1', async()=>{

        const received = await collectionsAccess.getCollectionTranslation('1', 'en')
        expect(received).toBeUndefined()
    })
})
describe('Data Access createCollection', ()=>{
    it('Should create a collection without throwing exception', async()=>{
        const createdAt = '2022-06-24T11:16:21.499Z'
        const newCollection: Collection = {
            id: '963',
            name: 'Collection 963',
            defaultLocale:'en',
            createdAt,
            availableTranslations:[],
            manager:{
                id:'1'
            },
            editors:[
                {
                    id:'2'
                }
            ],
            tags:[
                {
                    slug:'super_tag',
                    name: 'Super Tag'
                }
            ],
        }
        
        expect(async()=>await collectionsAccess.createCollection(newCollection)).not.toThrow()
    })
    it('Should create a collection with the right values', async()=>{
        const createdAt = '2022-06-24T11:16:21.499Z'
        const newCollection: Collection = {
            id: '654',
            name: 'Collection 654',
            defaultLocale:'en',
            createdAt,
            availableTranslations:[],
            manager:{
                id:'1'
            },
            editors:[
                {
                    id:'2'
                }
            ],
            tags:[
                {
                    slug:'super_tag',
                    name: 'Super Tag'
                }
            ],
        }
        await collectionsAccess.createCollection(newCollection)
        const expectedTranslation = {
            "id":"654",
            "locale":"en",
            "translatedType":"COLLECTION",
            "collectionName":"Collection 654"
    
        }
        const expectedCollection = {
            availableTranslations:[],
            createdAt,
            defaultLocale:'en',
            editors:['2'],
            id: '654',
            managerId: '1',
            tags:['super_tag'],
            
            
        }
        const expectedTagsTranslation = [
            {
                slug:'super_tag',
                name: 'Super Tag'
            }
        ]
        const receivedTranslation = await collectionsAccess.getCollectionTranslation('654', 'en')
        const receivedCollections = await collectionsAccess.getCollections('1')
        const receivedTagsTranslation = await collectionsAccess.getCollectionTagsTranslation('654', 'en')
        expect(receivedTranslation).toStrictEqual(expectedTranslation)
        let matches = 0
        for(const receivedCollection of receivedCollections){
            if(receivedCollection.id === expectedCollection.id){
                expect(receivedCollection).toStrictEqual(expectedCollection)
                matches++
            }
        }
        expect(matches).toBe(1)
        expect(receivedTagsTranslation).toStrictEqual(expectedTagsTranslation)
    })
})
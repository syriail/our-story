import * as AWSXRay from "aws-xray-sdk"
import { getCollectionsByEmployee, createCollection, getCollectionDetails } from "../collections"
import {CreateCollectionRequest} from '../../requests/CreateCollectionRequest'
AWSXRay.setContextMissingStrategy("IGNORE_ERROR")

describe('Business Logic getCollections by employee', ()=>{
    it('Should return the collections whose ids are 1 and 2 since the employee 2 is either manager or editor in them', async ()=>{
        const expectedValue = [
            {
                id:"1",
                name: 'Project 1 name in arabic',
                description: 'Project 1 description in arabic',
                manager:{
                    "id": "3",
                    "firstName": "Sarah",
                    "lastName": "Muller",
                    "roles": ["COLLECTION_MANAGER"],
                    "locale": "ar"
                },
                defaultLocale:"ar",
                createdAt: "2022-06-24T10:51:59.154Z",
               editors:[{
                    "id": "2",
                    "firstName": "Mike",
                    "lastName": "Smith",
                    "roles": ["EDITOR"],
                    "locale": "en"
                }],
                availableTranslations:[]
            },
            {
                id:"2",
                name: 'Project 2 name in english',
                manager:{
                    "id": "1",
                    "firstName": "Hussein",
                    "lastName": "Ghrer",
                    "roles": ["ADMIN", "COLLECTION_MANAGER", "EDITOR"],
                    "locale": "en"
                },
                defaultLocale:"en",
                createdAt: "2022-06-24T10:51:59.154Z",
                editors:[
                    {
                        "id": "2",
                        "firstName": "Mike",
                        "lastName": "Smith",
                        "roles": ["EDITOR"],
                        "locale": "en"
                    },
                    {
                        "id": "3",
                        "firstName": "Sarah",
                        "lastName": "Muller",
                        "roles": ["COLLECTION_MANAGER"],
                        "locale": "ar"
                    }
                ],
                availableTranslations:[]
            }
        ]
        const baseCollections = await getCollectionsByEmployee("2", 'ar')
        expect(baseCollections).toStrictEqual(expectedValue)
    })
    it('Should return empty list', async ()=>{
        const expectedValue = []
        const baseCollections = await getCollectionsByEmployee("852", 'en')
        expect(baseCollections).toStrictEqual(expectedValue)
    })
})
describe('Business Logic getCollectionDetails', ()=>{
    it('Should fetch the correct collection details', async()=>{
        const expectedCollection = {
            id:"2",
            name: 'Project 2 name in english',
            manager:{
                "id": "1",
                "firstName": "Hussein",
                "lastName": "Ghrer",
                "roles": ["ADMIN", "COLLECTION_MANAGER", "EDITOR"],
                "locale": "en"
            },
            defaultLocale:"en",
            createdAt: "2022-06-24T10:51:59.154Z",
            editors:[
                {
                    "id": "2",
                    "firstName": "Mike",
                    "lastName": "Smith",
                    "roles": ["EDITOR"],
                    "locale": "en"
                },
                {
                    "id": "3",
                    "firstName": "Sarah",
                    "lastName": "Muller",
                    "roles": ["COLLECTION_MANAGER"],
                    "locale": "ar"
                }
            ],
            availableTranslations:[],
            tags:[
                {
                    slug: 'more_info',
                    name: 'More Info'
                }
            ]
        }
        const receivedCollection = await getCollectionDetails('2', 'en')
        expect(receivedCollection).toStrictEqual(expectedCollection)
    })
})
describe('Business Logic createCollection', ()=>{
    it('Should create the collection with correct vlues', async()=>{
        const request: CreateCollectionRequest = {
            name: 'Collection 654',
            defaultLocale:'en',
            editors:['2'],
            tags:[
                {
                    slug:'super_tag',
                    name: 'Super Tag'
                }
            ],
        }
        const createdCollection = await createCollection(request, '1')
        const receivedCollection = await getCollectionDetails(createdCollection.id, 'en')
        expect(receivedCollection).toStrictEqual(createdCollection)
    })
})
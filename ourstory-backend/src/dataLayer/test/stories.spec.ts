import * as AWSXRay from "aws-xray-sdk"
import {StoryAccess} from '../storiesAccess'
import {Gender, Story, StoryType, TagValue, TranslableType} from '../../models'
import * as uuid from 'uuid'
const seededStories = require('../../../db-seeds/stories.json')
const seededTranslations = require('../../../db-seeds/translations.json')

AWSXRay.setContextMissingStrategy("IGNORE_ERROR")

const storiesAccess  = new StoryAccess()


describe('Data Access getStoriesByCollectionId', ()=>{
    it('Should fetch correct base stories of collectionId 2', async()=>{
        const requestId = uuid.v4()
        const collectionId = '2'
        const expectedStories = seededStories.filter(s => s.collectionId === collectionId)
        const receivedStories = await storiesAccess.getStoriesByCollectionId(collectionId, requestId)
        expect(receivedStories).toStrictEqual(expectedStories)
    })
    it('Should return []', async()=>{
        const requestId = uuid.v4()
        const collectionId = '852'
        const expectedStories = []
        const receivedStories = await storiesAccess.getStoriesByCollectionId(collectionId,requestId)
        expect(receivedStories).toStrictEqual(expectedStories)
    })
})
describe('Data Access getStroyTranslation', ()=>{
    it('Should return the correct story Translation', async()=>{
        const requestId = uuid.v4()
        const storyId = '21'
        const locale = 'en'
        const expectedTranslation = seededTranslations.find(t => t.id === storyId && t.locale === locale)
        const receivedTranslation = await storiesAccess.getStroyTranslation(storyId, locale, requestId)
        expect(receivedTranslation).toStrictEqual(expectedTranslation)
    })
    it('Should return undefined', async()=>{
        const requestId = uuid.v4()
        const storyId = '21963'
        const locale = 'en'
        const receivedTranslation = await storiesAccess.getStroyTranslation(storyId, locale, requestId)
        expect(receivedTranslation).toBeUndefined()
    })
})

describe('Data Access createStory', ()=>{
    const requestId = uuid.v4()
    it('Should create a story with all optional fields, translation and tags successfully', async()=>{
        const storyId = '789456'
        const collectionId = '1'
        const locale = 'ar'
        const story: Story = {
            id: storyId,
            collectionId:collectionId,
            storyTitle:'Story title in arabic',
            defaultLocale: locale,
            storyType: StoryType.FABLE,
            storyAbstraction: 'Story abstraction in arabic',
            storyTranscript: 'Story transcript in Arabic',
            availableTranslations:[],
            storyTellerAge: 23,
            storyTellerGender: Gender.FEMALE,
            storyTellerName: 'Teller name in arabic',
            storyTellerPlaceOfOrigin: 'Place of oringin in arabic',
            storyTellerResidency: 'Place of residency in arabic',
            tags:[
                {
                    storyId: storyId,
                    collectionId,
                    locale,
                    name:'Topic in Arabic',
                    slug:'topic',
                    value:'Story value of topic in arabic'
                },
                {
                    storyId: storyId,
                    collectionId,
                    locale,
                    name:'Area in Arabic',
                    slug:'area',
                    value:'Story value of area in araic'
                }
            ]
        }
        await storiesAccess.createStory(story, requestId)
        const receivedBaseStroy = await storiesAccess.getStoryById(storyId, requestId)
        const receivedTranslation = await storiesAccess.getStroyTranslation(storyId, locale, requestId)
        const receivedTagValues = await storiesAccess.getStoryTagValues(storyId, locale, requestId)

        const expectedBaseStory = {
            id: storyId,
            collectionId:collectionId,
            defaultLocale: locale,
            storyType: StoryType.FABLE,
            availableTranslations:[],
            storyTellerAge: 23,
            storyTellerGender: Gender.FEMALE
        }
        const expectedTranslation = {
            id: storyId,
            translatedType: TranslableType.STORY,
            locale,
            storyTitle:'Story title in arabic',
            storyAbstraction: 'Story abstraction in arabic',
            storyTranscript: 'Story transcript in Arabic',
            storyTellerName: 'Teller name in arabic',
            storyTellerPlaceOfOrigin: 'Place of oringin in arabic',
            storyTellerResidency: 'Place of residency in arabic',
        }
        const expectedTagValues = [
            {
                storyId: storyId,
                collectionId,
                locale,
                name:'Area in Arabic',
                slug:'area',
                value:'Story value of area in araic'
            },
            {
                storyId: storyId,
                collectionId,
                locale,
                name:'Topic in Arabic',
                slug:'topic',
                value:'Story value of topic in arabic'
            }
        ]
        expect(receivedBaseStroy).toStrictEqual(expectedBaseStory)
        expect(receivedTranslation).toStrictEqual(expectedTranslation)
        expect(receivedTagValues).toStrictEqual(expectedTagValues)
    })
    it('Should create a story with only mandatory fields, translation and no tags successfully', async()=>{
        const requestId = uuid.v4()
        const storyId = '789457'
        const collectionId = '1'
        const locale = 'ar'
        const story: Story = {
            id: storyId,
            collectionId:collectionId,
            storyTitle:'Story title in arabic',
            defaultLocale: locale,
            storyType: StoryType.FABLE,
            availableTranslations:[],
            tags:[]
        }
        await storiesAccess.createStory(story, requestId)
        const receivedBaseStroy = await storiesAccess.getStoryById(storyId, requestId)
        const receivedTranslation = await storiesAccess.getStroyTranslation(storyId, locale, requestId)

        const expectedBaseStory = {
            id: storyId,
            collectionId:collectionId,
            defaultLocale: locale,
            storyType: StoryType.FABLE,
            availableTranslations:[]
        }
        const expectedTranslation = {
            id: storyId,
            translatedType: TranslableType.STORY,
            locale,
            storyTitle:'Story title in arabic'
        }

        expect(receivedBaseStroy).toStrictEqual(expectedBaseStory)
        expect(receivedTranslation).toStrictEqual(expectedTranslation)
    })
})

describe('Data Access updateStory', ()=>{
    const storyId = '789458'
    const collectionId = '1'
    const locale = 'ar'
    let story: Story = {
        id: storyId,
        collectionId:collectionId,
        storyTitle:'Story title in arabic',
        defaultLocale: locale,
        storyType: StoryType.FABLE,
        availableTranslations:[],
        tags:[]
    }
    it('Should update story type successfully', async()=>{
        const requestId = uuid.v4()
        
        await storiesAccess.createStory(story, requestId)
        //Make sure the story is successfully and correctly created
        const receivedBaseStroy = await storiesAccess.getStoryById(storyId, requestId)
        const receivedTranslation = await storiesAccess.getStroyTranslation(storyId, locale, requestId)

        const expectedBaseStory = {
            id: storyId,
            collectionId:collectionId,
            defaultLocale: locale,
            storyType: StoryType.FABLE,
            availableTranslations:[]
        }
        const expectedTranslation = {
            id: storyId,
            translatedType: TranslableType.STORY,
            locale,
            storyTitle:'Story title in arabic'
        }

        expect(receivedBaseStroy).toStrictEqual(expectedBaseStory)
        expect(receivedTranslation).toStrictEqual(expectedTranslation)

        //Update story type
        story.storyType = StoryType.FACETIOUS
        await storiesAccess.updateStory(story, requestId)
        const updatedBaseStory = await storiesAccess.getStoryById(storyId, requestId)
        expect(updatedBaseStory.storyType).toBe(StoryType.FACETIOUS)

    })
    it('Should update story title successfully', async()=>{
        const requestId = uuid.v4()
        const newTitle = 'Updated title'
        const expectedTranslation = {
            id: storyId,
            translatedType: TranslableType.STORY,
            locale,
            storyTitle: newTitle
        }
        story.storyTitle = newTitle
        await storiesAccess.updateStory(story, requestId)
        const receivedTranslation = await storiesAccess.getStroyTranslation(storyId, locale, requestId)
        expect(receivedTranslation).toStrictEqual(expectedTranslation)
    })

    it('Should update storyTeller age and gender, story abstraction and transcript, and add tag value', async()=>{
        const requestId = uuid.v4()
        const storyTitle = 'brand new title'
        const abstraction = 'story abstraction'
        const transcript = 'story transcript'
        const age = 34
        const gender = Gender.FEMALE
        const type = StoryType.FAIRY
        const expectedTagValues: TagValue[] = [
            {
                collectionId: story.collectionId,
                storyId: story.id,
                slug:'topic',
                name:'Topic',
                value:'Animals',
                locale: locale
            }
        ]
        story.storyAbstraction = abstraction
        story.storyType = type
        story.storyTranscript = transcript
        story.storyTitle = storyTitle
        story.storyTellerAge = age
        story.storyTellerGender = gender
        story.tags = expectedTagValues
        const expectedBaseStory = {
            id: storyId,
            collectionId:collectionId,
            defaultLocale: locale,
            storyType: type,
            availableTranslations:[],
            storyTellerAge: age,
            storyTellerGender: gender

        }
        const expectedTranslation = {
            id: storyId,
            translatedType: TranslableType.STORY,
            locale,
            storyTitle: storyTitle,
            storyTranscript: transcript,
            storyAbstraction: abstraction
        }
        await storiesAccess.updateStory(story, requestId)
        const receivedBaseStory = await storiesAccess.getStoryById(storyId, requestId)
        const receivedTranslation = await storiesAccess.getStroyTranslation(storyId, locale, requestId)
        const receivedTags = await storiesAccess.getStoryTagValues(storyId, locale, requestId)

        expect(receivedBaseStory).toStrictEqual(expectedBaseStory)
        expect(receivedTranslation).toStrictEqual(expectedTranslation)
        expect(receivedTags).toStrictEqual(expectedTagValues)
    })
    it('Should update tag value correctly', async()=>{
        const requestId = uuid.v4()
        const expectedTagValues: TagValue[] = [
            {
                collectionId: story.collectionId,
                storyId: story.id,
                slug:'topic',
                name:'Topic',
                value:'new tag value',
                locale: locale
            }
        ]
        story.tags = expectedTagValues
        //Make sure they don't match before update
        let receivedTags = await storiesAccess.getStoryTagValues(storyId, locale, requestId)
        expect(receivedTags).not.toStrictEqual(expectedTagValues)
        //Update the story
        await storiesAccess.updateStory(story, requestId)
        receivedTags = await storiesAccess.getStoryTagValues(storyId, locale, requestId)
        expect(receivedTags).toStrictEqual(expectedTagValues)

    })
    it('Should update storyTellerAge and transcript and remove abstraction and storyTellerGender', async()=>{
        const requestId = uuid.v4()
        const newTranscript = 'new transcript'
        const newAge = 92
        const expectedBaseStory = {
            id: storyId,
            collectionId:collectionId,
            defaultLocale: locale,
            storyType: story.storyType,
            availableTranslations:[],
            storyTellerAge: newAge
        }
        const expectedTranslation = {
            id: storyId,
            translatedType: TranslableType.STORY,
            locale,
            storyTitle: story.storyTitle,
            storyTranscript: newTranscript
        }
        story.storyTellerAge = newAge
        story.storyTranscript = newTranscript
        story.storyAbstraction = null
        story.storyTellerGender = null

        await storiesAccess.updateStory(story, requestId)
        const receivedBaseStory = await storiesAccess.getStoryById(storyId, requestId)
        const receivedTranslation = await storiesAccess.getStroyTranslation(storyId, locale, requestId)

        expect(receivedBaseStory).toStrictEqual(expectedBaseStory)
        expect(receivedTranslation).toStrictEqual(expectedTranslation)

    })
})
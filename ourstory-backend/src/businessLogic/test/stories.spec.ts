import * as AWSXRay from "aws-xray-sdk"
import {getStoriesByCollection, getStoryDetails, createStory, updateStory} from '../stories'
import {Story, StoryType} from '../../models'
import CreateStoryRequest from '../../requests/CreateStoryRequest'
const seededStories = require('../../../db-seeds/stories.json')
const seededTranslations = require('../../../db-seeds/translations.json')
const seededTagValues = require('../../../db-seeds/tag-values.json')
AWSXRay.setContextMissingStrategy("IGNORE_ERROR")

describe('Business Logic getStoriesByCollection', ()=>{
    it('Should return the correct stories of collection 2', async()=>{
        const collectionId = '2'
        const locale = 'en'
        const seededStories = buildSeededStories(locale)
        const expectedStories = seededStories.filter(s => s.collectionId === collectionId)
        const receivedStories = await getStoriesByCollection(collectionId, locale)
        expect(receivedStories).toStrictEqual(expectedStories)
    })
    it('Should return empty list', async()=>{
        const collectionId = '274112'
        const locale = 'en'
        const expectedStories = []
        const receivedStories = await getStoriesByCollection(collectionId, locale)
        expect(receivedStories).toStrictEqual(expectedStories)
    })
})

describe('Business Logic getStoryDetails', ()=>{
    it('Should return the correct seeded story details', async()=>{
        const storyId = '21'
        const locale = 'en'
        const expectedStory = buildSeededStoryDetails(storyId, locale)
        const receivedStory = await getStoryDetails(storyId, locale)
        expect(receivedStory).toStrictEqual(expectedStory)
    })
})

describe('Business Logic createStory', ()=>{
    it('Should create a story with only required fields and return correct values', async()=>{
        const locale = 'en'
        const request: CreateStoryRequest = {
            collectionId: '2',
            defaultLocale: locale,
            storyType: StoryType.FABLE,
            storyTitle: 'New Collection title'
        }
        const expectedStory = await createStory(request)
        
        const receivedStory = await getStoryDetails(expectedStory.id, locale)
        expect(receivedStory).toStrictEqual(expectedStory)
    })
})

describe('Business Logic update story', ()=>{
    it('Should update storyType, title, tellerAge and transcript correctly', async()=>{
        const storyId = '21'
        const locale = 'en'
        let story = buildSeededStoryDetails(storyId, locale)
        
        story.storyType = StoryType.REAL_STORY
        story.storyTitle = 'brand new title'
        story.storyTellerAge = 100
        story.storyTranscript = 'Brand new transcript'

        // const updateRequest: CreateStoryRequest = {
        //     title: story.title,
        //     abstraction: story.abstraction,
        //     transcript: story.transcript,
        //     defaultLocale: story.defaultLocale,
        //     storyTellerAge: story.storyTellerAge,
        //     storyTellerGender: story.storyTellerGender,
        //     storyTellerName: story.tellerName,
        //     storyTellerPlaceOfOrigin: story.tellerPlaceOfOrigin,
        //     collectionId: story.collectionId,
        //     collectorName: story.collectorName,
        //     storytellerResidency: story.tellerResidency,
        //     storyType: story.storyType,
        //     tags: story.tags
        // }
        const updateRequest: CreateStoryRequest = story

        await updateStory(storyId, updateRequest)

        const receivedStory = await getStoryDetails(storyId, locale)

        expect(receivedStory).toStrictEqual(story)

    })
})

//Build list of the seeded stories with only base stories and the translation
// of default locale. It does not add any tags information
const buildSeededStories = (locale: string):Story[]=>{
    let stories: Story[] = []
    for(const baseStory of seededStories){
        const targetLocale = baseStory.availableTranslations.includes(locale) ? locale : baseStory.defaultLocale
        const translation = seededTranslations.find(t => t.id === baseStory.id && t.locale === targetLocale)
        let story: Story = {
            id: baseStory.id,
            collectionId: baseStory.collectionId,
            defaultLocale: baseStory.defaultLocale,
            availableTranslations: baseStory.availableTranslations,
            storyTitle: translation.storyTitle,
            storyType: baseStory.storyType
        }
        if(baseStory.storyTellerAge) story.storyTellerAge = baseStory.storyTellerAge
        if(baseStory.storyTellerGender) story.storyTellerGender = baseStory.storyTellerGender
        if(baseStory.mediaFiles) story.mediaFiles = baseStory.mediaFiles
        if(translation.storyAbstraction) story.storyAbstraction = translation.storyAbstraction
        if(translation.storyTranscript) story.storyTranscript = translation.storyTranscript
        if(translation.storyTellerName) story.storyTellerName = translation.storyTellerName
        if(translation.storyTellerPlaceOfOrigin) story.storyTellerPlaceOfOrigin = translation.storyTellerPlaceOfOrigin
        if(translation.storyTellerResidency) story.storyTellerResidency = translation.storyTellerResidency
        if(translation.storyCollectorName) story.storyCollectorName = translation.storyCollectorName
        stories.push(story)
    }
    return stories
    
}
//Build the full details of a seeded story
const buildSeededStoryDetails = (storyId: string, locale: string):Story=>{
    let baseStory = seededStories.find(ss => ss.id === storyId)
    const targetLocale = baseStory.availableTranslations.includes(locale) ? locale : baseStory.defaultLocale
    const translation = seededTranslations.find(t => t.id === baseStory.id && t.locale === targetLocale)
    let story: Story = {
        id: baseStory.id,
        collectionId: baseStory.collectionId,
        defaultLocale: baseStory.defaultLocale,
        availableTranslations: baseStory.availableTranslations,
        storyTitle: translation.storyTitle,
        storyType: baseStory.storyType
    }
    if(baseStory.storyTellerAge) story.storyTellerAge = baseStory.storyTellerAge
    if(baseStory.storyTellerGender) story.storyTellerGender = baseStory.storyTellerGender
    if(baseStory.mediaFiles) story.mediaFiles = baseStory.mediaFiles
    if(translation.storyAbstraction) story.storyAbstraction = translation.storyAbstraction
    if(translation.storyTranscript) story.storyTranscript = translation.storyTranscript
    if(translation.storyTellerName) story.storyTellerName = translation.storyTellerName
    if(translation.storyTellerPlaceOfOrigin) story.storyTellerPlaceOfOrigin = translation.storyTellerPlaceOfOrigin
    if(translation.storyTellerResidency) story.storyTellerResidency = translation.storyTellerResidency
    if(translation.storyCollectorName) story.storyCollectorName = translation.storyCollectorName

    const filteredTags = seededTagValues.filter(s => s.storyId === storyId && s.locale === targetLocale)
    const tags = filteredTags.map((s)=>{
        
        const tagIdParts = s.tagId.split('#')
            return {
                storyId,
                collectionId: tagIdParts[0],
                slug: tagIdParts[1],
                locale,
                name: s.name,
                value: s.value
            }
    })
    story.tags = tags
    return story
    
}




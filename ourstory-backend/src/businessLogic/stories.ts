import { StoryAccess } from "../dataLayer/storiesAccess";
import {CollectionAccess} from '../dataLayer/collectionsAccess'
import {Story, TagValue, UploadAttachmentData, MediaFormat } from "../models";
import * as uuid from 'uuid'
import CreateStoryRequest from '../requests/CreateStoryRequest';
import BucketAccess from "../dataLayer/bucketAcess";

const storyAccess = new StoryAccess()
const collectionAccess = new CollectionAccess()
const bucketAcess = new BucketAccess()

export const getStoriesByCollection = async(collectionId:string, locale:string):Promise<Story[]> =>{
    let stories: Story[] = []
    const baseStories = await storyAccess.getStoriesByCollectionId(collectionId)
    for(const baseStory of baseStories){
        const targetLocale = baseStory.availableTranslations.includes(locale) ? locale : baseStory.defaultLocale
        const translation = await storyAccess.getStroyTranslation(baseStory.id, targetLocale)
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

export const getStoryDetails = async(storyId: string, locale: string): Promise<Story> =>{
    const baseStory = await storyAccess.getStoryById(storyId)
    const targetLocale = baseStory.availableTranslations.includes(locale) ? locale : baseStory.defaultLocale
    const translation = await storyAccess.getStroyTranslation(storyId, targetLocale)
    const tags = await storyAccess.getStoryTagValues(storyId, targetLocale)
    let story: Story = {
        id: baseStory.id,
        collectionId: baseStory.collectionId,
        defaultLocale: baseStory.defaultLocale,
        availableTranslations: baseStory.availableTranslations,
        storyTitle: translation.storyTitle,
        storyType: baseStory.storyType,
        tags
    }
    //TODO spread baseStory instead
    if(baseStory.storyTellerAge) story.storyTellerAge = baseStory.storyTellerAge
    if(baseStory.storyTellerGender) story.storyTellerGender = baseStory.storyTellerGender
    if(baseStory.mediaFiles) story.mediaFiles = baseStory.mediaFiles
    if(translation.storyAbstraction) story.storyAbstraction = translation.storyAbstraction
    if(translation.storyTranscript) story.storyTranscript = translation.storyTranscript
    if(translation.storyTellerName) story.storyTellerName = translation.storyTellerName
    if(translation.storyTellerPlaceOfOrigin) story.storyTellerPlaceOfOrigin = translation.storyTellerPlaceOfOrigin
    if(translation.storyTellerResidency) story.storyTellerResidency = translation.storyTellerResidency
    if(translation.storyCollectorName) story.storyCollectorName = translation.storyCollectorName

    return story
}
export const createStory = async(request: CreateStoryRequest): Promise<Story>=>{
    const id = uuid.v4()
    const story = await buildStoryFromRequest(id, request)

    await storyAccess.createStory(story)
    return story
}

export const updateStory = async(storyId: string, request: CreateStoryRequest): Promise<Story> =>{
    const story = await buildStoryFromRequest(storyId, request)
    await storyAccess.updateStory(story)
    return getStoryDetails(storyId, story.defaultLocale)

}

export const deleteStory = async(storyId: string) =>{
    await storyAccess.deleteStory(storyId)
}

const buildStoryFromRequest = async(storyId:string, request: CreateStoryRequest): Promise<Story> =>{
    let tags: TagValue[] = []
    if(request.tags){
        for(const tag  of request.tags){
            const tagTranslation = await collectionAccess.getTagTranslation(request.collectionId, tag.slug, request.defaultLocale)
            tags.push({
                storyId,
                collectionId: request.collectionId,
                locale: request.defaultLocale,
                name: tagTranslation.name,
                slug: tag.slug,
                value: tag.value
            })
        }
    }
    let story: Story = {
        id: storyId,
        ...request,
        availableTranslations: [],
        tags
    }
    return story
}

/**
 * Get signed upload url for TODO image
 * @param storyId The story id to which the media belog
 * @param mediaFormat The format of the media, VIDEO, AUDIO or IMAGE
 * @param fileExtension The extension of the file to be uploaded like mp4, png ..etc
 *
 * @returns singned url as string and the path in the bucket
 */
 export const getUploadUrls = (storyId: string, mediaFromat: MediaFormat, fileExtension: string): UploadAttachmentData=>{
    const randomNumber = Math.floor(Math.random() * 100);
    let key = `${storyId}_${randomNumber}.${fileExtension}`
    switch(mediaFromat){
        case MediaFormat.AUDIO:
            key = 'audio/' + key
            break
        case MediaFormat.VIDEO:
            key = 'raw-video/' + key
            break
        case MediaFormat.IMAGE:
        key = 'image/' + key
        break
    }
    const urls: UploadAttachmentData = bucketAcess.getMediaUploadUrls(key)

    return urls
}


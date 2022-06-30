
export default interface CreateStoryRequest{
    collectionId: string
    storyTitle: string
    defaultLocale: string
    storyType: string
    storyAbstraction?: string
    storyTranscript?: string
    storyTellerAge?: number
    storyTellerGender?: string
    storyTellerName?: string
    storyTellerPlaceOfOrigin?: string
    storyTellerResidency?:string
    storyCollectorName?:string
    tags?:TagValueRequest[]
}
interface TagValueRequest{
    slug: string
    value: string
}
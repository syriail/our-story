export enum MediaFormat {
    AUDIO = 'AUDIO',
    VIDEO = 'VIDEO',
    IMAGE = 'IMAGE',
  }
  export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    UNSPECIFIED = 'UNSPECIFIED'
  }
  export enum StoryType {
    HISTORY = 'HISTORY',
    REAL_STORY = 'REAL_STORY',
    SAYING = 'SAYING',
    SAYING_EXPLANATION = 'SAYING_EXPLANATION',
    FAIRY = 'FAIRY',
    FABLE = 'FABLE',
    FACETIOUS = 'FACETIOUS',
    FOLK_SONG = 'FOLK_SONG',
    RIDDLE = 'RIDDLE'
  }
  export enum EmployeeRole {
    ADMIN = 'ADMIN',
    COLLECTION_MANAGER = 'COLLECTION_MANAGER',
    EDITOR = 'EDITOR'
  }
  export enum TranslableType{
    COLLECTION = 'COLLECTION',
    STORY = 'STORY',
    TAG = 'TAG'
  }
  export interface MediaFile {
    format: MediaFormat,
    mediaPath: string
  }
  
  export interface Tag{
    slug: string,
    name?: string
  }
  export interface Employee{
    id: string,
    firstName?: string,
    lastName?: string,
    locale?: String,
    roles?: EmployeeRole[]
  }
  export interface Collection{
    id: string
    name: string
    description?: string
    createdAt: string
    manager: Employee
    availableTranslations: string[]
    defaultLocale: string
    editors?: Employee[]
    tags?: Tag[]
  }
  export interface Story{
    id: string
    collectionId: string
    defaultLocale: string
    availableTranslations: string[]
    storyTitle: string
    storyAbstraction?: string
    storyTranscript?: string
    storyTellerName?: string
    storyTellerPlaceOfOrigin?: string
    storyTellerResidency?: string
    storyCollectorName?: string
    mediaFiles?: MediaFile[]
    storyType: string
    storyTellerAge?: number
    storyTellerGender?: string
    tags?: TagValue[]
  }
  export interface TagValue{
    storyId: string
    collectionId: string
    locale: string
    slug: string
    name: string
    value: string
  }

export interface UploadAttachmentData{
  uploadUrl: string
  attachmentUrl: string
}
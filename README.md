# OUR STORY

Our Story aka. Ourstory project is a **multi-lingual, flexible and expandable** archive of collections of stories. Visitors can search this archive for stories. The archive does not only support simple text search, but rahter semantic search.

## Story

A story is a material collected by researchers and mostly told by someone. A story could be oral history, folklore songs, fairy tale..etch

Stories could be backed with video, audio or image media such as a film recording the story teller while telling the story.

## Collection

Stories are collected in a context of projects carried out by organizations interested in heritage and oral history of people.

All stories collected in a context of a project are organized in collection. Hakawati Collection is an example of such project in which more than 400 stories were collected.

# Summary For Udacity Review

## APIs Summary

### Get Collections

It fetches all the collection which the user is the manager of or editor

- REST API: GET /collections?locale={locale}

- Authorized Roles: Collection Manager, Collection Editor

- Query Params:

  - locale: The user locale to fetch information accordingly

- Returns: List of collections `{ collections: []}`

### Create Collection

- REST API: POST /collections

- Athorized Roles: Collection Manger

- Body Params:

  - defaultLocale: The default language of the collection
  - name: Collection's name
  - description?: Collection's description
  - managerId: Manager's id
  - editors?: List of editors' ids `editors:[string]`
  - tags?: List of slugs of collection-specific fields `tags:[{slug, name}]`

- Returns: The newely added collectoin

### Create Story

Add a story to a collection in Collection's default language

- REST API: POST /stories

- Authorized Roles: Collection Manager, Collection Editor

- Body Params:

  - collectionId: Collection id
  - defaultLocale: The default language in which the collection was originally created
  - storyType: The type of the story, picked from pre-defined list
  - storyTitle: Story's title in user's language if available
  - storyTellerAge?: The age of story teller
  - storyTellerGender?: The gender of the story teller
  - tags?: Tags values for this story `tags:[{id, slug, name, tagValue}]`
  - storyAbstraction?: The abstraction of the story
  - storyTranscript?: The transcript of the story
  - storyTellerName?: The name of the story teller
  - storyTellerPlaceOfOrigin?: Place of origin of the story teller
  - storytellerResidency?: The residency of the story teller
  - storyCollectorName?: The name of the person who collected the story

# Features

The archive has the following main features:

- **Expandable:** Collections and stories could be added dynamically.
- **Flexible:** Collection-specific fields can be defined dynamically, so these fields appear only in stories which belong to this collection.
- **Multi-lingual:** A new language could be added with a minimum technical efforts.
- **Semantically Searchable:** Archive supports semantic search according to each language's characterstics such as plural recognition in Arabic.
- **Role-based Functionalities:** Users can perform actions based on their role in the system and their role in each collection.

# System Parts

The system consists of three **_separate_** parts (sub-projects)

## Backend

The server-side components and services which provide the core funcionalities and logic of the system.

## Manager

A web application where authorized users can define collections, add stories and translate stories

## Frontend

Where visitors search for stories and get the results accordingly.

# System Architecture

Manager and Frontend are web applications built using React framework and they connect to backend by REST APIs.

The main focus of this section is the backend architecture since it contains the components and logic of the system.

![Backend Architect](./ourstory-backend-architect.png)

# APIs

## Get Collections

It fetches all the collection which the user is the manager of or editor

- REST API: GET /collections?locale={locale}

- Authorized Roles: Collection Manager, Collection Editor

- Query Params:

  - locale: The user locale to fetch information accordingly

- Returns: List of collections `{ collections: []}`
  - id: Collection id
  - name: Collection's name in user's language if available, otherwise in default language
  - description: Collection's description in user's language if available, otherwise in default language
  - defaultLocale: The default language in which the collection was originally created
  - availableTranslations: The languages the collection is translated into execluding the default locale. Expample `['ar', 'de']`
  - manager: Collection manager's name
  - createdAt: Create date
  - Editors: list of authorized editors names `{editors:[string]}`

## Create Collection

- REST API: POST /collections

- Athorized Roles: Collection Manger

- Body Params:

  - defaultLocale: The default language of the collection
  - name: Collection's name
  - description?: Collection's description
  - managerId: Manager's id
  - editors?: List of editors' ids `editors:[string]`
  - tags?: List of slugs of collection-specific fields `tags:[{slug, name}]`

- Returns: The newely added collectoin
  - id: Collection id
  - name: Collection's name in user's language if available, otherwise in default language
  - description?: Collection's description in user's language if available, otherwise in default language
  - defaultLocale: The default language in which the collection was originally created
  - availableTranslations: The languages the collection is translated into execluding the default locale. Expample `['ar', 'de']`
  - manager: Collection manager's name
  - createdAt: Create date
  - Editors?: list of authorized editors names

## Get Collection

- REST API: GET /collections/{collectionId}?locale={locale}

- Authorized Roles: Collection Manager, Collection Editor

- Params:

  - collectionId: Collection's id
  - locale: The language in which the data need to be presented

- Returns: Collection's details
  - id: Collection id
  - name: Collection's name in user's language if available, otherwise in default language
  - description?: Collection's description in user's language if available, otherwise in default language
  - defaultLocale: The default language in which the collection was originally created
  - availableTranslations: The languages the collection is translated into execluding the default locale. Expample `['ar', 'de']`
  - manager: Collection manager's name
  - createdAt: Create date
  - Editors?: list of authorized editors `editors[{id, name}]`
  - tags?: Collection's tags `tags:[{id, slug, name}]`

## Create Story

Add a story to a collection in Collection's default language

- REST API: POST /stories

- Authorized Roles: Collection Manager, Collection Editor

- Body Params:

  - collectionId: Collection id
  - defaultLocale: The default language in which the collection was originally created
  - storyType: The type of the story, picked from pre-defined list
  - storyTitle: Story's title in user's language if available
  - storyTellerAge?: The age of story teller
  - storyTellerGender?: The gender of the story teller
  - tags?: Tags values for this story `tags:[{id, slug, name, tagValue}]`
  - storyAbstraction?: The abstraction of the story
  - storyTranscript?: The transcript of the story
  - storyTellerName?: The name of the story teller
  - storyTellerPlaceOfOrigin?: Place of origin of the story teller
  - storytellerResidency?: The residency of the story teller
  - storyCollectorName?: The name of the person who collected the story

- Returns: The newly created story
  - id: Story id
  - collectionId: Collection id
  - defaultLocale: The default language in which the collection was originally created
  - storyType: The type of the story
  - storyTitle: Story's title in user's language if available, otherwise in default language
  - storyTellerAge?: The age of story teller
  - storyTellerGender?: The gender of the story teller
  - storyTitle: Story title
  - storyAbstraction?: The abstraction of the story
  - storyTranscript?: The transcript of the story
  - storyTellerName?: The name of the story teller
  - storyTellerPlaceOfOrigin?: Place of origin of the story teller
  - storytellerResidency?: The residency of the story teller
  - storyCollectorName?: The name of the person who collected the story

## Get Story Details

- REST API: GET /stories/details/{storyId}?locale={locale}

- Authorized Roles: Collection Manager, Collection Editor

- Params:

  - storyId: Story id,
  - locale: The language in which the data need to be presented

- Returns: List of stories `{stories:[]}`
  - id: Story id
  - collectionId: Collection's id
  - defaultLocale: The default language in which the collection was originally created
  - storyType: The type of the story
  - storyTitle: Story's title in the given language if available, otherwise in default language
  - storyTellerAge?: The age of story teller
  - storyTellerGender?: The gender of the story teller
  - tags?: Tags values for this story `tags:[{id, slug, name, tagValue}]`
  - title: Story title
  - storyAbstraction?: The abstraction of the story
  - storyTranscript?: The transcript of the story
  - storyTellerName?: The name of the story teller
  - storyTellerPlaceOfOrigin?: Place of origin of the story teller
  - storytellerResidency?: The residency of the story teller
  - storyCollectorName?: The name of the person who collected the story
  - mediaFiles?: List of available media `mediaFiles:[format, mediaPath]` format is one of VIDEO, AUDIO or IMAGE

## Get Upload Signed Url

Gets a signed url to upload a media file to S3 media bucket

- REST API: GET /uploadUrl/{storyId}

- Authorized Roles: Collection Manager, Collection Editor

- Params:

  - storyId: Story id

- Returns:
  - uploadUrl: Signed url to upload the file to
  - attachmentUrl: The path which the story should store to refer to the media

# Data Model

```
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

```

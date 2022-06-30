# DB Design

The expected read/write operations are very low and the very most of operations are to be triggered from Manger, so the only requirement to be met when choosing DB service is cost.

Dynamodb meets this only requirement since it is expected that read/write operations won't exceed the free tier.

Also since high speed IOs is not a requirement, so we don't need to complicate the design and follow one-table approch, rather a separate table will be provided for most of models as if a rational DB is to be designed.

## Collection Table

Key:

- id: String / HASH

Expected Attributes:

- managerId: String
- defaultLocale: String
- availableTranslations: [String]
- editors: [String]
- tags: [String]

## Story Table

Key:

- id: String / HASH
- collectionId / RANGE

Expected Attributes:

- defaultLocale: String
- storyType: String
- storyTellerAge: Int
- storyTellerGender: String
- availableTranslations: [String]
- mediaFiles: List of map {format, mediaPath}

## TagValue Table

Key:

- storyId: String / HASH
- tagId: String /RANGE
  tagId is in the form of collectionId#slug

Expected Attributes:

- locale: String
- name: String
- value: String

## Translation Table

Key:

- id: String / HASH
  id is the id of the item to be translated, such as projectId or storyId
- locale: String / RANGE

Possible Attributes: _Depending on what item to be translated_

- translatedType: String
- collectionName: String
- collectionDescription: String
- tagName: String
- storyTitle: String
- storyAbstraction: String
- storyTranscript: String
- storyTellerName: String
- storyTellerPlaceOfOrigin: String
- storytellerResidency: String
- collectorName: String

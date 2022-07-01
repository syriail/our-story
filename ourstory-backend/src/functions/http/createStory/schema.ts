export default{
    "$schema": "http://json-schema.org/draft-06/schema#",
    definitions:{
        tag:{
            type: 'object',
            properties:{
                slug:{type: 'string', minLength: 1},
                value:{type: 'string', minLength: 1}
            },
            required: ['slug', 'value']
        }

    },
    type: 'object',
    properties:{
        storyTitle: {type: 'string', minLength: 1},
        collectionId: {type: 'string', minLength: 1},
        defaultLocale: {type: 'string'},
        storyType: {type: 'string', minLength: 1},
        storyAbstraction: {type: 'string', minLength: 1},
        storyTranscript: {type: 'string', minLength: 1},
        storyTellerAge: {type: 'number'},
        storyTellerGender: {type: 'string', minLength: 1},
        storyTellerName: {type: 'string', minLength: 1},
        storyTellerPlaceOfOrigin: {type: 'string', minLength: 1},
        storyTellerResidency: {type: 'string', minLength: 1},
        storyCollectorName: {type: 'string', minLength: 1},
        tags:{
            type: 'array',
            items:{
                $ref: '#/definitions/tag'
            }
        }
    },
    required: ['storyTitle', 'defaultLocale', 'collectionId', 'storyType']
    
} as const
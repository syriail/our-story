export default{
    type: 'object',
    properties:{
        storyTitle: {type: 'string', minLength: 1},
        collectionId: {type: 'string', minLength: 1},
        defaultLocale: {type: 'string'},
        storyType: {type: 'string', minLenght: 1},
        storyAbstraction: {type: 'string', minLenght: 1},
        storyTranscript: {type: 'string', minLenght: 1},
        storyTellerAge: {type: 'number'},
        storyTellerGender: {type: 'string', minLenght: 1},
        storyTellerName: {type: 'string', minLenght: 1},
        storyTellerPlaceOfOrigin: {type: 'string', minLenght: 1},
        storyTellerResidency: {type: 'string', minLenght: 1},
        storyCollectorName: {type: 'string', minLenght: 1},
        tags:{
            type: 'array',
            items:{
                type: '#/$defs/tag'
            }
        }
    },
    required: ['storyTitle', 'defaultLocale', 'collectionId', 'storyType'],
    $defs:{
        tag:{
            type: 'object',
            properties:{
                slug:{type: 'string', minLenght: 1},
                value:{type: 'string', minLenght: 1}
            },
            required: ['slug', 'value']
        }

    }
} as const
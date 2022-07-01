export default{
    "$schema": "http://json-schema.org/draft-06/schema#",
    definitions:{
        tag:{
            type: 'object',
            properties:{
                slug:{type: 'string', minLength: 1},
                name:{type: 'string', minLength: 1}
            },
            required: ['slug', 'name']
        }

    },
    type: 'object',
    properties:{
        name: {type: 'string', minLength: 1,},
        description: {type: 'string'},
        defaultLocale: {type: 'string'},
        Editors:{
            type: 'array',
            items:{
                type: 'string'
            }
        },
        tags:{
            type: 'array',
            items:{
                $ref: '#/definitions/tag'
            }
        }
    },
    required: ['name', 'defaultLocale']
    
} as const
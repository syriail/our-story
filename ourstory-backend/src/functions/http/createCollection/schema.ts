export default{
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
                type: '#/$defs/tag'
            }
        }
    },
    required: ['name', 'defaultLocale'],
    $defs:{
        tag:{
            type: 'object',
            properties:{
                slug:{type: 'string', minLenght: 1},
                name:{type: 'string', minLenght: 1}
            },
            required: ['slug', 'name']
        }

    }
} as const
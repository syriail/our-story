import { handlerPath } from "@libs/handler-resolver";

export default{
    handler: `${handlerPath(__dirname)}/handler.main`,
    tracing: true,
    environment:{
        MEDIA_BUCKET: '${self:custom.s3Buckets.mediaBucket}',
        URL_EXPIRATION:'300'
    },
    events:[
        {
            http:{
                method: 'GET',
                path: 'uploadUrl/{storyId}',
                cors: true
            }
        }
    ]
}
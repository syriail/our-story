import { handlerPath } from "@libs/handler-resolver";
import schema from "./schema";

export default{
    handler: `${handlerPath(__dirname)}/handler.main`,
    tracing: true,
    events:[
        {
            http:{
                method: 'POST',
                path: 'collections',
                authorizer: 'authorize',
                cors: true,
                request:{
                    schemas:{
                        'application/json': schema,
                    }
                }
            }
        }
    ]
}
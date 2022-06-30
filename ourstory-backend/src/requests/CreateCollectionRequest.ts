export interface CreateCollectionRequest{
    defaultLocale: string
    name: string
    description?: string
    editors?:[string]
    tags?:CreateTagRequest[]
}
interface CreateTagRequest{
    slug: string
    name: string
}
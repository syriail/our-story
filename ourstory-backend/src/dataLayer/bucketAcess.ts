import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { UploadAttachmentData } from '../models'

const XAWS = AWSXRay.captureAWS(AWS)


export default class BucketAccess{
  constructor(
    private readonly s3 = createS3Client(),
    private readonly expiration = parseInt(process.env.URL_EXPIRATION),
    private readonly mediaBucket = process.env.MEDIA_BUCKET 
  ){}
  getMediaUploadUrls = (key: string): UploadAttachmentData=>{
      
    const signedUrl = this.s3.getSignedUrl('putObject', {
      Bucket: this.mediaBucket,
      Key: `${key}`,
      Expires: this.expiration
    })
    const accessUrl = this.getAccessUrl(this.mediaBucket)
    return {
      uploadUrl: signedUrl,
      attachmentUrl: `${accessUrl}/${key}`
    }
  }
  private getAccessUrl = (bucket: string)=>{
    if(process.env.IS_OFFLINE) return 'http://localhost:4569'
    return `https://${bucket}.s3.amazonaws.com`
  }
}



const createS3Client = ()=>{
  if(process.env.IS_OFFLINE){
      
      return new AWS.S3({
        signatureVersion: 'v4',
        s3ForcePathStyle: true,
        accessKeyId: "S3RVER", // This specific key is required when working offline
        secretAccessKey: "S3RVER",
        endpoint: new AWS.Endpoint("http://localhost:4569"),
      })
  }
  return new XAWS.S3({
    signatureVersion: 'v4'
  })
}




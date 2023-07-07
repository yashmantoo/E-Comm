import s3 from "../config/s3"


export const s3FileUpload = async({bucketName, key, body, contentType}) => {
    return await s3.upload({
        Bucket: bucketName,
        Key: key,
        Body: body,
        ContentType: contentType,

        // key is unique to every image, body is the file, contentType is jpeg or png or pdf
    })
    .promise()

    // this promise will give us the url where the file is stored.
}

export const s3deleteFile = async ({bucketName, key}) => {
    return await s3.deleteObject({
        Bucket: bucketName,
        Key: key,

        // aws treats any file as an object
    })
    .promise()
}
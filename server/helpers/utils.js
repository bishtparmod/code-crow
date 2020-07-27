function getBucketNameFromID(bucketName) {
    return {
        'videos': process.env.S3_BUCKET_VIDEOS,
        'news': process.env.S3_BUCKET_NEWS,
        'legal': process.env.S3_BUCKET_LEGAL_DOCS
    }[bucketName];
}

module.exports = {
    getBucketNameFromID
}
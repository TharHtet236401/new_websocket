const { S3Client } = require('@aws-sdk/client-s3');
const { fromIni } = require('@aws-sdk/credential-provider-ini');
const multerS3 = require('multer-s3');
const multer = require('multer');

// Initialize S3 client with credentials from AWS credentials file or environment variables
const s3Client = new S3Client({
    region: 'ap-southeast-2', // Specify your AWS region
    credentials: fromIni(), // Automatically loads credentials from .aws/credentials or environment variables
    endpoint: `https://s3.ap-southeast-2.amazonaws.com`, // Endpoint URL for Sydney region
});

// Configure multer to use S3 for storage
const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: 's3imagesaver', // Replace with your S3 bucket name
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, `${Date.now().toString()}-${file.originalname}`);
        },
    })
});

module.exports = upload;

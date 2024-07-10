const { S3Client } = require('@aws-sdk/client-s3');
const { fromIni } = require('@aws-sdk/credential-provider-ini');
const multerS3 = require('multer-s3');
const multer = require('multer');

const s3Client = new S3Client({
    region: 'ap-southeast-2', 
    credentials: fromIni(), 
    endpoint: `https://s3.ap-southeast-2.amazonaws.com`, 
});


const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: 's3imagesaver', 
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, `${Date.now().toString()}-${file.originalname}`);
        },
    })
});

module.exports = upload;

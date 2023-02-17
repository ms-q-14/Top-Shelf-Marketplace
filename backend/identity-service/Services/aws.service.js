const AWS = require("aws-sdk");

class AwsService {
  constructor() {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      signatureVersion: "v4",
      region: "us-east-2",
    });
    this.s3 = new AWS.S3();
  }

  uploadImage = async (fileName, file) => {
    const params = {
      Bucket: "topshelf-sahil",
      Key: fileName,
      Body: file,
    };
    return new Promise((resolve, reject) => {
      this.s3.upload(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };
}
module.exports = new AwsService();

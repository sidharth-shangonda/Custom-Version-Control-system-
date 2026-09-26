const AWS = require("aws-sdk");
require("dotenv").config();

AWS.config.update({ region: process.env.AWS_REGION || "ap-south-1" });

const s3Options = {};
if (process.env.S3_ENDPOINT) {
  s3Options.endpoint = process.env.S3_ENDPOINT;
  s3Options.s3ForcePathStyle = true;
}

const s3 = new AWS.S3(s3Options);
const S3_BUCKET = process.env.S3_BUCKET || "minigit-commits";

module.exports = { s3, S3_BUCKET };


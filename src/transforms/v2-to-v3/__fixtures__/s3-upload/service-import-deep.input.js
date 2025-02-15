import S3 from "aws-sdk/clients/s3";

const client = new S3({ region: "REGION" });
await client.upload({
  Body: "BODY",
  Bucket: "Bucket",
  ContentType: "ContentType",
  Key: "Key",
}).promise();
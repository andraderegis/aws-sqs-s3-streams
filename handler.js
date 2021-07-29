'use strict';

const AWS = require('aws-sdk');

const LOCALSTACK_HOST = process.env.LOCALSTACK_HOST || 'localhost';
const LOCALSTACK_SERVICES_PORT = process.env.LOCALSTACK_SERVICES_PORT || '4566';

const S3_CONFIG = {
  s3ForcePathStyle: true,
  endpoint: new AWS.Endpoint(`http://${LOCALSTACK_HOST}:${LOCALSTACK_SERVICES_PORT}`)
}

const S3 = new AWS.S3(S3_CONFIG);

module.exports.hello = async (event) => {
  const buckets = await S3.listBuckets().promise();

  console.log({ buckets });

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        buckets
      },
      null,
      2
    ),
  };
};

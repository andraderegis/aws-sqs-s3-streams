const AWS = require('aws-sdk');

class Handler {
  constructor({ s3Service, sqsService }) {
    this.s3Service = s3Service;
    this.sqsService = sqsService;
  }

  static getSDKs() {
    const LOCALSTACK_HOST = process.env.LOCALSTACK_HOST || 'localhost';
    const LOCALSTACK_SERVICES_PORT = process.env.LOCALSTACK_SERVICES_PORT || '4566';
    const IS_LOCAL = process.env.IS_LOCAL;

    const servicesEndpoint = new AWS.Endpoint(`http:${LOCALSTACK_HOST}:${LOCALSTACK_SERVICES_PORT}`);

    const s3Config = {
      endpoint: servicesEndpoint,
      s3ForcePathStyle: true
    };

    const sqsConfig = {
      endpoint: servicesEndpoint
    }

    if (!IS_LOCAL) {
      delete s3Config.endpoint;
      delete sqsConfig.endpoint;
    }

    return {
      s3: new AWS.S3(s3Config),
      sqs: new AWS.SQS(sqsConfig)
    }
  }

  async main(event) {
    console.log('****s3 event', JSON.stringify(event, null, 2));

    try {
      return {
        statusCode: 200,
        body: 'S3 Listener'
      }
    } catch (error) {
      console.log('****error', error.stack);
      return {
        statusCode: 500,
        body: 'Internal Server Error'
      }
    }
  }
}

const { s3, sqs } = Handler.getSDKs();

const handler = new Handler({
  sqsService: sqs,
  s3Service: s3
});

module.exports = handler.main.bind(handler);
const AWS = require('aws-sdk');
const { Writable, pipeline } = require('stream');
const csvtojson = require('csvtojson');
class Handler {
  constructor({ s3Service, sqsService }) {
    this.s3Service = s3Service;
    this.sqsService = sqsService;

    this.queueName = process.env.SQS_QUEUE;
  }

  static getSDKs() {
    const HOST = process.env.LOCALSTACK_HOST || 'localhost';
    const PORT = process.env.LOCALSTACK_SERVICES_PORT || '4566';
    const IS_LOCAL = process.env.IS_LOCAL;

    const servicesEndpoint = new AWS.Endpoint(`http://${HOST}:${PORT}`);

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

  async getQueueURL() {
    const { QueueUrl } = await this.sqsService.getQueueUrl({
      QueueName: this.queueName
    }).promise();

    return QueueUrl;
  }

  processDataOnDemand(queueURL) {
    const writableStream = new Writable({
      write: (chunk, encoding, done) => {
        const item = chunk.toString();

        console.log('sending item', item, 'at', new Date().toISOString());

        this.sqsService.sendMessage({
          QueueUrl: queueURL,
          MessageBody: item
        }, done);
      }
    });

    return writableStream;
  }

  async pipefyStreams(...args) {
    return new Promise((resolve, reject) => {
      pipeline(...args, error => error ? reject(error) : resolve());
    });
  }

  async main(event) {
    try {
      const [
        {
          s3: {
            bucket: {
              name
            },
            object: {
              key
            }
          }
        }
      ] = event.Records;

      console.log('processing', name, key);

      console.log('getting queueURL');
      const queueUrl = await this.getQueueURL();
      console.log({ queueUrl });

      const s3ObjectParams = {
        Bucket: name,
        Key: key
      };

      // This way allows stop the process when the first error happens. Also, it's not necessary handling the on(finish) and on(close) events
      await this.pipefyStreams(
        this.s3Service.getObject(s3ObjectParams).createReadStream(),
        csvtojson(),
        this.processDataOnDemand(queueUrl)
      )

      console.log('process finished!', new Date().toISOString());

      // This way use createReadStream with pipes. So, it's necessary handling events
      // this.s3Service.getObject(s3ObjectParams)
      //   .createReadStream()
      //   .pipe(csvtojson())
      //   .pipe(this.processDataOnDemand(queueUrl))
      // .on('error', message => {
      //   console.log('error', message.toString())
      // })
      // .on('close', () => {
      //   console.log('close');
      // })
      // .on('finish', () => {
      //   console.log('finish');
      // });

      return {
        statusCode: 200,
        body: 'Process finished with sucess!'
      }
    } catch (error) {
      console.log('****error', error);

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
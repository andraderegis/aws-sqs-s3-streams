QUEUE_NAME=$1

# uncomment --endpoint params to use with localstack
aws sqs create-queue --queue-name $QUEUE_NAME \
  --endpoint-url=http://localhost:4566

aws sqs list-queues \
  --endpoint-url=http://localhost:4566


QUEUE_NAME=$1

aws sqs create-queue --queue-name $QUEUE_NAME \
  # uncomment to use with localstack
  # --endpoint-url=http://localhost:4566

aws sql list-queues \
  # uncomment to use with localstack
  # --endpoint-url=http://localhost:4566


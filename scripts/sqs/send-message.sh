QUEUE_URL=$1
echo 'Sending message' $QUEUE_URL

aws sqs send-message --queue-url $QUEUE_URL --message-body 'Test sending message' \
  # uncomment to use with localstack
  # --endpoint-url=http://localhost:4566

aws sqs receive-message --queue-url $QUEUE_URL \
  # uncomment to use with localstack
  # --endpoint-url=http://localhost:4566

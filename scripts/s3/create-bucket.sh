#get the first parameter
BUCKET_NAME=$1

# uncomment --endpoint params to use with localstack
aws \
  s3 mb s3://$BUCKET_NAME \
  --endpoint-url=http://localhost:4566

aws \
  s3 ls \
  --endpoint-url=http://localhost:4566


#bash scripts/s3/create-bucket.sh nome_do_bucket
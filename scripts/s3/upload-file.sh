#get the first parameter passed
BUCKET_NAME=$1
#get the second parameter passed
FILE_PATH=$2

# uncomment --endpoint-url to use with localstack

aws \
  s3 cp $FILE_PATH s3://$BUCKET_NAME \
  --endpoint-url=http://localhost:4566 
  
aws \
  s3 ls s3://$BUCKET_NAME \
  --endpoint-url=http://localhost:4566

#bash scripts/s3/upload-file.sh ${nome_do_bucket} ${path_do_arquivo}
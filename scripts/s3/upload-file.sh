#get the first parameter passed
BUCKET_NAME=$1
#get the second parameter passed
FILE_PATH=$2

aws --endpoint-url=http://localhost:4566 s3 cp $FILE_PATH s3://$BUCKET_NAME

aws --endpoint-url=http://localhost:4566 s3 ls s3://$BUCKET_NAME

#bash scripts/s3/upload-file.sh ${nome_do_bucket} ${path_do_arquivo}
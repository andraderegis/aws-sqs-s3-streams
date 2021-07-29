<h1 align="center">AWS Lambda - SQS-S3-Streams</h1>

# Sobre
**Este projeto tem como objetivo executar localmente uma lambda, sem a necessidade**
**de utilizarmos o ambiente de cloud da AWS. Dessa forma, evitamos custos desnecessários**
**Para tal, foi utilizado as seguintes ferramentas:**
- **serverless-offline**: plugin executado framework **Serverless**, que nos possibilita simular a execução de uma lambda localmente
- **serverless-jest-plugin**: plugin executado no framework **Serverless** que permite criar testes unitários com **Jest**
- **serverless-localstack**: plugin que simula serviços da AWS, como por exemplo, S3, SQN, SNS, etc. Em conjunto a ele, é necessário a utilização do docker

# Scripts
## package.json
- **start** 
: na declaração desse script, utilizamos o comando **"npx"** à frente do **nodemon** com o intuito de ignorar instalações locais do **nodemon**, sendo que o mesmo é buscado na pasta **node_modules** da aplicação
```
yarn start
```
- **offline**
: inicialização da aplicação, via **serverless**, utilizando o plugin **serverless-offline**. Foi definido o **host como 0.0.0.0** pela necessidade do **docker** realizar mapeamento desse host e, assim, receber requisições externas
```
yarn offline
```
## AWS S3
- **create-bucket**: cria um bucket s3. É necessário a utilização do **localstack**, que pode ser inicializado via docker-compose, conforme documentação.
```
bash scripts/s3/create-bucket.sh ${nome_do_bucket} 
```
**upload-file**: realiza upload de arquivo para um bucket s3. É necessário a utilização do **localstack**, que pode ser inicializado via docker-compose, conforme documentação.
```
bash scripts/s3/upload-file.sh ${nome_do_bucket} ${path_do_arquivo}
```

# Docker
## Localstack
**Para a utilização do localstack, é necessário subir o container, utilizando do arquivo docker-compose que se encontra na raiz do projeto**
```
docker-compose up -d localstack
```
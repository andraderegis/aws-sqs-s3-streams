FROM lambci/lambda:build-nodejs12.x

WORKDIR /src/

COPY package.json yarn.lock /src/

RUN npm install --global yarn

RUN yarn install --frozen-lockfile --silent

COPY . .

ENTRYPOINT [ "yarn", "start" ]
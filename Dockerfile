FROM node:12
EXPOSE 8000
RUN mkdir /app
WORKDIR /app
VOLUME /app
COPY package.json /app
COPY yarn.lock /app
RUN yarn install
COPY ./src /app/src
COPY ./config /app/config
RUN yarn build

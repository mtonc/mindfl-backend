#Step 1: Builder
FROM node:12.18-alpine3.12 as builder
WORKDIR /home/node/app
COPY . .
RUN npm install && npm run build
################################################################################
#Step 2: Runner
FROM node:12.18.0
ENV NODE_ENV=production
WORKDIR /home/node/app 

COPY package.json ./
RUN npm install &&\
	npm cache clean --force
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/config ./config
EXPOSE 8000
CMD npm run start

FROM node:6.14.2-alpine
COPY package.json .
RUN apk update && apk add bash
#RUN npm install
COPY . .
#RUN ["npm", "run" ]


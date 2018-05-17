FROM node:6.14.2-alpine
COPY package.json .
RUN apk update && apk add bash
RUN apt-get install -y python3-pip python3-dev
#RUN npm install
COPY . .
#RUN ["npm", "run" ]


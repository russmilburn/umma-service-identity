FROM node:6.14.2-alpine
COPY package.json .
#RUN npm install
COPY . .
#RUN ["npm", "run" ]


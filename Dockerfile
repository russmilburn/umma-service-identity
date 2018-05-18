FROM russmilburn40/umma-build-image:v0.1
#RUN mkdir app
COPY package.json .
RUN apk update && apk add bash
#ENV GLIBC_VERSION 2.25-r0
#RUN npm install mockgoose mongoose && node -e "var mongoose = require('mongoose'); var Mockgoose = require('mockgoose').Mockgoose; var mockgoose = new Mockgoose(mongoose); mockgoose.prepareStorage().then(() => process.exit(0))"
RUN npm install
COPY . .

#RUN ["npm", "run" ]

#RUN apk add --update curl && \
#  curl -Lo /etc/apk/keys/sgerrand.rsa.pub https://raw.githubusercontent.com/sgerrand/alpine-pkg-glibc/master/sgerrand.rsa.pub && \
#  curl -Lo glibc.apk "https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VERSION}/glibc-${GLIBC_VERSION}.apk" && \
#  curl -Lo glibc-bin.apk "https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VERSION}/glibc-bin-${GLIBC_VERSION}.apk" && \
#  apk add glibc-bin.apk glibc.apk && \
#  /usr/glibc-compat/sbin/ldconfig /lib /usr/glibc-compat/lib && \
#  echo 'hosts: files mdns4_minimal [NOTFOUND=return] dns mdns4' >> /etc/nsswitch.conf && \
#  apk del curl && \
#  rm -rf glibc.apk glibc-bin.apk /var/cache/apk/*


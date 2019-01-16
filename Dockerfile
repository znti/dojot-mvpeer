FROM node:8

WORKDIR /dojot/nodejs

RUN apt-get update \
        && apt-get install  -y --no-install-recommends python-openssl python-pip \
        && pip install requests kafka\
        && apt-get clean \
        && rm -rf /var/lib/apt/lists/*

ENV LD_LIBRARY_PATH=/dojot/nodejs/node_modules/node-rdkafka/build/deps/

COPY package.json .
RUN npm install

COPY src ./src
COPY index.js .
COPY build ./build

CMD ["node", "index.js"]

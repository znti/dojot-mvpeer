# dojot-mvpeer

MVPeer is a tool [being] designed to aid on environment modeling when using the dojot platform.
The main goal is to provide a quick way to setup your devices layout and have the rest automatically taken care for you.

## Prerequisites

Using this tool requires a custom iot-agent.
The latest supported version can be found on https://github.com/znti/dojot-iotagent-mvpeer

For running this agent on your dojot instance, refer to its readme instructions.

## Installing

After cloning this repository, install its dependencies

npm install

Configure the addresses for your dojot and custom iot-agent on the file

./dojot-mvpeer/src/configs.js

Once its all set, run the following command, which will build and run the server

npm run serve


## Accessing the application

By default, the server listens on host's port 8080. 

The web application can be accessed at /app endpoint.

The endpoints started by /api are designed to abstract all the communication with dojot components and are the only resource used by the web client.

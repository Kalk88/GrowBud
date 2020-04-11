# GrowBud

## First time setup
Install node and [firebase cli](https://firebase.google.com/docs/cli/)
Run ``` install.sh ``` it will install npm packages.

## Run locally
Run ``` firebase_serve.sh ```.

### Setup (Deprecated)
Install [Docker](https://docs.docker.com/install/linux/docker-ce/ubuntu/) and [Docker compose](https://docs.docker.com/compose/install/).
In the project root folder run ```docker-compose up --build```, to build and spin up application containers. Run ```docker-compose down``` to stop them. The build flag is only necessary the first time, check out the [docker-compose documentation](https://docs.docker.com/compose/) for more details.

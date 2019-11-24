FROM node:10

WORKDIR /app

COPY package*.json ./
COPY src ./src
COPY tsconfig.json ./
COPY .env ./

RUN npm install
RUN npm run tsc-build

EXPOSE 9090

ENTRYPOINT ["npm"]
CMD ["start"]

FROM node:12

WORKDIR /app

COPY package*.json ./
COPY src ./

RUN npm install
RUN npm run tsc

EXPOSE 9090

ENTRYPOINT ["npm"]
CMD ["start"]
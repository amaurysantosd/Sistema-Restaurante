FROM node:25.2.1

WORKDIR /backend

COPY . .

RUN npm ci

CMD ["npm", "run", "test"]

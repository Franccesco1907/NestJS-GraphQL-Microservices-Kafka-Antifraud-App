FROM node:22-alpine

WORKDIR /workspace/ms-antifraud

COPY package*.json ./
RUN npm install -g @nestjs/cli
RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "start:dev"]

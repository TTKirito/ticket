FROM node:14.15

WORKDIR /app
COPY package.json .
RUN npm install --only=prod
COPY . .

CMD ["npm","start"]
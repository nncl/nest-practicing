FROM node:20 AS local

WORKDIR /usr/src/app

COPY package*.json tsconfig*.json ./

RUN npm install

COPY . .

# Copy the Google Cloud credentials file into the container
COPY test.json /usr/src/app/

# Set the GOOGLE_APPLICATION_CREDENTIALS environment variable
ENV GOOGLE_APPLICATION_CREDENTIALS="/usr/src/app/test.json"

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]

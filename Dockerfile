FROM node:latest

# Create app directory
RUN mkdir -p /opt/parse
WORKDIR /opt/parse

# Install app dependencies
COPY package.json /opt/parse/
RUN npm install

# Bundle app source
COPY . /opt/parse

ENV PORT 8080
ENV APP_ID 'YOUR_APPLICATION_ID'
ENV MASTER_KEY 'YOUR_MASTER_KEY_HERE'
ENV DATABASE_URI 'mongodb://localhost:27017/dev'
ENV NODE_ENV 'development'

EXPOSE 8080
ENTRYPOINT ["npm", "run"]
CMD ["start"]

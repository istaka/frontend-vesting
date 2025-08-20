FROM node:16

WORKDIR /

COPY package.json .

RUN npm install --force

COPY . .

EXPOSE 3000
# required for docker desktop port mapping

CMD ["npm", "start"]
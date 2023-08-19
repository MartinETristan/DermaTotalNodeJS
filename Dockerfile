# Usar la imagen oficial de PHP con Apache
FROM node:18

WORKDIR /DermaTotalWeb
COPY package.json .
RUN npm install

COPY . .
CMD npm start


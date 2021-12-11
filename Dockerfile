FROM node:16-alpine

WORKDIR /usr/src/app

COPY ./dist/apps/backend/ ./backend/
RUN cd ./backend/ && npm install --production

COPY ./dist/apps/frontend/ ./frontend/build

CMD [ "node", "./backend/main.js" ]
FROM node:14

WORKDIR /usr/src/app

COPY ./backend/dist/ ./backend/dist
COPY ./backend/package*.json ./backend/
RUN cd ./backend/ && npm install --production

COPY ./frontend/build/ ./frontend/build

CMD [ "node", "./backend/dist/main.js" ]



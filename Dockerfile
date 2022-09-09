FROM node:16-alpine

WORKDIR /usr/src/app
COPY . .

RUN npm install 
RUN npm run build  

RUN cp -r ./dist/apps/backend/ ./backend/
RUN cd ./backend/ && npm install --production
RUN mkdir -p ./frontend/build
RUN cp -r ./dist/apps/frontend/* ./frontend/build

CMD [ "node", "./backend/main.js" ]
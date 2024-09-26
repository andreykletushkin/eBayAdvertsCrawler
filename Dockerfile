FROM node:20-alpine
RUN mkdir -p /home/node/app/node_module && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node package*.json ./
USER node
RUN npm install
COPY --chown=node:node . .
CMD [ "node", "app/ebay_crawler.js" ]
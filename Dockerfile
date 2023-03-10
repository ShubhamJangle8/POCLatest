FROM node:16-alpine3.16

WORKDIR /frontend

COPY . /frontend
RUN npm install 

EXPOSE 3000
CMD ["npm","start"]
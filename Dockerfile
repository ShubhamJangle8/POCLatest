FROM node:19-alpine3.15

WORKDIR /frontend

COPY . /frontend
RUN npm install 

EXPOSE 3000
CMD ["npm","start"]
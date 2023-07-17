FROM node:10.16.3-alpine as build
WORKDIR /app
COPY package.json /app/package.json
RUN npm install
COPY . /app
#RUN npm run build
#FROM nginx
#COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8081
CMD ["npm", "run", "serve"]

FROM node:lts-alpine AS build
RUN npm install -g @vue/cli
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
#RUN npm run build (only for production?)
##EXPOSE 8080
##CMD [ "npm", "run", "serve" ]

#FROM nginx:1.19.0-alpine AS prod-stage
#COPY --from=build /app/dist /usr/share/nginx/html
#ENV PORT 8080
#EXPOSE $PORT
#CMD [ "nginx", "-g", "daemon off;" ]
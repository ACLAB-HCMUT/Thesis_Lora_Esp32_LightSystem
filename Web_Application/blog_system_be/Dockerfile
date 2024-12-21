FROM node:20.18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build 
EXPOSE 3000
CMD ["node", "/app/dist/main"]
# FROM nginx:alpine 
# COPY --from=build /app/dist /usr/share/nginx/html

# CMD ["nginx", "-g", "daemon off;"]
# CMD [ "npm", "run", "start" ]
FROM node:16
WORKDIR /app

COPY package.json package-lock.json ./


RUN npm install

COPY . .

CMD ["npx", "live-server", "--host=0.0.0.0", "--port=3000"]
EXPOSE 3000

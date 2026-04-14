FROM node:20-alpine

RUN apk add --no-cache ffmpeg python3 py3-pip
RUN pip3 install yt-dlp instaloader --break-system-packages

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

CMD ["npm", "start"]

FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine

RUN npm install -g serve

COPY --from=build /app/build /app/build

EXPOSE 3000

# 앱 실행
CMD ["serve", "-s", "build", "-l", "3000"]
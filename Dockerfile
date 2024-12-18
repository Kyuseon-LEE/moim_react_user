# 1. Node.js 이미지를 사용하여 애플리케이션을 빌드하는 단계
FROM node:20 AS build

# 작업 디렉토리 설정
WORKDIR /app

# 2. package.json 및 package-lock.json 복사
COPY package*.json ./

# 3. 의존성 설치
RUN npm install

# 4. 애플리케이션 소스 복사
COPY . .

# 5. 리액트 애플리케이션 빌드
RUN npm run build

# 6. 빌드된 파일을 Nginx 웹 서버에서 제공할 수 있도록 설정
FROM nginx:alpine

# Nginx 설정 파일을 덮어쓸 필요가 없다면 주석처리합니다
# COPY nginx.conf /etc/nginx/nginx.conf

# 7. 리액트 빌드 폴더를 Nginx의 html 폴더로 복사
COPY --from=build /app/build /usr/share/nginx/html

# 8. 80번 포트 열기
EXPOSE 3000

# 9. Nginx 실행
CMD ["nginx", "-g", "daemon off;"]

# React 기반 사용자 인터페이스 - 모임 서비스 프론트엔드.

##  프로젝트 개요
- React를 사용해 모임 서비스 사용자 인터페이스(UI)를 구현
- REST API는 Node.js + Spring 백엔드에서 제공
- 사용자 친화적 UI와 SPA(Single Page Application) 구성에 중점

---

##  사용 기술 스택
- React (함수형 컴포넌트 + Hooks)
- React Router (페이지 라우팅)
- Axios (API 통신)
- Redux 또는 Context API (상태관리, 있으면 명시)
- CSS Modules / Styled-Components (스타일링)
- Webpack / Babel (빌드 환경)
- ESLint, Prettier (코드 품질 관리)
---

##  주요 기능
- **회원가입 및 로그인**
- **모임 목록 조회 및 참여 기능**
- **사용자 프로필 수정 및 모임 관리**
- **폼 검증 및 사용자 피드백 UI**

---

##  프로젝트 구조
```
React_moim_user/
├── public/ # 정적 파일 (index.html, favicon 등)
├── src/ # 소스 코드 디렉토리<
│ ├── api/ # Axios 등 API 호출 함수 모음<
│ ├── assets/ # 이미지, 폰트 등 리소스 파일
│ ├── components/ # 재사용 가능한 UI 컴포넌트
│ ├── pages/ # 라우팅 대상 페이지 컴포넌트
│ ├── store/ # 상태 관리(Redux, Context API)
│ ├── styles/ # CSS, 스타일 관련 파일
│ ├── utils/ # 유틸리티 함수 모음
│ ├── App.js # 애플리케이션 진입점
│ └── index.js # ReactDOM 렌더링 및 앱 실행
├── .env # 환경 변수 설정 파일 (API 주소 등)
├── Dockerfile # 도커 빌드 설정 파일
├── package.json # 프로젝트 메타데이터 및 의존성 관리
```

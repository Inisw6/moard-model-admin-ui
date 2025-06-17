# Moard Model Admin UI

## 개요
이 프로젝트는 **모델 관리와 로그 관리를 위한 관리자 웹 인터페이스**입니다. 
React와 TypeScript를 기반으로 구축되었으며, Material-UI를 사용하여 페이지를 제공합니다.

## 환경
- Node.js
- React 18.2.0
- TypeScript 4.9.5
- Material-UI 5.13.0
- React Router DOM 7.6.2

## 실행방법

### 로컬 개발 환경
1. 의존성 설치
```bash
npm install
```

2. 개발 서버 실행
```bash
npm start
```

3. 프로덕션 빌드
```bash
npm run build
```

### Docker 환경
1. Docker 이미지 빌드
```bash
docker build -t moard-model-admin-ui .
```

2. Docker 컨테이너 실행
```bash
docker run -p 3000:3000 moard-model-admin-ui
```

## 프로젝트 구조
```
moard-model-admin-ui/
├── src/
│   ├── components/         # 재사용 가능한 컴포넌트
│   │   ├── Dashboard/     # 대시보드 관련 컴포넌트
│   │   └── Layout/        # 레이아웃 관련 컴포넌트
│   ├── pages/             # 페이지 컴포넌트
│   │   ├── LogManagement.tsx
│   │   └── ModelManagement.tsx
│   ├── App.tsx            # 메인 애플리케이션 컴포넌트
│   ├── index.tsx          # 애플리케이션 진입점
│   └── theme.ts           # Material-UI 테마 설정
├── public/                # 정적 파일
├── package.json           # 프로젝트 의존성 및 스크립트
└── tsconfig.json         # TypeScript 설정
```

## 주요 컴포넌트 설명

### 페이지 컴포넌트
1. **ModelManagement.tsx**
   - 모델 관리 페이지
   - 모델 목록 조회, 생성, 수정, 삭제 기능 제공
   - 모델 상태 모니터링 및 관리

2. **LogManagement.tsx**
   - 로그 관리 페이지
   - 시스템 로그 조회 및 필터링
   - 로그 상세 정보 확인

### 레이아웃 컴포넌트
- 네비게이션 바
- 사이드바
- 페이지 레이아웃 구성

### 대시보드 컴포넌트
- 시스템 상태 모니터링
- 주요 지표 표시
- 실시간 데이터 시각화

## 기술 스택
- **프론트엔드**: React, TypeScript
- **UI 프레임워크**: Material-UI
- **라우팅**: React Router DOM
- **HTTP 클라이언트**: Axios
- **스타일링**: Emotion

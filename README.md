# Make One Entertainment Website

Make One Entertainment의 공식 웹사이트입니다. 이벤트 기획, 팀빌딩, 축제 등 다양한 엔터테인먼트 서비스를 소개합니다.

## 🚀 빠른 시작

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 9.0.0 이상

### 설치 및 실행

1. **프로젝트 클론**
```bash
git clone https://github.com/sik032-ship-it/make-one-entertainment.git
cd make-one-entertainment
```

2. **의존성 설치**
```bash
npm install
```

3. **개발 서버 실행**
```bash
npm run dev
```

4. **브라우저에서 확인**
- `http://localhost:5173`으로 접속

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── ui/             # 기본 UI 컴포넌트들
│   ├── Header.jsx      # 헤더 네비게이션
│   ├── HeroSection.jsx # 메인 히어로 섹션
│   ├── PortfolioSection.jsx # 포트폴리오 섹션
│   └── ...
├── pages/              # 페이지 컴포넌트들
│   ├── Home.jsx        # 홈페이지
│   ├── About.jsx       # 회사 소개
│   ├── Photos.jsx      # 사진 갤러리
│   └── ...
├── api/                # API 관련 파일들
└── hooks/              # 커스텀 훅들
```

## 🛠️ 사용된 기술

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Routing**: React Router
- **Icons**: Lucide React

## 📱 주요 기능

- 🏠 **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- 🖼️ **이미지 갤러리**: 포트폴리오 및 프로그램 사진들
- 📋 **프로그램 소개**: 팀빌딩, 축제, 이벤트 등
- 📞 **연락처 정보**: 문의 및 상담 안내
- ⭐ **리뷰 시스템**: 고객 후기 및 평가

## 🔧 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# 린트 검사
npm run lint
```

## 🌐 배포

이 프로젝트는 Vite로 빌드되어 정적 사이트로 배포할 수 있습니다:

```bash
npm run build
```

빌드된 파일은 `dist/` 폴더에 생성됩니다.

## 📝 환경 설정

### 로컬 개발
- Base44 인증이 비활성화되어 있어 별도 설정 없이 바로 실행 가능
- 모든 기능이 모의(mock) 데이터로 작동

### 프로덕션 배포
- `src/api/base44Client.js`에서 주석 처리된 실제 Base44 클라이언트 활성화
- 환경 변수 설정 필요

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

- **회사**: Make One Entertainment
- **이메일**: [이메일 주소]
- **전화**: [전화번호]
- **주소**: [주소]

## 🙏 감사의 말

이 프로젝트는 Base44 플랫폼을 기반으로 제작되었습니다.

---

**즐거운 개발 되세요! 🎉**
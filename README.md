# Basic React board Project
## 1. 프로젝트 소개
웹 개발의 기본 소양이 되는 게시판을 직접 만들어보면서 기술 습득을 하기 위해 시작하였습니다. 

## 2. 프로젝트 기능
+ 게시판 - CRUD 기능, 조회수, 페이징처리, 검색
+ 댓글 - CRUD 기능
+ 사용자 - 세션을 이용한 로그인/로그아웃 및 회원가입(회원가입시 유효성 검사 및 중복 검사)

## 3. 개발환경 및 기술스택
+ 프론트앤드
  + React : 사용자 인터페이스 구축
  + Tailwind CSS : 빠른 스타일링을 위한 CSS 프레임워크
+ 백앤드
  + Express : Node.js 기반 RESTful API 서버
  + MySQL : 게시글과 사용자 데이터를 저장하는 관계형 데이터베이스
  + Bcrypt : 비밀번호 암호화
  + CORS : Cross-Origin Resource Sharing을 위한 미들웨어
+ 배포
  + AWS RDS : MySQL 데이터베이스를 AWS RDS에 배포하여 관리
  + AWS EC2 : Express.js 서버를 AWS EC2에 배포하여 운영
  + NGINX : 리버스 프록시를 설정하여 클라이언트와 서버 간의 원활한 통신 지원
 
## 4. 구조 및 설계
+ DB 설계
  + ERD
    
    ![Image](https://github.com/user-attachments/assets/6524b955-fba2-423c-a861-2a49b1b6e880)

  + 테이블명세서
  <img width="943" alt="Image" src="https://github.com/user-attachments/assets/3578cfbc-c15e-403e-9069-0b00c56eda2f" />
  <img width="943" alt="Image" src="https://github.com/user-attachments/assets/15c5145c-bd34-4300-985a-257ffeff0d13" />
  <img width="943" alt="Image" src="https://github.com/user-attachments/assets/21cc71d6-24e0-48dd-832e-83c5250fb7bb" />
  <img width="943" alt="Image" src="https://github.com/user-attachments/assets/b523648d-be55-49d4-99f3-a832c3d12df6" />

+ API 설계
  
  <img width="485" alt="Image" src="https://github.com/user-attachments/assets/9d8f1ae2-cfa9-45ad-8f5e-9aeaabe11689" />
  
## 5. 개발 내용
+ [React 게시판 - 세션기반 로그인&로그아웃](https://www.notion.so/React-175cb667a0958089874cc2f4d1051f35?pvs=4)
+ [React 게시판 - React 게시판 - 페이지내이션](https://www.notion.so/React-pagination-175cb667a09580cd83baf570b6af7b94?pvs=4)
+ [React 게시판 - 댓글 CRUD](https://www.notion.so/React-CRUD-175cb667a095803ea066d15b27e5360e?pvs=4)
+ [React 게시판 - 검색 구현](https://www.notion.so/React-175cb667a095803481fffa0de412a35e?pvs=4)
+ [React 게시판 - 회원가입](https://www.notion.so/React-175cb667a0958037986ee6f4194c61af?pvs=4)
+ [React 게시판 - Redux 적용](https://www.notion.so/React-Redux-17bcb667a095800bb4adcd722d4d8491?pvs=4)
+ [React 게시판 - AWS EC2 배포(+RDS)](https://www.notion.so/React-AWS-EC2-RDS-1a3cb667a0958095b23cf4891fbb2179?pvs=4)

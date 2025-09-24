# 00. 목적
IITP-DABT-Platform 웹 서비스를 개발하기 위한 요구 사항 문서. 
이 서비스는 장애인 자립 지원 허브 플랫폼으로서 계정/로그인등 기능 없이 노출된 모든 데이터를 자유롭게 사용하는 사이트 이다.

이 사이트의 기능은 장애인 정보를 쉽게 찾아보고, 장애인 자립도를 체크하여 자기가 부족한 부분을 확인하고, 부족한 부분에 대한 지원 정책등 다양한 정보를 확인 할수 있는 사이트 입니다. 

# 01. 기본 사항 
  - monorepo 구조로 소스 관리.
  - api, 공통 type, 공통 유틸 같은  것을 만들어 FE , BE 에서 사용하도록 구현 (pakage/common)
  - 2개 이상 하용하는 기능 funtion, UI component 들은 모두 FE, BE 자체 코드 공통화 해야 함. 만약 fe, be  모두 동일하게 사용하거나 필요한 기능이라면 pakage/common  에 구현하도록 해야함.  
  - FE UI은 MPC 를 통해서 figma 와 연동 하여 정보를 로드하여 내부의 "01.references/refer_publlishing" 자료를 함께 검토하여 최적의 UI 컴포넌트를 구성하도록 해야함. (CSS , 컴포너트를 최대한 공통으로 만들어서 UI 통일성과 코드 재활용성을 높이도록 해야함.)
  - package 의존성도 잘 관리할 있도록 해야함. 중목으로 install 되지 않도록. 최대한 안적적인 최신의 버전으로 사용하도록 함. 쓸데없이 너무 많은 package를 install 하지 않고, 최적의 적당한 package를 install해서 사용할 수 있도록 해야함. 
  - local 개발용 script는 window/MacOS를 지원하는 script를 만들어야함.
  - server 용 script는 linux용으로 만들면됨. 
  - 코드 재활용성과 다지인 통일성, 코드 통일성을 고려해야합니다.(유지보수 용이 , 성능 고려)


## 01.01 아키텍쳐
```
06-IITP-DABT-Platform/
├── packages/
│   └── common/          # BE/FE 공통 유틸리티
├── be/                  # Backend (Node.js + Express + Sequelize)
├── fe/                  # Frontend (React + TypeScript + Vite)
|__ script/
|   └── local/           # local test용 build/dedploy/run script
|   └── server/          # server용 build/dedploy/run script
└── README.md            # 전체적인 설명 
```


## 01.02 Script 
### 01.02.01 local 
  * window/MacOS를 지원하는 script를 만들어야함.
  * common, fe, be 별도, 전체  build command 필요.
  * fe, be 별도, 모두 run  command 필요

### 01.02.02 server
  * 현재 있는 IITP-DABT-Admin 용  script를 참고하여  IITP-DABT-Platform 용 script를 생성해야함. 
  * build dir : /home/iitp-platf/iitp-dabt-platform 을 기본으로 함 
  * deploy dir : /var/www/iitp-dabt-platform 기본으로 함
  * build 시 전체 , fe, be, common 개별 build 명령어 필요.
  

# 02.Common
## 02.01 API 기본 설정 
  * API, URL등을 정의해서 BE, FE에서 공통으로 사용하게 한다. (api.sample.ts 참고)
  * BE, FE 가 공통으로 참조해야하는 상수/고정값등을  common에 정의하여 BE, FE 가 해당 값들을 참조한다.
  * API_URLS 에 모든 api url 정의 
  * FE을 위한 FULL_API_URLS 정의 
  * API_MAPPING 의 정보를 세팅할대 REQ에 대해서 body, params(경로), query 로 3개로 구분하여 정의. 
  * 데이터 category code 상수 정의 :  theme(자립테마별), data_type(데이터 유형별)
  * theme(자립테마별) code 상수 정의 : phy,emo, econ,soc
  * data_type(데이터 유형별) code 상수 정의 : basic, poi, emp
  * self_rlty_type(자립유형) code 상수 정의 : basic, phy,emo, econ,soc


## 02.02 COMMON API
  ### 02.02.01 헬스체크 조회  API
      REQ : 없음
      RES : status, timestamp, uptime

  ### 02.02.02 버전 정보 조회  API
      REQ : 없음
      RES : version, buildDate, environment

## 02.03 데이터 목록 데이터 조회 API
  ### 02.03.01 최신 데이터 리스트 6개 조회  API
      REQ : 없음
      RES : data_type, id, name
  ### 02.03.02 자립테마 데이터 건수 조회  API
      REQ  : 없음 
      RES : 각 테마별 건수 

  ### 02.03.03 데이터 유형별 데이터 건수 조회  API
      REQ  : 없음 
      RES : 각 유형별 건수 

  ### 02.03.04 자립 테마, 데이터 유형별 대상 검색 조회  API
      REQ  : 없음 
      RES : 검색 결과 ( )

  ### 02.03.05 자립 테마 리스트 전체 조회 API
      REQ  : 없음 
      RES : 테마 전체 리스트 (전체 건수 포함) 

  ### 02.03.06 자립 테마별 리스트 조회 API
      REQ  : 없음 
      RES : 해당 요청 테마 타입에 대한 리스트


  ### 02.03.07 데이터 유형 리스트 전체 조회 API
      REQ  : 없음 
      RES : 유형 타입에 전체 리스트 (전체 건수 포함) 

  ### 02.03.08 데이터 유형별 리스트 조회  API
      REQ  : 없음 
      RES : 해당 요청 유형 타입에 대한 리스트

  ### 02.03.09 데이터 데이블 상세 정보 조회 API
      parms : id?? 
      RES : 상세 정보


  ### 02.03.10 데이터 데이블별 미리보기 데이터 조회 API
      parms : id?? 
      RES : 조회된  api 리스트 (각 테이블별로 res 규격디 모두 다름으로 objct 형으로 지정해야함. 
      * open api 서버와 연동해서 데이터 받아올 것임. 





## 02.05 자립 수준 자가진단 관련 API
  ### 02.05.01 추천 정책 리스트 조회 API
      query : 성별, 장애정도, 연령, 요청 자립 테마 리스트 (요청 개수 포함)
      RES : 해당 리스트 3개

  ### 02.05.02 자립 지원 정책 리스트 조회 API
      REQ : 없음 
      RES : 해당 리스트 전체

  ### 02.05.03 자립 지원 기관 리스트 조회 API
      REQ : 없음 
      RES : 해당 리스트 전체


  ### 02.05.04  자립 지원 시설 리스트 조회 API
      REQ : 없음 
      RES : 해당 리스트 전체






## 02.06 자립 수준 자가진단 정보 세팅 
 * "01.references/IITP_장애인데이터플랫폼_데이터 설명 및 자가진단 문항, 로직_.fe용.xlsx" 파일에서  "자가진단 측정 문항", "자가진단 결과 로직" 시트를 참고한다. 
 * 한 문항당 20초 소요로 세팅한다. 이것은 상수로 정한다. FE에서 총문항 수과 총 소요시간 노출하는 화면이 있음. 
   결정 필요) 총 문항수, 총 소요시간 에 대해서 모두 상수로 정의할 건지 아니면 문항당 소요시간만 상수로 한뒤, FE에서 총 소요시간 = 문항수*한 문항당 소요시간 로 처리 할 것인지 결정 필요. 
   지금의 의견은 FE에서 총소요시간을 계산하는 것이 좋을 것 같음. 
 * 문항 점수 배점에 대한 상수 정의 필요. 점수 간격 과 한문항당 최대 점수 . 현재는 1점 간경, 최대 5점 임. 
 * 문항 배점 정보 및 소요시간 정보 를  고려해서 이 각각의 sheet 정보 및 로직 정의는 package/comon 에 있어야 한다.  현재는 FE에서 처리 (추후 BE에서 로직을 처리야 할지 모르기 때문에)
 

# 03.FE 
## 03.01 UI 디자인 및 스타일 (CSS) 구현
  * 등록되어 있는 figma-context-mcp 를 이용해서  Figma 디자인을 사용한다.  
    이미 허가되 access key등록하여 http://localhost:3333/mcp 만 호출해서 연동하면된다. 
  * figmad에서 가져온 결과와 내부의 "01.references/refer_publlishing" 자료를 함께 검토하여 최적의 UI 컴포넌트 및 UI를 구성하도록 해야함. 더 좋은 방안이 있으면 적극 반영. 
    모든 것은 코드 재활용성과 다지인 통일성, 코드 통일성 등이 포함된다. (유지보수 용이 , 성능 고려)
  * figma url : https://www.figma.com/design/FsZeTVRmRrS4KIgO0YZ2ba/-IITP-%E1%84%8C%E1%85%A1%E1%86%BC%E1%84%8B%E1%85%A2%E1%84%8B%E1%85%B5%E1%86%AB-%E1%84%83%E1%85%A6%E1%84%8B%E1%85%B5%E1%84%90%E1%85%A5-%E1%84%90%E1%85%A1%E1%86%B7%E1%84%89%E1%85%A2%E1%86%A8-%E1%84%86%E1%85%B5%E1%86%BE-%E1%84%92%E1%85%AA%E1%86%AF%E1%84%8B%E1%85%AD%E1%86%BC--GUI-v.1?node-id=78-1382&t=cyQ0aLbwa94Zvdzb-0
  
  * figma 디자인에서 "[SKII-UI-01]-01-02" 가 화면 번호가 됨. 내부적으로는 이것을 "
" 이런 형태로 인식하여 사용하도록함. 필요시에 주석에 표시. 

  * figma 디자인과 공통 layout, 공통 컴퍼넌트, 공통 스타일(css) 를 만든다. 
  각 컴퍼넌트 ID(??)와 그것을 구성하는 모든  element에  Id는 반드시 부여되야한다.
  예) 공통 버튼, 공통 alret, 공통 Dialogs, 공통 layout, 공통 리스트, LoadingSpinner 등등.


  * 특수한 경우가 아니면 상수 하드 코딩하는 것을 하지 않는다. 공통 정의 상수 또는 컴포넌트, 스타일(css) 등을 이용해서 변형하면 사용하도록 한다. 그래야 디자인 통일성과 유지 보수, 코드 재활용등이 높아 진다. 
  * 

## 03.02 env 정보
  * fe/env.sample 정보 로드



## 03.03 BE 연동 API 및 응답에 대한 공통 처리 구현 
  * package/common의 정의된 API 을 참고하여 API req/res를 공통 할수 있도록 한다. (URL, req/res 데이터 구조)
  * res에 대한 에러 코드 처리 도 공통처리하여 일관된 형태로 표시 할 수 일도록 한다. 에러가 발생할때 api를 호출한 해당 화면에 alert 형태로 표시한다. 

## 03.04 자립 수준 자가 진단 로직 
  * 자립 자가 진단은 FE 의 로직으로만 수행하고, 수행 결과에 따른 정책 리스트는 BE로 부터 받아 리스트를 노출하도록 합니다.
  * "01.references/IITP_장애인데이터플랫폼_데이터 설명 및 자가진단 문항, 로직_.fe용.xlsx" 파일에서  "자가진단 측정 문항", "자가진단 결과 로직" 시트를 참고한다. 
    이 각각의 sheet 정보 및 로직 정의는 package/comon 에 있어야 한다.  현재는 FE에서 처리 (추후 BE에서 로직을 처리야 할지 모르기 때문에)


## 03.05 화면별 화면이동 정보
### 03.05.01 SKII-UI-00-01-01 : home??
  * SKII-UI-00-01-01 화면에서 frame10 의 "자세히 보기" 클릭시 SKII-UI-00-01-02 로 이동
  * frame28 리스트 노출을 위해서 02.03.01 api 호출.
  * frame28 의 각 row 클릭시 02.03.09, 02.03.10 api 호출 및 SKII-UI-01-01-02 로 이동 
  * frame30 의 데이터 노출을 위해서 02.03.02 api 호출
  * frame30 의 각 테마를(아이템) 클릭시 02.03.06 api 호출 및 SKII-UI-01-01-01 로 이동 후 왼쪽 메뉴에 선택된 테마 표시 및 테마에 대한 리스트 노출.
  * frame30 의 "전체보기" 클릭시 02.03.05 api 호출 및 SKIII-UI-00-02-01 로 이동 후 왼쪽 메뉴에 선택된 테마 표시 없이 및 모든 리스트 노출
  * frame15 의 데이터 노출을 위해서 02.03.03 api 호출
  * frame15 의 각 데이터 유형별 클릭시 02.03.08 api 호출 및 SKII-UI-01-01-01로 이동 후 왼쪽 메뉴에 선택된 데이터 유형  표시 및 그 데이터 유형에 대한 리스트 노출
  * frame15 의 "전체보기" 클릭시 02.03.07 api 호출 및 SKIII-UI-00-02-01로 이동 후 왼쪽 메뉴에 선택된 데이터 유형 표시 없이 전체 데이터 유형 대한 리스트 노출
  * frame35 클릭시 SKII-UI-02-01-01 로 이동.
  * frame16에서 
      - "보행 약자 맵"을 클릭시 ‘준비중인 페이지입니다’ 팝업 처리
      - "무장애 관광 지도" 를 클릭시 ‘준비중인 페이지입니다’ 팝업 처리
      - "장애인 구인구직"을 클릭하면 env 의 VITE_EMPLOYMENT_SITE_URL 에 설정된 url로 새창(탭)을 띄워서 호출
   * frame12에서 검색어를 입력후 클릭시 또는 엔터키 입력시 02.03.04 api 호출해서 SKIII-UI-00-02-01 로 이동.


### 03.05.02 SKIII-UI-00-02-01 
  * frame36 은 브레드스크럼 표시 
  * api RES 리스트 노출 
  * 디자인대로 검색어 별도 표시. 
  * 검색어가 없이 호출된 경우에는 강조어 없이 리스트 노출. ("검색결과" 및 검색 결과 설명 문구 노출 없음)
  * 리스트의 각 row를 클릭하면 02.03.09, 02.03.10 api 호출 및 SKII-UI-01-01-02 로 이동



### 03.05.03 SKII-UI-01-01-01
  *  api RES 리스트 노출 
  *  페이지 라우트시 전달받은 데이터 타입(테마, 유형) , 해당 타입의 선택한 값으로 side-nav-bar 를 표시 
  *  default side-nav-bar 선택은 physical
  * 같은 다지인 포맷으로 용도에 맞게 page를 여러개 만들어도 괜찮음. 공통 유형끼리 1개의 page를 하는 것도 좋을 듯. 


### 03.05.04 SKII-UI-01-01-02
  *  api RES 정보 및 리스트 노출
  *  frame35 클릭시 [Confirm-01] 노출 -> "이동" 클릭시 env VITE_OPEN_API_CENTER_URL 로 새창 로드 
  *  "차트보기" 클릭시 env VITE_VISUAL_TOOL 로 새창 로드
  *  "다운로드" 클릭시 ‘준비중인 페이지입니다’ 팝업 처리


### 03.05.05 SKII-UI-00-01-02
  * "자립 수준 자가진단" 클릭시 SKII-UI-02-01-01으로 이동. 


### 03.05.06 SKII-UI-02-01-01 ~ SKII-UI-02-01-04
  *  "02.06 자립 수준 자가진단 정보 세팅" 에 의해서 /packagke/common 에 정의된 정보 로딩 
     총 문항 수 및 총 소요시간 정보, 문항 리스트 및 정보 로드 
  * /packagke/common 에 정의된 문항 정보 및 순서 , 배점등을 로드해서 진단 진행 처리
  * SKII-UI-02-01-01 ~ SKII-UI-01-02-04 의 디자인의 내용대로 진행할 수 있게 처리 
  * 자가진단이 완료 된 후에 진단 결과 로직 처리를 할 수일도록 해야함. 
  * SKII-UI-01-02-04에서 "결과보기" 를 클릭하면 이제까지 사용자가 선택한 정보들과 같이 SKII-UI-01-02-05 로 이동한다. 

### 03.05.07 SKII-UI-02-01-05
  * /packagke/common 에 정의된 진단 결과 로직등 정보 로드 
  * 사용자가 선택한 정보들로 진단 결과 로직 처리해서 결과 노출
  * 자립 부족으로 나온 테마들에 대해서 진단 결과 로직에 따라서 요청 개수 설정해서 02.05.01 api 호출 
  * frame120에서 02.05.01 api RES 정보 에서 각 item 클릭시 link 정보로 새창에서 로드 
  * "자가 진단 다시하기" 클릭시 사용자가 이미 선택한 정보 리셋 및 SKII-UI-02-01-02로 이동  
    (사용자가 이미 선택한 정보 리셋은 SKII-UI-02-01-02에서 처리하는 것이 더 좋을 수도 있음. )
  * "더 많은 지원 정보 보기“ 클릭시  SKII-UI-02-02-01 로 이동



### 03.05.08 SKII-UI-02-02-02
  * 이 화면은 Figma에 디자인 없음. 그러나 SKII-UI-01-01-01 같은 영태로 왼쪽 메뉴에는 side-nav-bar 에 "자립 지원 정책" , "자립 지원 기관", "자립 지원 시설"을 노출. 
  * default 는  "자립 지원 정책" 선택된 리스트로 나오는 화면.
  *  side-nav-bar 에서 각 메뉴 클릭시 해당 메뉴의 리스트를 노출 
  *  "자립 지원 정책" 클릭시 02.05.02 자립 지원 정책 리스트 조회 API
  *  "자립 지원 기관" 클릭시 02.05.03 자립 지원 기관 리스트 조회 API
  *  "자립 지원 시설" 클릭시 02.05.04 자립 지원 시설 리스트 조회 API




## 03.05 예외적 처리 필요한 것들 
  * SKII-UI-00-01-01 화면에서 
 




# 04.BE
## 04.01 기본 사항 
   * pakcage/common의 규격을 준수 한다.
   * API 규격 검증 및 REQ, RES 는 컨톨러에서 처리 (RES 데이터 매핑 포함)
   * 서비스 로직은 서비스단에서 처리
   * db 조회 처리는 repository에서 처리.
   * db entity는 model에 정의
   * 서비스 공통 처리 성격의 함수 (2개 이상 같은 로직 호출시) 를 정의해서 사용.
   * 아주 일반적인 stirng, date 처리 함수등 일반적인 공통함수 들은 util에 정의
  
## 04.02 log 설정 
   * 로그 dir은 실행되는 위치에 "logs" dir 생성후  
      application 용  : "app_yyyy-mm-dd" 으로 날자별 로그 파일 생성 
      access log 용   : "access_yyyy-mm-dd" 으로 날자별 api 호출 로그 파일 생성 

   * 공통된 로그 포맷 설정 필요. 반듯이 호출되는 함수정보도 포함. 
   * API RES/RES에 대한 규격화된 로그 포맷 필요. 
   * 되도록이면 공통된 포맷의 서비스단의 서비스 로직 처리 로그 필요. 마지막에 처리된 결과 한줄 요약 로그가  info 로 필요. 이것은 local/dev 환경에서만 적용됨. 
   * 에러로그도 공통된 포맷으로 남기도록함.  몇가지 패턴을 정해야함. 

## 04.03 env 설정
  * be/env.sample 정보 로드


## 04.04 open api 서버 연동 
   * env 에서 OPEN_API_AUTH_* 정보 로드해서 api 호출시 header에 세팅 
   * 구체적인 각 api 규격은 /01.references/openapi-v0.0.3.yaml 참고.
   * api 호출 기본 url은 env OPEN_API_SERVER_URL 정보로 함. 
   * page size 정보는 env OPEN_API_PAGE_SIZE 설정으로 한다. 
     전달 받은  req url에 size={{P_SIZE}} 이런 표현이 있으면 {{P_SIZE}} 값을 env OPEN_API_PAGE_SIZE 값으로 치환해서 요청한다.  
   * api 처리 공통 모듈 구현 필요 .

## 04.05 Common API 구현 
 *pakcage/common의 규격을 준수 한다.

### 04.05.01. 헬스 체크
  * db 조회 없이 처리 

### 04.05.02. VERSION
  * build시 build 정보 생성하여 해당 정보를 api 호출시에 전달 할 수 있도록 해야 함. 


## 04.06 데이터 목록 관련 처리 API 구현
pakcage/common의 규격을 준수 한다.

### 04.06.01 최신 데이터 리스트 6개 조회  API
   * 04.10.01 데이터 목록 테이블 조회 : (*최신순)

### 04.06.02 자립테마 데이터 건수 조회  API
  * 04.10.01 데이터 목록 테이블 조회 

### 04.06.03 데이터 유형별 데이터 건수 조회  API
  * 04.10.01 데이터 목록 테이블 조회 


### 04.06.04 자립 테마, 데이터 유형별 대상 검색 조회  API
  * 04.10.01 데이터 목록 테이블 조회 


### 04.06.05 자립 테마 리스트 전체 조회 API
  * 04.10.01 데이터 목록 테이블 조회 
  * 가나다순 데이터 정렬


### 04.06.06 자립 테마별 리스트 조회 API
  * 04.10.01 데이터 목록 테이블 조회 
  * 04.10.02 데이터 테이블 분류 정보 조회

### 04.06.07 데이터 유형 리스트 전체 조회 API
  * 04.10.01 데이터 목록 테이블 조회 
  * 가나다순 데이터 정렬


### 04.06.08 데이터 유형별 리스트 조회  API
  * 04.10.01 데이터 목록 테이블 조회
  * 04.10.02 데이터 테이블 분류 정보 조회


### 04.06.09 데이터 데이블 상세 정보 조회 API
  * 04.10.01 데이터 목록 테이블 조회 

### 04.06.10 데이터 데이블별 미리보기 데이터 조회 API
  * 04.10.01 데이터 목록 테이블 에서 id 로 정보 조회 
  * 테이블 정보의 open_api_url 과 env OPEN_API_* 정보를 이요한 공통 open api 처리 모듈 호출해서 처리 
    응답 res 그대로를 fe로 전달 처리 
    각 테이블별로 res 규격디 모두 다름으로 objct 형으로 지정해야함.(packag3e/common/api 규격에서 정해야 함. )


## 04.07. 자립자가진단 관련 처리 API
  * pakcage/common의 규격을 준수 한다.
  
### 04.07.01 추천 정책 리스트 조회 API
  * 04.10.03 장애인 자립 자가진단 - 정책·서비스 정보 테이블 조회. link가 있는 것만 조회

### 04.07.02 자립 지원 정책 리스트 조회 API
  * 04.10.03 장애인 자립 자가진단 - 정책·서비스 정보 테이블 조회.

### 04.07.03 자립 지원 기관 리스트 조회 API
  * 04.10.04 장애인 자립 자가진단 - 정책 제공 기관(Provider) 정보 테이블 조회


### 04.07.04 자립 지원 시설 리스트 조회 API
  *  04.10.05 장애인 자립 자가진단 - 정책 제공 시설(facility) 정보 테이블 조회



## 04.10 DDL 정보 
### 04.10.01 데이터 목록 테이블 
```
CREATE TABLE public.sys_data_summary_info (
	data_id int4 GENERATED BY DEFAULT AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 CYCLE) NOT NULL, -- system id, 고유 식별자 (자동 증가)
	target_data_id int4, --  Target Data info sys ID, data_type 에 따라서 id 참조. 예) stats_src_data_info.src_data_id
	
	data_type varchar(16) NOT NULL, -- Data Type (basic/poi/emp) 
    self_rel_type varchar(24),      -- 자립 테마 타입 (phys,emo, econ,soc)
	category varchar(24),           -- 카테고리 (기초, 신체 자립 현황, 의료 자립현황, 보조기기 사용 현황, 진로 교육 현황, 고용 현황, 사회망 현황, ...)
	
	title varchar(300) NOT NULL, -- 데이터명
	sys_tbl_id varchar(40) NOT NULL, -- iitp 데이터 테이블 ID
	
	src_org_name varchar(50) NOT NULL,      -- 데이터 제공처(기관명)
	src_latest_chn_dt varchar(12) NOT NULL, -- 수집기관 최종 자료갱신일 (예:2024-07-19)
	
	sys_data_ref_dt varchar(12) NULL, 		-- 데이터를 iitp 시스템에서 마지막 수집/참조 일자 (예:2024-07-19)
	sys_data_reg_dt varchar(12) NOT NULL,   -- 데이터를 iitp 시스템에 등록한 일자 (예:2024-07-19) 
	
	data_keywords varchar(220),        -- 데이터 키워드 (최대 3개), 데이터 포맷 :: [,,] 형식
	data_format varchar(60),            -- 제공 데이터 포맷 ([csv, json])
	
	data_desc varchar(300),            -- 데이터 설명
	data_usage_scope varchar(300),     -- 이용 데이터 범위 설명
	
	open_api_url varchar(300) NOT NULL, -- open api req url
	
	status char(1) DEFAULT 'A'  NOT NULL, -- 데이터 상태,  "data_status" comm code 참조
	del_yn char(1) DEFAULT 'N'::bpchar NOT NULL, -- 삭제여부 (Y: 삭제)
	
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, -- 레코드 생성 시각
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP, -- 레코드 수정 시각
	deleted_at timestamptz NULL, -- 삭제 일시 (논리 삭제 시 기록)
	CONSTRAINT pkey_sys_data_sumary_info PRIMARY KEY (data_id)
);

CREATE UNIQUE INDEX uidx_sys_data_sumary_info_sys_tbl_id ON public.sys_data_summary_info USING btree (sys_tbl_id);
CREATE INDEX  idx_sys_data_sumary_info_title ON public.sys_data_summary_info USING btree (title);
CREATE INDEX  idx_sys_data_sumary_info_data_type ON public.sys_data_summary_info USING btree (data_type);
CREATE INDEX  idx_sys_data_sumary_info_self_rel_type ON public.sys_data_summary_info USING btree (self_rel_type);

COMMENT ON TABLE public.sys_data_summary_info IS 'IITP 전체 데이터별 요약 정보';
```

### 04.10.02 데이터 테이블 분류 정보
```
CREATE TABLE selfdiag_data_category (
    id          SERIAL PRIMARY KEY,
    category    VARCHAR(50) NOT NULL,  -- 카테고리: theme, data_type
    name        VARCHAR(100) NOT NULL,  -- 카테고리명: 자립테마별, 데이터 유형별
    menu_id     VARCHAR(50) NOT NULL,  -- 메뉴 id (theme : physical,emotional, economic,social, data_type : basic, poi, emp)
    menu_name   VARCHAR(100) NOT NULL, -- 메뉴 항목명: 신체적 자립, 정서적 자립 등
    description VARCHAR(600) NOT NULL,  -- 메뉴별 간단한 설명
    created_at  timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at  timestamptz 
);
COMMENT ON TABLE public.selfdiag_data_category IS 'IITP 데이터 테이블 분류 정보';

INSERT INTO selfdiag_data_category (category, name, menu_id, menu_name, description)
VALUES
('theme', '자립테마별', 'phys', '신체적 자립', '신체적 자립 수준 및 건강 상태 등 신체 기능과 관련된 데이터'),
('theme', '자립테마별', 'emo', '정서적 자립', '심리적 안정 및 지원 등 정서 안정과 관련된 데이터'),
('theme', '자립테마별', 'econ', '경제적 자립', '장애인 진로교육 및 고용 현황 등 일자리와 관련된 데이터'),
('theme', '자립테마별', 'soc', '사회적 자립', '사회복지시설 및 지역사회 참여 현황 등 사회적 기능과 관련된 데이터'),
('data_type', '데이터 유형별', 'basic', '기초 데이터', '장애인과 관련된 기본 통계 및 기초 자료'),
('data_type', '데이터 유형별', 'poi', '이동권 데이터', '교통·보행 등 장애인 이동 및 접근성과 관련된 자료'),
('data_type', '데이터 유형별', 'emp', '일자리 데이터', '고용 현황, 취업 지원, 직업 활동과 관련된 자료'),
('self_rlty_type', '자립유형', 'basic', '기초', '기본 적인 장애 자립 관련 정보(정책, 기관, 시설)'),
('self_rlty_type', '자립유형', 'phys', '신체', '신체적 자립 관련 정보 (정책, 기관, 시설)'),
('self_rlty_type', '자립유형', 'emo', '정서', '정서적 자립 관련된 정보 (정책, 기관, 시설)'),
('self_rlty_type', '자립유형', 'econ', '경제', '경제적 자립 관련된 정보 (정책, 기관, 시설)'),
('self_rlty_type', '자립유형', 'soc', '사회', '사회적 자립 관련된 정보 (정책, 기관, 시설)');



```

### 04.10.03 장애인 자립 자가진단 - 정책·서비스 정보
```
CREATE TABLE selfdiag_policy (
    policy_id       SERIAL PRIMARY KEY,                 -- PK
    category        VARCHAR(90) NOT NULL,                  -- 구분 (예: 생활 안정 지원, 생활요금 감면)
    policy_name     VARCHAR(300) NOT NULL,                 -- 항목명 (예: 장애인연금, 장애수당)
    self_rlty_type       VARCHAR(50),                           -- 관련 자립 유형 (기초, 경제, 정서, 사회 등)
    region          VARCHAR(100),                          -- 사업 단위 (전국, 시군구 등)
    gender          VARCHAR(50),                           -- 대상 성별 (남성, 여성, "여성, 남성")
    age_cond        VARCHAR(50),                           -- 연령 조건 (minor=미성년자, adult=성인, all=미성년+성인')
    dis_level       VARCHAR(50),                           -- 장애 정도 (중증, 경증)
    fin_cond        VARCHAR(100),                          -- 재정 조건 (중위소득 50~100% 등)
    target          VARCHAR(3000),                                  -- 대상자 설명
    benefit         VARCHAR(6000),                                  -- 지원 내용 설명
    link            VARCHAR(512),                                  -- 상세 이동 링크(URL)
    created_at      timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,               -- 생성 시각
    updated_at      timestamptz                 -- 수정 시각
);
COMMENT ON TABLE selfdiag_policy IS '장애인 자립 자가진단 - 정책·서비스 정보';
```

### 04.10.04 장애인 자립 자가진단 - 정책 제공 기관(Provider) 정보

```
CREATE TABLE selfdiag_provider (
    provider_id         SERIAL PRIMARY KEY,           -- PK
    provider_name       VARCHAR(200) NOT NULL,           -- 제공기관명 (지점명까지 포함)
    service_name        VARCHAR(200) NOT NULL,           -- 제공 서비스명
    address             VARCHAR(300) NOT NULL,           -- 주소 (시군구 + 상세주소 포함)
    phone               VARCHAR(50),                    -- 전화번호
    rep_name 			VARCHAR(100),                   -- 대표자명 (선택 입력)
    description         VARCHAR(900),                           -- 비고/기관 상세설명
    created_at           timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, -- 생성일시
    updated_at           timestamptz                       -- 수정일시
);
COMMENT ON TABLE selfdiag_provider IS '장애인 자립 자가진단 - 정책 제공 기관(Provider) 정보 테이블';
```

### 04.10.05 장애인 자립 자가진단 - 정책 제공 시설(facility) 정보
```
CREATE TABLE selfdiag_facility (
    facility_id       SERIAL PRIMARY KEY,
    device           VARCHAR(300), -- 설치 기기
    install_area     VARCHAR(100),          -- 설치 지역
    install_site     VARCHAR(300),          -- 설치 장소
    install_spot     VARCHAR(300),          -- 설치 위치 (건물 내 위치 등)
    hang_dong        VARCHAR(60),           -- 행정동
    address           VARCHAR(300),          -- 상세 주소
    opening_hours     VARCHAR(300),          -- 이용 시간
    quantity          INT DEFAULT 0,                   -- 설치 대수
    note              VARCHAR(900),                  -- 비고
    created_at         timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at         timestamptz
);
COMMENT ON TABLE selfdiag_provider IS '장애인 자립 자가진단 - 정책 제공 시설(facility) 정보 테이블';
```
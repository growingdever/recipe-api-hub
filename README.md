# 프로젝트 개요
6기 소프트웨어 마에스트로 1단계 프로젝트입니다.

## 배포된 서버
클릭하면 해당 링크로 이동합니다.
* <a href="https://recipe-main.herokuapp.com" target="_blank">[Heroku]</a>

**읽기 전에** 

1. 본문 특히 코드 블럭에서 '**/**'로 시작하는 문자열들은 대부분 URL을 의미합니다. (예: /register -> 'http://recipe-main.herokuapp.com/register' 또는 'http://localhost:1337/register')
2. 이 문서에서 뭔가 잘못된 점을 발견하셨다면, *이미 알고 있다*는 뜻이시니 알아서 수정하세요.

## 로컬 서버 실행
```sh
# 레포 다운로드, Node.js 가 필요합니다.
git clone git@github.com:soma-6th/recipe-api-main.git
cd recipe-api-main
npm install
npm start
```

## API 라우트 주소
```sh
# View list
/register # 웹에서 가입
/login    # 웹에서 로그인

/auth/local/register # API 형태 가입

# RESTful API list
/users
/likes
/views
/recipes
/feels

# Additional API
/auth/getAccessToken  # 자세한 설명은 생략한다
/users/me             # 인증한 '나' 정보를 받는다.
```

### Handle Auth API BadRequest
Auth API는 기본적으로 작업에 실패하면 다른 웹페이지로 리다이렉트합니다. 만약 당신이 외부 기기에서 요청해서 리다이렉트 대신 정확한 에러 메세지를 받고 싶다면 파라메터에 device를 추가하고 기기의 이름을 넣어주세요. (예: device=android)
```js
// Error List
{
  "Error.Passport.Password.Invalid": "패스워드 형식좀 ㅡㅡ",
  "Error.Passport.Password.Wrong": "패스워드가 달라!",
  "Error.Passport.Password.NotSet": "패스워드 안넘겼어",
  "Error.Passport.Username.NotFound": "네 이름으로 된 사람 없는데?",
  "Error.Passport.User.Exists": "네 이름 중복됬어",
  "Error.Passport.Email.NotFound": "그런 이메일 없는데?",
  "Error.Passport.Email.Missing": "이메일 내놔라",
  "Error.Passport.Email.Exists": "이메일 중복 ㅡ.",
  "Error.Passport.Username.Missing": "이름 내놔 ㅡ",
  "Error.Passport.Password.Missing": "너 왜 비번이 없냐!",
  "Error.Passport.Generic": "패스포트에 이상한게 들어갔어.."
}

// 이런 결과로 나올 것입니다.
{
  error: "Error.Passport.Password.Invalid"
}
```

### API attributes
패키지의 `/api/models/*.js` 위치에 모델의 인터페이스가 나와있습니다. 아래는 User.js 파일 예시입니다.
```js
var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,

  //
  attributes: {
    /** @type {Object} 유저 닉네임 */
    username: {
      type: 'string',
      unique: true,
      minLength: 2,
    },

    /** @type {Object} 유저 이메일 */
    email: {
      type: 'email',
      unique: true,
      required: true,
    },

    /** @type {Object} 유저 나이 */
    age: {
      type: 'integer',
      min: 1, max: 150,
      defaultsTo: 20,
    },

    /**
     * 유저 성별
     * 0: 등록 안됨
     * 1: 남자
     * 2: 여자
     * 3: 모름
     * 
     * @type {Object}
     */
    gender: {
      type: 'integer',
      min: 0, max: 3,
      defaultsTo: 0,
    },

    /** @type {Object} 비밀번호 */
    passports : {
      collection: 'Passport',
      via: 'user'
    }
  }
};

module.exports = User;
```
attributes 의 항목은 모델의 속성을 의미합니다. 여기에 대한 해석이 필요하다면 [Waterline](https://github.com/balderdashy/waterline#collection) 을 참고하세요.

## 인증
인증하기 위해 bearer 방법을 사용합니다. 토큰 방식을 사용하면 자격 확인을 위해 매번 유저 아이디와 비밀번호를 전송할 필요가 없습니다.

### 토큰 받기
```
POST /auth/getAccessToken
```
* 파라메터
    - identifier: 이메일 또는 유저 이름
    - password: 유저 비밀번호

정확한 정보를 입력한다면 아래처럼 JSON 형식으로 토큰을 받을 수 있습니다.
```
{
  "accessToken": "HMSi47aRUmB7DeSKvmlLQpJ7nT3r/hDPfskXdAoOfeeP4ojuWDFZR3tOXylfHdI7"
}
```
토큰을 유실하면 다시 토큰을 받아야 하니 잘 저장해두세요.

### 토큰 전송
```sh
# 더러운 방법, URL Query나 body에 토큰을 전송하는 것을 의미한다.
/api?access_token=HMSi47aRUmB7DeSKvmlLQpJ7nT3r/hDPfskXdAoOfeeP4ojuWDFZR3tOXylfHdI7

# 탁월한 선택, 헤더에 토큰을 포함시킨다.
Authorization: Bearer HMSi47aRUmB7DeSKvmlLQpJ7nT3r/hDPfskXdAoOfeeP4ojuWDFZR3tOXylfHdI7
```
두 방법 모두 인증이 가능합니다. 하지만 더러운 방법은 100% 확률로 API 사용 과정에서 문제를 야기시킬 것입니다.

### 인증 검사
인증이 제대로 동작하는지 알아보기 위해서 토큰을 전송해서 자신에 대한 정보를 받을 수 있는지 시도해볼 수 있습니다.
```
대상 URL
/users/me

// 토큰이 없는 경우
Unauthorized

// 토큰이 있는 경우
{
  "username": "beingbook",
  "email": "beingbook@gmail.com",
  "id": 1,
  "createdAt": "2015-07-21T17:18:17.919Z",
  "updatedAt": "2015-07-21T17:18:17.919Z"
}
```

## Models
* *User*: 사용자 모델
    - `/users`
* *Passport*: 사용자 비밀번호, 토큰
* *Recipe*: 레시피
    - `/recipes`
* *Review*: 레시피 리뷰
    - `/reviews`
* *Feel*: 레시피 식감
    - `/feels`
* *Like*: 좋아요
    - `/likes`
* *View*: 조회 기록
    - `/views`
* *Resource*: 파일(이미지 등)
    - `/resources`

## Blueprint(RESTful API)
특정 모델에 대한 추가(Create), 조회(Find), 수정(Update), 삭제(Destroy)를 정해진 URL 형식으로 수행할 수 있습니다. 이 프로젝트는 Sails의 Blueprint 기능을 기반으로 동작합니다. [원문](http://sailsjs.org/documentation/reference/blueprint-api)을 참조하면 더 자세한 내용을 읽을 수 있습니다.
```
# 앞에 있는 POST, GET, PUT, DELETE는 Request Method를 의미합니다.
# 새 리뷰 등록
POST '/reviews' {title: '리뷰 제목', 'content': '리뷰 내용 블라블라 썸띵 에라 모르겠다 냅다 컨닝', recipe: 123, ...}

# 리뷰 조회
GET '/reviews' # 최근 등록된 리뷰 30개를 가져옵니다. (모든 API에 대해서 기본 30개)
GET '/reviews?limit=40' # 최근 등록된 40개 가져옵니다.
GET '/reviews?skip=10' # 최근 10개를 스킵해서 가져옵니다.
GET '/reviews?sort=createdAt DESC' # 생성 날짜 기준 내림차순으로 정렬합니다. '필드 이름 <ASC | DESC>' 식으로 사용할 수 있다.
GET '/reviews?where={"content":{"contains":"짱짱"}}' # '짱짱' 이란 내용이 'content'필드에 있는 항목들만 가져옵니다.
GET '/reviews/3' # id가 3인 리뷰를 가져옵니다.

# 리뷰 수정
PUT '/reviews/3' # id가 3인 리뷰를 수정합니다.

# 리뷰 삭제
DELETE '/reviews/3' # id가 3인 리뷰를 삭제합니다.
```

## ML API
머신러닝 API 입니다. 미구현상태입니다. 다음과 같은 형식으로 지원할 예정입니다.

```
/ml/recommendation/recipes  # 사용자한테 추천할 레시피 N개 리턴
/ml/similar/recipes         # 해당 레시피와 비슷한 레시피 N개
/ml/rank/recipes            # 레시피 N개 중 특정 사용자에게 맞춘 우선순위
```

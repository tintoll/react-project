const jwt = require('jsonwebtoken');

// 첫번째 파라미터는 토큰에 넣을 데이터, 두번째는 비밀 키, 세번째는 옵션, 네번째는 콜백함수가 들어갑니다. 
const token = jwt.sign({foo:'bar'},'secret-key',{expiresIn:'7d'}, (error,token) => {
  if(error) {
    console.log(err);
    return;
  }
  console.log(token);
});


// 디코딩

jwt.verify(token, jwtSecret, (error, decoded) => {
  if(error) {
      console.error(error);
      return;
  }
  console.log(decoded);
});
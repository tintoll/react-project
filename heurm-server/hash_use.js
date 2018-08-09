const crypto = require('crypto');
const password = 'abc123';
const secret = 'MySecretKey1$1$234';
const hashed = crypto.createHmac('sha256', secret).update(password).digest('hex');

console.log(hashed);

/*
일반 SHA256 과, HMAC SHA256 은 해싱 방식이 조금 다른데요, 
HMAC SHA256 의 경우엔 데이터를 주어진 비밀키(secret) 와 함께 해싱을 하고,
해싱된 결과물을 비밀키와 함께 다시한번 해싱을 합니다.
이렇게 함으로서, 해시의 보안이 강화됩니다.
*/
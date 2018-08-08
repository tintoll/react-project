const mongoose = require('mongoose');
const { Schema } = mongoose;

// Book에서 사용할 서브스키마
const Author = new Schema({
    name : String,
    email : String
});

const Book = new Schema({
    title : String,
    author : [Author],
    publishedDate : Date,
    price : Number,
    tags : [String],    
    createAt : { // 기본값셋팅시 사용
        type : Date,
        default : Date.now
    }
});

// 스키마를 모델로 변환하여, 내보내기 합니다.
// model 함수에선 기본적으론 두개의 파라미터를 필요로합니다. 
// 첫번째는 파라미터는 해당 스키마의 이름이고, 두번째는 스키마 객체입니다
// 스키마의 이름을 정해주면, 이의 복수형태로 컬렉션이름을 만들어줍니다
//  Book 으로 설정한다면, 실제 데이터베이스에서 생성되는 컬렉션 이름은 books 입니다.
module.exports = mongoose.model('Book',Book);

// mongoose.model('Book', Book, 'custom_book_collection'); //내가 원하는 명으로 만들고 싶으면 세번째 파라미터에 값을 넣어주면된다.
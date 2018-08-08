const Book = require('models/book');

const Joi = require('joi');
const { Types : { ObjectId } } = require('mongoose');
// const ObjectId = require('mongoose').Types.ObjectId --> es5

// 단일 데이터 조회
exports.get = async (ctx) => {
    const { id } = ctx.params; // URL 파라미터에서 id 값을 읽어옵니다.

    let book;

    try {
        book = await Book.findById(id).exec();
    } catch (e) {
        if(e.name === 'CastError') {
            ctx.status = 400;
            return;
        }
        return ctx.throw(500, e);
    }

    if(!book) {
        ctx.status = 404;
        ctx.body = {message : 'book not found'};
        return;
    }
    ctx.body = book;
}
exports.list = async (ctx) => {
    // (let 이나 const 는 scope 가 블록단위이기 때문에, try 바깥에 선언을 해줍니다)
    let book;
    try {
        // .exec() 를 뒤에 붙여줘야 실제로 데이터베이스에 요청이 됩니다.
        // 반환값은 Promise 이므로 await 을 사용 할 수 있습니다.
        // 전체데이터 가져오기 
        // book =  await Book.find().exec();

        // 데이터를 _id의 역순으로 정렬하고 3개만 보여주도록 제한을 주겠습니다. 
        book = await Book.find()
                    .sort({_id:-1}) //id의 역순
                    .limit(3)
                    .exec();
    } catch (e) {
        return ctx.throw(500, e);
    }

    ctx.body = book;
}

exports.create = async (ctx) => {
    // request body에서 값을 추출한다.
    const {
        title, 
        authors, 
        publishedDate, 
        price, 
        tags 
    } = ctx.request.body;

    const book = new Book({
        title, 
        authors, 
        publishedDate, 
        price, 
        tags
    });

    //.save() 함수를 실행하면 이 때 데이터베이스에 실제로 데이터를 작성합니다.
    try {
        await book.save();
    } catch (e) {
        // HTTP 상태 500 와 Internal Error 라는 메시지를 반환하고, 
        // 에러를 기록합니다.
        return ctx.throw(500, e);
    }

    ctx.body = book;
};

exports.delete = async (ctx) => {
    /* 데이터 삭제관련 메서드
    .remove: 특정 조건을 만족하는 데이터들을 모두 지웁니다.
    .findByIdAndRemove: id 를 찾아서 지웁니다.
    .findOneAndRemove: 특정 조건을 만족하는 데이터 하나를 찾아서 지웁니다.
    */
    const {id} = ctx.params;
    try {
        await Book.findByIdAndRemove(id).exec();
    } catch (e) {
        if(e.name === 'CastError') {
            ctx.status = 400;
            return;
        }
        return ctx.throw(500, e);
    }

    ctx.status = 204; //no content
};

exports.replace = async (ctx) => {
    const { id } = ctx.params;
    
    // id  검증
    if(!ObjectId.isValid(id)) {
        ctx.status = 400; // Bad Request
        return;
    }
   
    // 먼저, 검증 할 스키마를 준비해야합니다.
    const schema = Joi.object().keys({
        title : Joi.string().required(),
        authors: Joi.array().items(Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().email().required() // 이런식으로 이메일도 손쉽게 검증가능합니다
        })),
        publishedDate: Joi.date().required(),
        price: Joi.number().required(),
        tags: Joi.array().items((Joi.string()).required())
    });

    // 그 다음엔, validate 를 통하여 검증을 합니다.
    const result = Joi.validate(ctx.request.body, schema);

    if(result.error) {
        ctx.status = 400; // Bad Request
        ctx.body = result.error;
        return;
    }

    let book;
    try {
        book = await Book.findByIdAndUpdate(id, ctx.request.body, {
            upsert: true, // 이 값을 넣어주면 데이터가 존재하지 않으면 새로 만들어줍니다
            new: true // 이 값을 넣어줘야 반환하는 값이 업데이트된 데이터입니다.
                      // 이 값이 없으면 ctx.body = book 했을때 업데이트 전의 데이터를 보여줍니다.
        });
    } catch (e) {
        return ctx.throw(500, e);
    }
    ctx.body = book;
};

exports.update = async (ctx) => {
    const { id } = ctx.params; // URL 파라미터에서 id 값을 읽어옵니다.

    if(!ObjectId.isValid(id)) {
        ctx.status = 400; // Bad Request
        return;
    }

    let book;

    try {
        // 아이디로 찾아서 업데이트를 합니다.
        // 파라미터는 (아이디, 변경 할 값, 설정) 순 입니다.
        book = await Book.findByIdAndUpdate(id, ctx.request.body, {
            // upsert 의 기본값은 false 입니다.
            new: true // 이 값을 넣어줘야 반환하는 값이 업데이트된 데이터입니다. 이 값이 없으면 ctx.body = book 했을때 업데이트 전의 데이터를 보여줍니다.
        });
    } catch (e) {
        return ctx.throw(500, e);
    }

    ctx.body = book;
};
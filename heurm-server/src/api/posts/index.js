const Router = require("koa-router");
const posts = new Router();

const postsCtrl = require("./posts.controller");
const likesCtl = require("./like.controller");

posts.post("/", postsCtrl.write);
posts.get("/", postsCtrl.list);

posts.post("/:postId/likes", likesCtl.like);
posts.delete("/:postId/likes", likesCtl.unlike);

module.exports = posts;

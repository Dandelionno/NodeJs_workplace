const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const Util = require(__dirname + '/lib/util');

const app = new Koa();
const router = new Router({
	prefix: '/backend'
});

/* >>>>>>>>>>>>>>>>  中间件  <<<<<<<<<<<<<<<<<<< */
app.use(bodyParser())

app.use(async (ctx, next) => {
	await next();
	const rt = ctx.response.get('X-Response-Time');
	console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});


app.use(async (ctx, next) => {
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	ctx.set('X-Response-Time', `${ms}ms`);
});


/* >>>>>>>>>>>>>>>>>  路由  <<<<<<<<<<<<<<<<<<<<< */
router.get('/', async ctx => {
	console.log(ctx.ip);
	ctx.body = 'Hello World';
});


router.get('/user', async (ctx, next) => {
	ctx.response.body = '<h5>Index</h5>';
});

app.use(router.routes());


//一些测试
(async () => {
	console.log(new Date());
	await Util.sleep(2000);
	console.log(new Date());
})()


//开始监听
app.listen(8001, () => {
	console.log('server start')
});
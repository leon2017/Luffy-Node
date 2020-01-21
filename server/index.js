const Koa = require('koa')
const consola = require('consola')
const json = require('koa-json')
const session = require('koa-generic-session')
const bodyParser = require('koa-bodyparser')
const { Nuxt, Builder } = require('nuxt')
const usersRouter = require('./routes/user'),
errorHandle = require('./middlewares/errorHandle'),
sendHandle = require('./middlewares/sendHandle');

const app = new Koa()
require('./config/db')
app.keys = ['keys', 'keyskeys']
app.use(session({
  key: 'fin',
  prefix: 'fin:uid',
  maxAge: 1000, /** (number) maxAge in ms (default is 1 days)，cookie的过期时间 */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** cookie是否只有服务器端可以访问 (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  // store: new Redis() // 将session存入redis 不传options 默认就是连接127.0.0.1:6379 不使用redis缓存
}))
app.use(bodyParser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(sendHandle())
app.use(errorHandle)
// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(app.env === 'production')

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)
  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server
  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }else {
    await nuxt.ready()
  }
  app.use(usersRouter.routes()).use(usersRouter.allowedMethods())
  app.use(ctx => {
    ctx.status = 200 // koa defaults to 404 when it sees that status is unset

    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve)
      ctx.res.on('finish', resolve)
      nuxt.render(ctx.req, ctx.res, promise => {
        // nuxt.render passes a rejected promise into callback on error.
        promise.then(resolve).catch(reject)
      })
    })
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()

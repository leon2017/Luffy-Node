const Router = require('koa-router')
const User = require('../controllers/user.js')
const router = new Router({
  prefix: '/users' // 路由前缀
})
router.post('/register', User.register)
router.post('/login', User.login)
router.get('/info', User.userinfo)

module.exports = router
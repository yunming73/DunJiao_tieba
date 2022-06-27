const express = require('express')

// 创建express服务器实例
const app = express()
    // 导入并配置cors中间件
const cors = require('cors')

// 引入body-parser，获取前端传送过来的数据
const bodyParser = require('body-parser')

// 将cors注册为全局中间件
app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: false }))

//封装消息函数
app.use((req, res, next) => {
        // 错误
        res.ResData = function(err, status = 1, data = {}) {
            res.send({
                data,
                meta: {
                    status,
                    msg: err instanceof Error ? err.message : err
                }
            })
        }
        next()
    })
    // 图片路径
app.use('/img', express.static('imgs'))

// 用户登录路由模块
const LoginRouter = require('./router/login')
app.use('/api/private/v1', LoginRouter)
    // 用户路由模块
const usersRouter = require('./router/users')
app.use('/api/private/v1', usersRouter)
    // 首页路由模块
const HomeRouter = require('./router/home')
app.use('/api/private/v1', HomeRouter)
    // 吧路由模块
const BasRouter = require('./router/bas')
app.use('/api/private/v1', BasRouter)
    // 头像上传模块
const Upload = require('./router/upload')
app.use('/api/private/v1', Upload)
    // 帖子图片上传模块
const UploadContent = require('./router/uploadcontent')
app.use('/api/private/v1', UploadContent)
    // 贴吧头像上传模块
const UploadBaImg = require('./router/uploadBaImg')
app.use('/api/private/v1', UploadBaImg)
    // 轮播图上传模块
const UploadBanner = require('./router/uploadBanner')
app.use('/api/private/v1', UploadBanner)
    // 监听服务器端口
app.listen(99, () => {
    console.log('http://127.0.0.1:99/api/private/v1');
})
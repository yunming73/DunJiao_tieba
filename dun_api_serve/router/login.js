// 用户路由模块
const express = require('express')

// 创建路由器对象
const router = express.Router()

// 用户路由处理函数
const handle = require('../router_handler/login')

// 登录接口
router.post('/login', handle.login)
    // 前端退出接口(更新用户登录状态)
router.put('/logout', handle.logout)
    // 后台管理员登录接口
router.post('/admin/login', handle.adminLogin)
    // 将路由对象共享出去
module.exports = router
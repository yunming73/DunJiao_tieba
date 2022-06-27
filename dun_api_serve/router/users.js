// 用户管理路由
const express = require('express')
const router = express.Router()
    // 引入用户管理处理函数
const Handler = require('../router_handler/users')
    // 添加用户
router.post('/users', Handler.addUsers)
    //获取用户列表
router.get('/getusers', Handler.getUsers)
    //删除用户
router.delete('/delusers', Handler.delUsers)
    // // 查询id用户信息
router.get('/users/:id', Handler.searchUser)
    // 更新用户数据
router.put('/users/renew/:id', Handler.submit)
    // 修改用户密码
router.put('/users/putpassword', Handler.putpassword)
    // 修改用户头像
router.put('/user/renew/img/:id', Handler.submitUserImg)
    // 修改用户封禁状态
router.put('/user/black/:id', Handler.submitUserBlack)
    // 获取用户帖子列表
router.get('/user/content', Handler.userContent)
    //获取用户关注列表
router.get('/user/focusOn', Handler.userFocusOn)
    //获取用户粉丝列表
router.get('/user/fan', Handler.userFan)
    // 查询用户收藏列表
router.get('/user/collect', Handler.userCollect)
    // 查询是否关注这个用户
router.get('/user/seaLike', Handler.seaLike)
    // 关注这个用户
router.post('/user/addLike', Handler.addLike)
    // 取消关注这个用户
router.delete('/user/delLike', Handler.delLike)
    // 用户发送申请小吧主 
router.post('/user/ba/applicationTeam', Handler.applicationTeam)
    // 用户申请小吧主的列表
router.get('/user/getTeam/:id', Handler.getUserTeam)
    // 用户撤销申请小吧主
router.delete('/user/delTeam', Handler.delTeam)
    // 吧主接收的申请
router.get('/user/ba/getTeam/:id', Handler.getBaTeam)
    // 吧主处理接收的申请(修改申请状态+处理结果)
router.put('/user/ba/submitTeam', Handler.submitBaTeam)
    // 吧主添加小吧主
router.put('/user/ba/addTeam', Handler.addBaTeam)
    // 吧主删除小吧主
router.put('/user/ba/delTeam', Handler.delBaTeam)
    //查询用户是吧主的贴吧列表
router.get('/user/admin/:id', Handler.getUserBaAdmin)
    //查询用户是小吧主的贴吧列表
router.get('/user/team/:id', Handler.getUserBaTeam)
    // 用户申请创建贴吧
router.post('/user/ba/createBa', Handler.createBa)
    // 处理申请创建贴吧申请(修改申请状态+处理结果)
router.put('/user/ba/submitCreate', Handler.submitBaCreate)
    // 查看指定用户申请创建贴吧的列表(和下面全部列表重复，删除需要前端接口,代码更换)
router.get('/user/ba/getBa/:id', Handler.getBaUserTeam)
    // 用户申请创建贴吧的全部列表
router.get('/user/getBa/application', Handler.getBaApplication)
    // 用户撤销申请创建贴吧
router.delete('/user/ba/delBa', Handler.delBa)
    // 修改吧基本信息
router.put('/user/submitba/:id', Handler.submitba)
    // 用户添加历史记录
router.put('/user/addHistoryRecord', Handler.addHistoryRecord)

module.exports = router
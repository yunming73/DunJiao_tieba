const express = require('express')

const router = express.Router()

// 导入主页路由处理函数模块
const Handler = require('../router_handler/home')
    // 获取轮播图列表
router.get('/home/banner', Handler.banner)
    // 修改轮播图
router.put('/home/subbanner/:id', Handler.subbanner)
    //获取粉丝数量 关注数量 帖子数量
router.get('/home/stats', Handler.stats)
    //获取用户关注吧列表---(暂定，可使用，查询结果应该是分页格式)
router.get('/home/basCollect/:id', Handler.basCollect)
    // 获取最新帖子列表
router.get('/home/contents', Handler.getContentTime)
    // 获取热门贴吧列表(根据关注数)
router.get('/home/hotbas', Handler.getBasHot)
    // 获取热门帖子列表(七天内 按评论数排序 取十条)
router.get('/home/hot', Handler.getContentHot)
    // 搜索主贴--模糊搜索
router.get('/home/search/content', Handler.searchHomeContent)
module.exports = router
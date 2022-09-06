// 首页的处理函数
const { query } = require('express')
const dayjs = require('dayjs')
const db = require('../db/index')
    // 轮播图
exports.banner = (req, res) => {
        var sql = "SELECT * FROM home_banner"
        db.query(sql, (err, result) => {
            if (err) return res.ResData("获取轮播图失败")
            var banners = []
            for (let i = 0; i < result.length; i++) {
                banners.push({
                    'id': result[i].hb_id,
                    'imgUrl': result[i].hb_imgUrl,
                    'hrefUrl': result[i].hb_hrefUrl
                })
            }
            res.ResData('获取轮播图成功', 200, banners)
        })
    }
    // 修改轮播图
exports.subbanner = (req, res) => {
        var id = req.params.id
        var img = req.body.img
        var url = req.body.url
        if (url == '') url = '/'
        var sql = "UPDATE home_banner SET hb_imgUrl=?,hb_hrefUrl=? WHERE hb_id=?"
        db.query(sql, [img, url, id], (err, result) => {
            if (err) return res.ResData('修改轮播图出错')
            if (result.affectedRows < 1) return res.ResData('修改轮播图失败')
            res.ResData('修改轮播图成功', 200)
        })
    }
    // 关注粉丝帖子数量信息
exports.stats = (req, res) => {
        const user_id = req.query.id
            //粉丝
        var sql = "SELECT COUNT(*) as count1 FROM user_fan WHERE fa_user_id=?"
        db.query(sql, user_id, (err, result1) => {
            if (err) return res.ResData("获取粉丝数量失败")
                // 关注
            var sql2 = "SELECT COUNT(*) as count2 FROM user_fan WHERE fa_ruser_id=?"
            db.query(sql2, user_id, (err, result2) => {
                if (err) return res.ResData("获取关注数量失败")
                var sql3 = "SELECT COUNT(*)AS count3 FROM dj_content WHERE co_user_id=?"
                db.query(sql3, user_id, (err, result3) => {
                    if (err) return res.ResData("获取发布帖子数量失败")
                    var statss = []
                    statss.push({
                            'id': user_id,
                            'user_fan': result1[0].count1,
                            'user_focus': result2[0].count2,
                            'user_content': result3[0].count3,
                        })
                        // console.log(statss);
                    res.ResData('获取粉丝关注帖子数量成功', 200, statss)
                })

            })
        })
    }
    //首页主帖列表————所有贴吧最新主贴
exports.getContentTime = (req, res) => {
        const page_size = req.query.pagesize; //每页显示条数
        var page_num = req.query.pagenum; //当前页码数
        var sql = "SELECT * FROM dj_content a LEFT JOIN dj_ba b ON a.co_ba_id=b.ba_id ORDER BY co_add_time DESC LIMIT ?,?"
        if (page_size == '' || page_num == '') {
            return res.ResData("参数错误")
        }
        var params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
        db.query(sql, params, (err, result) => {
            if (err) return res.ResData('查询失败', 1, err)
                // 计算总记录数 
            var sqlTotal = "SELECT COUNT(*) AS num FROM dj_content"
                // 处理数据库图片链接格式
            for (idx in result) {
                if (result[idx].co_img !== null) result[idx].co_img = result[idx].co_img.split(',')
            }
            // console.log(result);
            // 获取总主帖数和发送数据
            db.query(sqlTotal, (err, among) => {
                if (err) return res.ResData("获取帖子列表失败", err)
                var total = among[0]['num']; //总记录数
                if (page_num > Math.floor(total / page_size)) {
                    // return res.ResData('已经超过最大页')
                    page_num = Math.floor(total / page_size)
                }
                var getContents = []
                for (i in result) {
                    getContents.push({
                        'id': result[i].co_id,
                        'title': result[i].co_title,
                        'content': result[i].co_content,
                        'ba_id': result[i].co_ba_id,
                        'user_id': result[i].co_user_id,
                        'img': result[i].co_img == '' ? null : result[i].co_img,
                        'add_time': dayjs(result[i].co_add_time * 1000).format('YYYY-MM-DD HH:mm'),
                        'ba_name': result[i].ba_name,
                        'ba_img': result[i].ba_img
                    })
                }
                const data = {
                    "totalpage": total,
                    "pagenum": page_num,
                    "result": getContents,
                }
                res.ResData("获取首页帖子列表成功", 200, data)
            })

        })
    }
    //获取热门贴吧列表(根据关注数)
exports.getBasHot = (req, res) => {
        var sql = 'select * from dj_ba'
        db.query(sql, (err, result) => {
            if (err) return res.ResData('查询失败')
                //吧关注人数
            var bashot = []
            for (let i = 0; i < result.length; i++) {
                var sql2 = 'SELECT ms_ba_id,COUNT(*) AS num FROM ba_collect WHERE ms_ba_id=?'
                db.query(sql2, result[i].ba_id, (err, result2) => {
                    if (err) return res.ResData('获取热门贴吧出错')
                        // 去除RowDataPacket
                    result2 = JSON.parse(JSON.stringify(result2))
                    bashot.push({
                        'id': result[i].ba_id,
                        'num': result2[0].num
                    })
                    bashot.sort(function(x, y) {
                        return x.num > y.num ? -1 : 1;
                    })
                    if (bashot.length > 10) bashot = bashot.slice(0, 10)
                    if (i == result.length - 1) return res.ResData("获取热门贴吧成功", 200, bashot)
                })
            }
        })
    }
    //首页热门列表(七天内 按评论数排序 取十条)
exports.getContentHot = (req, res) => {
        var mg_time = (Date.parse(new Date()) / 1000)
        var mg_time_before = mg_time - 518400
        var sql = "SELECT * FROM dj_content WHERE ? <=co_add_time AND co_add_time <= ?"
        db.query(sql, [mg_time_before, mg_time], (err, result) => {
            if (err) return res.ResData('查询失败', err)
            if(result.length==0) return res.ResData("热门帖子为空", 204,[])
                // 从贴评论数
            var getContents = []
            for (let i = 0; i < result.length; i++) {
                var sql2 = "SELECT cs_father_id,COUNT(*) AS num  FROM content_s WHERE cs_father_id=?"
                db.query(sql2, result[i].co_id, (err, result2) => {
                    if (err) return res.ResData("获取评论数失败")
                        // 去除RowDataPacket
                    result2 = JSON.parse(JSON.stringify(result2))
                    getContents.push({
                        'id': result[i].co_id,
                        'title': result[i].co_title,
                        'ba_id': result[i].co_ba_id,
                        'user_id': result[i].co_user_id,
                        'comment_num': result2[0].num,
                        'add_time': result[i].co_add_time,
                    })
                    getContents.sort(function(x, y) {
                            return x.comment_num > y.comment_num ? -1 : 1;
                        })
                    if (getContents.length > 10) getContents = getContents.slice(0, 10)
                    if (i == result.length - 1) return res.ResData("获取首页热门帖子成功", 200, getContents)
                })
            }
        })
    }
    // 查询用户关注吧列表
exports.basCollect = (req, res) => {
        var id = req.params.id
        var sql = 'SELECT * FROM ba_collect a LEFT JOIN dj_ba b ON a.ms_ba_id= b.ba_id WHERE a.ms_user_id=?'
        db.query(sql, id, (err, result) => {
            if (err) return res.ResData('查询失败')
            const collects = []
            for (let i = 0; i < result.length; i++) {
                collects.push({
                    'id': result[i].ba_id,
                    'name': result[i].ba_name,
                    'img': result[i].ba_img,
                    'signature': result[i].ba_signature
                })
            }
            return res.ResData('查询成功', 200, collects)

        })
    }
    //搜索主贴--模糊搜索
exports.searchHomeContent = (req, res) => {
    var keyword = req.query.query; //查询的字符串
    var page_size = req.query.pagesize; //每页显示条数
    var page_num = req.query.pagenum; //当前页码数
    if (page_size == '' || page_num == '') {
        return res.ResData("参数错误")
    }
    if (keyword) keyword = keyword.trim()
    var sql = "SELECT * FROM dj_content a LEFT JOIN dj_ba b ON a.co_ba_id=b.ba_id"
    if (keyword) {
        sql += " WHERE co_title LIKE '%" + keyword + "%' OR co_content LIKE '%" + keyword + "%' LIMIT ?,?"
    } else {
        sql += " LIMIT ?,?"
    }
    var params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
    db.query(sql, params, (err, result) => {
        if (err) return res.ResData('查询失败', 1, err)
            // 处理数据库图片链接格式
        for (idx in result) {
            if (result[idx].co_img !== null) result[idx].co_img = result[idx].co_img.split(',')
        }
        // 计算总记录数 
        var sqlTotal = "SELECT COUNT(*) AS num FROM dj_content WHERE co_title LIKE '%" + keyword + "%' OR co_content LIKE '%" + keyword + "%'"
            // 发送数据
        db.query(sqlTotal, (err, among) => {
            if (err) return res.ResData("模糊搜索帖子失败", err)
            var total = among[0]['num']; //总记录数
            if (page_num > Math.floor(total / page_size)) {
                // return res.ResData('已经超过最大页')
                page_num = Math.floor(total / page_size)
            }
            var getContents = []
                // console.log(result);
            for (i in result) {
                getContents.push({
                    'id': result[i].co_id,
                    'title': result[i].co_title,
                    'content': result[i].co_content,
                    'user_id': result[i].co_user_id,
                    'add_time': dayjs(result[i].co_add_time * 1000).format('YYYY-MM-DD HH:mm'),
                    'img': result[i].co_img == '' ? null : result[i].co_img,
                    'ba_id': result[i].ba_id,
                    'ba_name': result[i].ba_name,
                    'ba_img': result[i].ba_img,
                })
            }
            const data = {
                "totalpage": total,
                "pagenum": page_num,
                "result": getContents,
            }
            res.ResData("模糊搜索帖子成功", 200, data)
        })

    })
}
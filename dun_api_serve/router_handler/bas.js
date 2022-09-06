// 吧的处理函数
const db = require('../db/index')
const dayjs = require('dayjs')
    // 获取吧列表--可当搜索吧
exports.getBas = (req, res) => {
        var keyword = req.query.query;
        var page_size = req.query.pagesize; //每页显示条数
        var page_num = req.query.pagenum; //当前页码数
        var sql = "SELECT * FROM dj_ba"
        if (keyword) keyword = keyword.trim()
        if (page_size == '' || page_num == '') {
            return res.ResData("参数错误")
        }
        if (keyword) {
            sql += " where ba_name like '%" + keyword + "%' limit ?,?"
        } else {
            sql += " limit ?,?"
        }
        var params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
        db.query(sql, params, (err, result) => {
            if (err) return res.ResData('查询失败', 1, err)
                // 计算总记录数 
            var sqlTotal = "SELECT COUNT(*) AS num FROM dj_ba"
            if (keyword) {
                sqlTotal += " where ba_name like '%" + keyword + "%'"
            }
            db.query(sqlTotal, (err, among) => {
                if (err) return res.ResData("获取吧列表失败", err)
                var total = among[0]['num']; //总记录数
                if (page_num > Math.floor(total / page_size)) {
                    // return res.ResData('已经超过最大页')
                    page_num = Math.floor(total / page_size)
                }
                var retUsers = []
                for (i in result) {
                    retUsers.push({
                        'id': result[i].ba_id,
                        'name': result[i].ba_name,
                        'img': result[i].ba_img,
                        'ba_user_id': result[i].ba_user_id,
                        'ba_signature': result[i].ba_signature,
                    })
                }
                const data = {
                    "totalpage": total,
                    "pagenum": page_num,
                    "result": retUsers,
                }
                res.ResData("获取贴吧列表成功", 200, data)
            })
        })
    }
    // 添加贴吧
exports.addBas = (req, res) => {
        var name = req.body.name
        var user_id = req.body.userid
        var add_time = (Date.parse(new Date()) / 1000)
        var sql = 'SELECT * FROM dj_ba WHERE ba_name=?'
        db.query(sql, name, (err, result) => {
            if (err) return res.ResData("查询失败！")
            if (result.length > 0) return res.ResData('贴吧名称已存在!', 201)
            var sql2 = "INSERT INTO dj_ba(ba_name,ba_user_id,ba_add_time) VALUES(?,?,?)"
            db.query(sql2, [name, user_id, add_time], (err, data) => {
                if (err) return res.ResData('添加贴吧出错');
                res.ResData('添加贴吧成功', 200)
            })
        })
    }
    // 删除贴吧
exports.delBas = (req, res) => {
        var id = req.body.id
        var sql = 'DELETE FROM dj_ba WHERE ba_id=?'
        db.query(sql, id, (err, result) => {
            if (err) return res.ResData("删除贴吧出错！")
            if (result.affectedRows < 1) return res.ResData("已经删除贴吧", 201)
            res.ResData('删除贴吧成功', 200)
        })
    }
    // 查询贴吧———查询单个贴吧
exports.search = (req, res) => {
        var id = req.params.id
        var sql = 'select * from dj_ba where ba_id=?'
        db.query(sql, id, (err, result) => {
            if (err) return res.ResData('查询失败')
                //吧关注人数
            var sql2 = 'SELECT COUNT(*) AS num2 FROM ba_collect WHERE ms_ba_id=?'
            db.query(sql2, id, (err, result2) => {
                if (err) return res.ResData('查询吧关注人数失败')
                    //吧主帖数
                var sql3 = 'SELECT COUNT(*) AS num3 FROM dj_content WHERE co_ba_id=?'
                db.query(sql3, id, (err, result3) => {
                    if (err) return res.ResData('查询吧主帖数失败')
                        //吧从帖数
                    var sql4 = 'SELECT COUNT(*) AS num4 FROM content_s WHERE cs_post_id=?'
                    db.query(sql4, id, (err, result4) => {
                        if (err) return res.ResData('查询吧从帖数失败')
                            //吧从帖评论数
                        var sql5 = 'SELECT COUNT(*) AS num5 FROM content_s_s WHERE ss_post_id=?'
                        db.query(sql5, id, (err, result5) => {
                            if (err) return res.ResData('查询吧从帖评论数失败')
                            if (result.length > 0) {
                                var team_ids = result[0].ba_team_ids
                                if (team_ids == '') {
                                    team_ids = null
                                } else {
                                    team_ids = team_ids.split(',').map(Number)
                                    if (team_ids[team_ids.length - 1] == 0) team_ids.pop()
                                }
                                res.ResData('贴吧查询成功', 200, {
                                    'id': result[0].ba_id,
                                    'name': result[0].ba_name,
                                    'img': result[0].ba_img,
                                    'add_time': dayjs(result[0].ba_add_time * 1000).format('YYYY-MM-DD'),
                                    'ba_user_id': result[0].ba_user_id,
                                    'ba_team_ids': team_ids,
                                    'ba_signature': result[0].ba_signature,
                                    'ba_hits': result2[0].num2,
                                    'ba_information': result3[0].num3 + result4[0].num4 + result5[0].num5,
                                    'ba_recommended': result[0].ba_recommended,
                                })
                            } else {
                                res.ResData('贴吧查询失败')
                            }
                        })
                    })
                })
            })
        })
    }
    // 获取关注吧的用户列表
exports.getBaUsers = (req, res) => {
        var id = req.params.id
            // console.log(id);
        var sql = 'SELECT * FROM ba_collect a LEFT JOIN dj_users b ON a.ms_user_id=b.id WHERE ms_ba_id=?'
        db.query(sql, id, (err, result) => {
            if (err) return res.ResData('查询失败')
            var getLetter = []
            for (i in result) {
                getLetter.push({
                    'ba_id': result[i].ms_ba_id,
                    'user_id': result[i].ms_user_id,
                    'user_name': result[i].uname,
                    'user_nickname': result[i].nickname,
                    'user_face': result[i].face
                })
            }
            res.ResData("获取关注吧的用户列表成功", 200, getLetter)
        })
    }
    //主帖列表——————查询(吧id) 没有就是全部
exports.getContent = (req, res) => {
        const keyword = req.query.query; //查询的是吧id所属
        const page_size = req.query.pagesize; //每页显示条数
        var page_num = req.query.pagenum; //当前页码数
        var sql = "SELECT * FROM dj_content a LEFT JOIN dj_users b ON a.co_user_id= b.id LEFT JOIN dj_ba c ON a.co_ba_id=c.ba_id"
        if (page_size == '' || page_num == '') {
            return res.ResData("参数错误")
        }
        if (keyword) {
            sql += " where co_ba_id=" + keyword + " ORDER BY co_add_time DESC limit ?,?"
        } else {
            sql += " ORDER BY co_add_time DESC limit ?,?"
        }
        var params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
        db.query(sql, params, (err, result) => {
            if (err) return res.ResData('查询失败', 1, err)
                // 计算总记录数 
            var sqlTotal = "SELECT COUNT(*) AS num FROM dj_content"
            if (keyword) {
                sqlTotal += " where co_ba_id=" + keyword + ""
            }
            // 处理数据库图片链接格式
            for (idx in result) {
                if (result[idx].co_img !== null) result[idx].co_img = result[idx].co_img.split(',')
            }
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
                    var team_ids = result[0].ba_team_ids
                    if (team_ids == '') {
                        team_ids = null
                    } else {
                        team_ids = team_ids.split(',').map(Number)
                        if (team_ids[team_ids.length - 1] == 0) team_ids.pop()
                    }
                    getContents.push({
                        'id': result[i].co_id,
                        'title': result[i].co_title,
                        'content': result[i].co_content,
                        'ba_id': result[i].co_ba_id,
                        'ba_user_id': result[i].ba_user_id,
                        'co_user_id': result[i].co_user_id,
                        'co_essence': result[i].co_essence,
                        'ba_team_ids': team_ids,
                        'img': result[i].co_img == '' ? null : result[i].co_img,
                        'add_time': dayjs(result[i].co_add_time * 1000).format('YYYY-MM-DD HH:mm'),
                        'user_name': result[i].uname,
                        'user_nickname': result[i].nickname,
                        'user_face': result[i].face,
                        'ba_name': result[i].ba_name,
                        'ba_img': result[i].ba_img

                    })
                }
                const data = {
                    "totalpage": total,
                    "pagenum": page_num,
                    "result": getContents,
                }
                res.ResData("获取吧帖子列表成功", 200, data)
            })

        })
    }
    // 删除主贴
exports.DelContent = (req, res) => {
        var contentid = req.params.id
        var sql = 'DELETE FROM dj_content WHERE co_id=?'
        db.query(sql, contentid, (err, result) => {
            if (err) return res.ResData(err)
            if (result.affectedRows < 1) return res.ResData('删除主贴失败')
            res.ResData('用户删除主贴成功', 200)
        })
    }
    // 获取主贴点赞数量 收藏数量 评论数量
exports.getContentStats = (req, res) => {
        const content_id = req.params.id
            //点赞数
        var sql = "SELECT COUNT(*) AS num FROM content_user_like WHERE like_aid=?"
        db.query(sql, content_id, (err, result1) => {
            if (err) return res.ResData("获取点赞数量失败")
                // 从贴评论数
            var sql2 = "SELECT COUNT(*) AS num2  FROM content_s WHERE cs_father_id=?"
            db.query(sql2, content_id, (err, result2) => {
                if (err) return res.ResData("获取评论数失败")
                    // 从贴评论的评论数
                var sql3 = "SELECT COUNT(*) AS num3 FROM content_s_s WHERE ss_main_id=?"
                db.query(sql3, content_id, (err, result3) => {
                    //收藏数
                    var sql4 = "SELECT COUNT(*) AS num4 FROM content_user WHERE cu_ba_content_id=?"
                    db.query(sql4, content_id, (err, result4) => {
                        if (err) return res.ResData("获取发布帖子数量失败")
                        var statss = []
                        statss.push({
                                'content_id': content_id,
                                'content_user_like': result1[0].num,
                                'content_s': result2[0].num2 + result3[0].num3,
                                'content_user': result4[0].num4,
                            })
                            // console.log(statss);
                        res.ResData('获取主贴点赞数量,收藏数量,评论数量成功', 200, statss)
                    })
                })
            })
        })
    }
    // 查询吧加精帖子列表
exports.searchEssence = (req, res) => {
        var id = req.params.id
        var sql = 'SELECT * FROM dj_content WHERE co_ba_id=? AND co_essence=1'
        db.query(sql, id, (err, result) => {
            if (err) return res.ResData('查询失败')
            if (result.affectedRows < 1) return res.ResData('贴吧加精帖子查询失败')
            const essence = []
            for (let i = 0; i < result.length; i++) {
                // console.log(result[1]);
                essence.push({
                    'id': result[i].co_id,
                    'ba_id': result[i].co_ba_id,
                    'title': result[i].co_title,
                    'content': result[i].co_content,
                })
            }
            res.ResData('贴吧加精帖子查询成功', 200, essence)
        })
    }
    // 用户点击关注对应吧
exports.addCollect = (req, res) => {
        var ba_id = req.body.baid
        var user_id = req.body.userid
        var sql = 'SELECT * FROM ba_collect WHERE ms_ba_id=? AND ms_user_id=?'
        db.query(sql, [ba_id, user_id], (err, resResult) => {
            // if (err) return res.ResData("查询失败！")
            if (resResult.length > 0) return res.ResData('已经关注成功！')
            var sql2 = 'INSERT INTO ba_collect(ms_ba_id,ms_user_id) VALUES(?,?)'
            db.query(sql2, [ba_id, user_id], (err, result) => {
                if (err) return res.ResData('添加失败')
                if (result.affectedRows < 1) return res.ResData('用户关注贴吧失败')
                res.ResData('用户关注贴吧成功', 200)

            })
        })
    }
    // 用户点击取消关注对应吧
exports.delCollect = (req, res) => {
        var ba_id = req.body.baid
        var user_id = req.body.userid
            // console.log(ba_id);
            // console.log(user_id);
        var sql = 'DELETE FROM ba_collect WHERE ms_ba_id=? AND ms_user_id=?'
        db.query(sql, [ba_id, user_id], (err, result) => {
            if (err) return res.ResData('删除失败')
            if (result.affectedRows != 1) return res.ResData("用户取消关注贴吧失败")
            res.ResData("用户取消关注贴吧成功", 200)
        })
    }
    // 查询单个主贴信息--(主贴id)
exports.searchContent = (req, res) => {
        if (req.params.id == 'comment') return
        var id = req.params.id
        var sql = 'SELECT * FROM dj_content a LEFT JOIN dj_ba b ON a.co_ba_id=b.ba_id LEFT JOIN dj_users c ON a.co_user_id=c.id WHERE co_id=?'
        db.query(sql, id, (err, result) => {
            if (err) return res.ResData('查询出错')
            if (result.length < 1) return res.ResData('主贴信息查询为空', 204)
                // 处理数据库图片链接格式
            for (idx in result) {
                if (result[idx].co_img !== null) result[idx].co_img = result[idx].co_img.split(',')
            }
            const content = []
            var team_ids = result[0].ba_team_ids
            if (team_ids == '') {
                team_ids = null
            } else {
                team_ids = team_ids.split(',').map(Number)
                if (team_ids[team_ids.length - 1] == 0) team_ids.pop()
            }
            content.push({
                'id': result[0].co_id,
                'title': result[0].co_title,
                'content': result[0].co_content,
                'user_id': result[0].co_user_id,
                'img': result[0].co_img == '' ? null : result[0].co_img,
                'add_time': dayjs(result[0].co_add_time * 1000).format('YYYY-MM-DD HH:mm'),
                'status': result[0].co_status,
                'is_top': result[0].co_is_top,
                'co_essence': result[0].co_essence,
                'user_name': result[0].uname,
                'user_nickname': result[0].nickname,
                'user_face': result[0].face,
                'ba_id': result[0].co_ba_id,
                'ba_user_id': result[0].ba_user_id,
                'ba_name': result[0].ba_name,
                'ba_img': result[0].ba_img,
                'ba_team_ids': team_ids,
            })
            res.ResData('主贴信息查询成功', 200, content)
        })
    }
    //从帖列表——————查询(主贴id) 没有就是全部
exports.getContentComment = (req, res) => {
        const keyword = req.query.query; //查询的是主贴id所属
        const page_size = req.query.pagesize; //每页显示条数
        var page_num = req.query.pagenum; //当前页码数
        var sort = req.query.sort //排序方式 空为正叙，值为desc为倒叙
        var sql = "SELECT * FROM content_s a LEFT JOIN dj_users b ON a.cs_user_id=b.id LEFT JOIN dj_ba c ON a.cs_post_id=c.ba_id LEFT JOIN dj_content d ON a.cs_father_id= d.co_id"
        if (page_size == '' || page_num == '') {
            return res.ResData("参数错误")
        }
        if (keyword) sql += " where cs_father_id=" + keyword
        if (sort == 'desc') sql += " ORDER BY cs_floor_num DESC"
        sql += " limit ?,?"
        var params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
        db.query(sql, params, (err, result) => {
            if (err) return res.ResData('查询失败', 1, err)
                // 计算总记录数 
            var sqlTotal = "SELECT COUNT(*) AS num FROM content_s"
            if (keyword) {
                sqlTotal += " where cs_father_id=" + keyword + ""
            }
            // 处理数据库图片链接格式
            for (idx in result) {
                if (result[idx].cs_img !== null) result[idx].cs_img = result[idx].cs_img.split(',')
            }
            // 获取总从贴数和发送数据
            db.query(sqlTotal, (err, among) => {
                if (err) return res.ResData("获取从帖列表失败", err)
                var total = among[0]['num']; //总记录数
                if (page_num > Math.floor(total / page_size)) {
                    // return res.ResData('已经超过最大页')
                    page_num = Math.floor(total / page_size)
                }
                var getContents = []
                for (i in result) {
                    var team_ids = result[i].ba_team_ids
                    if (team_ids == '') {
                        team_ids = null
                    } else {
                        team_ids = team_ids.split(',').map(Number)
                        if (team_ids[team_ids.length - 1] == 0) team_ids.pop()
                    }
                    getContents.push({
                        'id': result[i].cs_id,
                        'floor_num': result[i].cs_floor_num,
                        'content': result[i].cs_content,
                        'father_id': result[i].cs_father_id,
                        'user_id': result[i].cs_user_id,
                        'postid': result[i].cs_post_id,
                        'img': result[i].cs_img == '' ? null : result[i].cs_img,
                        'add_time': dayjs(result[i].cs_add_time * 1000).format('YYYY-MM-DD HH:mm'),
                        'status': result[i].cs_status,
                        'is_top': result[i].cs_is_top,
                        'user_name': result[i].uname,
                        'user_nickname': result[i].nickname,
                        'user_face': result[i].face,
                        'content_user_id': result[i].co_user_id,
                        'ba_user_id': result[i].ba_user_id,
                        'ba_team_ids': team_ids,
                    })
                }
                // console.log(getContents);
                const data = {
                    "totalpage": total,
                    "pagenum": page_num,
                    "result": getContents,
                }
                res.ResData("获取从贴列表成功", 200, data)
            })

        })
    }
    //获取楼主发言的从贴列表
exports.getLandlordContentComment = (req, res) => {
        const keyword = req.query.query; //查询的是主贴id所属
        const page_size = req.query.pagesize; //每页显示条数
        var page_num = req.query.pagenum; //当前页码数
        var sort = req.query.sort; //排序方式 空为正叙，值为desc为倒叙
        var user_id = req.query.userid; //查询指定用户的id
        var sql = "SELECT * FROM content_s a LEFT JOIN dj_users b ON a.cs_user_id=b.id LEFT JOIN dj_ba c ON a.cs_post_id=c.ba_id LEFT JOIN dj_content d ON a.cs_father_id= d.co_id"
        if (keyword == '' || page_size == '' || page_num == '' || user_id == '') {
            return res.ResData("参数错误")
        }
        if (keyword && user_id) sql += " where cs_father_id=" + keyword + " AND cs_user_id=" + user_id
        if (sort == 'desc') sql += " ORDER BY cs_floor_num DESC"
        sql += " limit ?,?"
        var params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
        db.query(sql, params, (err, result) => {
            if (err) return res.ResData('查询失败', 1, err)
                // 计算总记录数 
            var sqlTotal = "SELECT COUNT(*) AS num FROM content_s"
            if (keyword) {
                sqlTotal += " where cs_father_id=" + keyword + " AND cs_user_id=" + user_id
            }
            // 处理数据库图片链接格式
            for (idx in result) {
                if (result[idx].cs_img !== null) result[idx].cs_img = result[idx].cs_img.split(',')
            }
            // 获取总从贴数和发送数据
            db.query(sqlTotal, (err, among) => {
                if (err) return res.ResData("获取从帖列表失败", err)
                var total = among[0]['num']; //总记录数
                if (page_num > Math.floor(total / page_size)) {
                    // return res.ResData('已经超过最大页')
                    page_num = Math.floor(total / page_size)
                }
                var getContents = []
                for (i in result) {
                    var team_ids = result[i].ba_team_ids
                    if (team_ids == '') {
                        team_ids = null
                    } else {
                        team_ids = team_ids.split(',').map(Number)
                        if (team_ids[team_ids.length - 1] == 0) team_ids.pop()
                    }
                    getContents.push({
                        'id': result[i].cs_id,
                        'floor_num': result[i].cs_floor_num,
                        'content': result[i].cs_content,
                        'father_id': result[i].cs_father_id,
                        'user_id': result[i].cs_user_id,
                        'postid': result[i].cs_post_id,
                        'img': result[i].cs_img == '' ? null : result[i].cs_img,
                        'add_time': dayjs(result[i].cs_add_time * 1000).format('YYYY-MM-DD HH:mm'),
                        'status': result[i].cs_status,
                        'is_top': result[i].cs_is_top,
                        'user_name': result[i].uname,
                        'user_nickname': result[i].nickname,
                        'user_face': result[i].face,
                        'content_user_id': result[i].co_user_id,
                        'ba_user_id': result[i].ba_user_id,
                        'ba_team_ids': team_ids,
                    })
                }
                const data = {
                    "totalpage": total,
                    "pagenum": page_num,
                    "result": getContents,
                }
                res.ResData("获取主帖的楼主发言的从贴列表成功", 200, data)
            })

        })
    }
    // 获取从贴点赞数量 评论数量
exports.getContentCommentStats = (req, res) => {
        const comment_id = req.params.id
            //点赞数
        var sql = "SELECT COUNT(*) AS num FROM content_s_user_like WHERE like_s_aid=?"
        db.query(sql, comment_id, (err, result1) => {
            if (err) return res.ResData("获取点赞数量失败")
                // 从贴评论的评论数
            var sql2 = "SELECT COUNT(*) AS num2  FROM content_s_s WHERE ss_father_id=?"
            db.query(sql2, comment_id, (err, result2) => {
                if (err) return res.ResData("获取评论数失败")
                var statss = []
                statss.push({
                        'comment_id': comment_id,
                        'comment_s_user_like': result1[0].num,
                        'comment_s_s': result2[0].num2,
                    })
                    // console.log(statss);
                res.ResData('获取从贴点赞数量,评论数量成功', 200, statss)
            })


        })
    }
    // 删除主贴的从贴
exports.DelContentComment = (req, res) => {
        var contentid = req.params.id
        var sql = 'DELETE FROM content_s WHERE cs_id=?'
        db.query(sql, contentid, (err, result) => {
            if (err) return res.ResData(err)
            if (result.affectedRows < 1) return res.ResData('删除从贴失败')
            res.ResData('删除从贴成功', 200)
        })
    }
    // 加精主贴
exports.addEssenceComment = (req, res) => {
        var id = req.params.id
            // var contentid = req.body.contentid
        var sql = 'UPDATE dj_content SET co_essence=1 WHERE co_id=?'
        db.query(sql, id, (err, result) => {
            if (err) return res.ResData(err)
            if (result.affectedRows < 1) return res.ResData('加精主帖失败')
            res.ResData('加精主帖成功', 200)
        })
    }
    // 取消加精主贴
exports.delEssenceComment = (req, res) => {
        var id = req.params.id
            // var contentid = req.body.contentid
        var sql = 'UPDATE dj_content SET co_essence=0 WHERE co_id=?'
        db.query(sql, id, (err, result) => {
            if (err) return res.ResData(err)
            if (result.affectedRows < 1) return res.ResData('取消加精主帖失败')
            res.ResData('取消加精主帖成功', 200)
        })
    }
    //获取从贴的评论列表——————查询(从贴id) 没有就是全部
exports.getContentComments = (req, res) => {
        const keyword = req.query.query; //查询的是主贴id所属
        const page_size = req.query.pagesize; //每页显示条数
        var page_num = req.query.pagenum; //当前页码数
        var sql = "SELECT * FROM content_s_s a LEFT JOIN dj_users b ON a.ss_user_id= b.id LEFT JOIN dj_ba c ON a.ss_post_id= c.ba_id LEFT JOIN dj_content d ON a.ss_main_id= d.co_id"
        if (page_size == '' || page_num == '') {
            return res.ResData("参数错误")
        }
        if (keyword) {
            sql += " where a.ss_father_id=" + keyword + " limit ?,?"
        } else {
            sql += " limit ?,?"
        }
        // console.log(sql);
        var params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
            // console.log(params);
        db.query(sql, params, (err, result) => {
            if (err) return res.ResData('查询失败', 1, err)
                // 计算总记录数 
            var sqlTotal = "SELECT COUNT(*) AS num FROM content_s_s"
            if (keyword) {
                sqlTotal += " where ss_father_id=" + keyword + ""
            }
            // 获取总从贴数和发送数据
            db.query(sqlTotal, (err, among) => {
                if (err) return res.ResData("获取从帖评论列表失败", err)
                var total = among[0]['num']; //总记录数
                if (page_num > Math.floor(total / page_size)) {
                    // return res.ResData('已经超过最大页')
                    page_num = Math.floor(total / page_size)
                }
                var getContents = []
                for (i in result) {
                    var team_ids = result[i].ba_team_ids
                    if (team_ids == '') {
                        team_ids = null
                    } else {
                        team_ids = team_ids.split(',').map(Number)
                        if (team_ids[team_ids.length - 1] == 0) team_ids.pop()
                    }
                    getContents.push({
                        'id': result[i].ss_id,
                        'content': result[i].ss_content,
                        'father_id': result[i].ss_father_id,
                        'user_id': result[i].ss_user_id,
                        'main_id': result[i].ss_main_id,
                        'respond_id': result[i].ss_respond_id,
                        'add_time': dayjs(result[i].ss_add_time * 1000).format('YYYY-MM-DD HH:mm'),
                        'status': result[i].ss_status,
                        'baid': result[i].ss_post_id,
                        'ba_user_id': result[i].ba_user_id,
                        'ba_team_ids': team_ids,
                        'contnet_user_id': result[i].co_user_id,
                        'user_name': result[i].uname,
                        'user_nickname': result[i].nickname,
                        'user_face': result[i].face
                    })
                }
                // console.log(getContents);
                const data = {
                    "totalpage": total,
                    "pagenum": page_num,
                    "result": getContents,
                }
                res.ResData("获取从贴评论列表成功", 200, data)
            })

        })
    }
    // 删除从贴的评论
exports.DelContentComments = (req, res) => {
        var commentid = req.params.id
        var sql = 'DELETE FROM content_s_s WHERE ss_id=?'
        db.query(sql, commentid, (err, result) => {
            if (err) return res.ResData(err)
            if (result.affectedRows < 1) return res.ResData('删除从贴的评论失败')
            res.ResData('删除从贴的评论成功', 200)
        })
    }
    // 用户发表主贴
exports.addMainComment = (req, res) => {
        var title = req.body.title
        var content = req.body.content
        var baid = req.body.baid
        var userid = req.body.userid
        var img = req.body.img
        var add_time = (Date.parse(new Date()) / 1000)
            // 处理图片链接格式 数组转成字符串
        var imgs = ''
        if (img !== []) imgs = img.join(',')
        var sql = 'INSERT INTO dj_content(co_title,co_content,co_ba_id,co_user_id,co_img,co_add_time) VALUES(?,?,?,?,?,?)'
        db.query(sql, [title, content, baid, userid, imgs, add_time], (err, result) => {
            if (err) return res.ResData(err)
            if (result.affectedRows < 1) return res.ResData('用户发表主贴失败')
            res.ResData('用户发表主贴成功', 200)
        })
    }
    // 修改主贴
exports.submitMainComment = (req, res) => {
        var id = req.params.id
        var title = req.body.title
        var content = req.body.content
        var img = req.body.img
            // 处理图片链接格式 数组转成字符串
        var imgs = ''
        if (img !== []) imgs = img.join(',')
        var sql = 'UPDATE dj_content SET co_title=?,co_content=?,co_img=? WHERE co_id=?'
        db.query(sql, [title, content, imgs, id], (err, result) => {
            if (err) return res.ResData(err)
            if (result.affectedRows < 1) return res.ResData('修改主贴失败')
            res.ResData('修改主贴成功', 200)
        })
    }
    // 用户发表从贴
exports.addFollowComment = (req, res) => {
        var content = req.body.content
        var fatherid = req.body.fatherid
        var userid = req.body.userid
        var postid = req.body.postid
        var img = req.body.img
        var add_time = (Date.parse(new Date()) / 1000)
            // 处理图片链接格式 数组转成字符串
        var imgs = ''
        if (img !== []) imgs = img.join(',')
        var sql = 'SELECT * FROM dj_content WHERE co_id=?'
        db.query(sql, fatherid, (err, result) => {
            if (err) return res.ResData(err)
            var floor_num = Number(result[0].co_floor_sum) + 1
            var sql2 = 'UPDATE dj_content SET co_floor_sum=? WHERE co_id=?'
            db.query(sql2, [floor_num, fatherid], (err, result2) => {
                if (err) return res.ResData(err)
                var sql3 = 'INSERT INTO content_s(cs_content,cs_floor_num,cs_father_id,cs_user_id,cs_img,cs_post_id,cs_add_time) VALUES(?,?,?,?,?,?,?)'
                db.query(sql3, [content, floor_num, fatherid, userid, imgs, postid, add_time], (err, result3) => {
                    if (err) return res.ResData(err)
                    if (result3.affectedRows < 1) return res.ResData('用户发表从贴失败')
                    res.ResData('用户发表从贴成功', 200)
                })
            })
        })
    }
    // 用户评论从贴
exports.addComment = (req, res) => {
        var content = req.body.content
        var userid = req.body.userid
        var fatherid = req.body.fatherid
        var postid = req.body.postid
        var mainid = req.body.mainid
        var add_time = (Date.parse(new Date()) / 1000)
            // console.log(mainid);
            // console.log(req.body);
            // console.log(add_time);
        var sql = 'INSERT INTO content_s_s(ss_content,ss_user_id,ss_main_id,ss_father_id,ss_post_id,ss_add_time) VALUES(?,?,?,?,?,?)'
        db.query(sql, [content, userid, mainid, fatherid, postid, add_time], (err, result) => {
            if (err) return res.ResData(err)
            if (result.affectedRows < 1) return res.ResData('用户评论失败')
            res.ResData('用户评论从贴成功', 200)
        })
    }
    // 用户发表从贴评论的回复
exports.addCommentRespond = (req, res) => {
        var content = req.body.content
        var userid = req.body.userid
        var fatherid = req.body.fatherid
        var postid = req.body.postid
        var mainid = req.body.mainid
        var respond = req.body.respond
        var add_time = (Date.parse(new Date()) / 1000)
            // console.log(mainid);
            // console.log(req.body);
            // console.log(add_time);
        var sql = 'INSERT INTO content_s_s(ss_content,ss_user_id,ss_main_id,ss_father_id,ss_post_id,ss_respond_id,ss_add_time) VALUES(?,?,?,?,?,?,?)'
        db.query(sql, [content, userid, mainid, fatherid, postid, respond, add_time], (err, result) => {
            if (err) return res.ResData(err)
            if (result.affectedRows < 1) return res.ResData('用户回复评论失败')
            res.ResData('用户回复评论成功', 200)
        })
    }
    //查询用户是否收藏这个帖子
exports.seaContentComments = (req, res) => {
        var content_id = req.query.contentid
        var user_id = req.query.userid
        var sql = 'SELECT * FROM content_user WHERE cu_ba_content_id=? AND cu_user_id=?'
        db.query(sql, [content_id, user_id], (err, result) => {
            if (err) return res.ResData("查询用户是否收藏出错")
            if (result.length != 1) return res.ResData('不在用户收藏列表中')
            res.ResData('在收藏列表中', 200)
        })
    }
    // 用户收藏主贴
exports.addContentCollect = (req, res) => {
        var content_id = req.body.contentid
        var user_id = req.body.userid
        var sql = 'SELECT * FROM content_user WHERE cu_ba_content_id=? AND cu_user_id=?'
        db.query(sql, [content_id, user_id], (err, resResult) => {
            if (err) return res.ResData("查询失败！")
            if (resResult.length > 0) return res.ResData('已经收藏成功！')
            var sql2 = 'INSERT INTO content_user(cu_ba_content_id,cu_user_id) VALUES(?,?)'
            db.query(sql2, [content_id, user_id], (err, result) => {
                if (err) return res.ResData('收藏出错')
                if (result.affectedRows != 1) return res.ResData('用户已经成功收藏帖子')
                res.ResData('用户收藏帖子成功', 200)
            })
        })
    }
    // 用户取消收藏帖子
exports.delContentCollect = (req, res) => {
        var content_id = req.body.contentid
        var user_id = req.body.userid
        var sql = 'DELETE FROM content_user WHERE cu_ba_content_id=? AND cu_user_id=?'
        db.query(sql, [content_id, user_id], (err, result) => {
            if (err) return res.ResData('取消收藏帖子出错')
            if (result.affectedRows != 1) return res.ResData("用户已经成功取消收藏帖子")
            res.ResData("用户取消收藏帖子成功", 200)
        })
    }
    //查询用户是否点赞这个主帖
exports.seaContentLike = (req, res) => {
        var content_id = req.query.contentid
        var user_id = req.query.userid
        var sql = 'SELECT * FROM content_user_like WHERE like_aid=? AND like_user_id=?'
        db.query(sql, [content_id, user_id], (err, result) => {
            if (err) return res.ResData("查询用户是否点赞出错")
            if (result.length != 1) return res.ResData('用户没点赞')
            res.ResData('用户点赞', 200)
        })
    }
    // 用户点赞主贴
exports.addContentLike = (req, res) => {
        var content_id = req.body.contentid
        var user_id = req.body.userid
        var sql = 'SELECT * FROM content_user_like WHERE like_aid=? AND like_user_id=?'
        db.query(sql, [content_id, user_id], (err, resResult) => {
            if (err) return res.ResData("查询失败！")
            if (resResult.length > 0) return res.ResData('已经点赞成功！')
            var sql2 = 'INSERT INTO content_user_like(like_aid,like_user_id) VALUES(?,?)'
            db.query(sql2, [content_id, user_id], (err, result) => {
                if (err) return res.ResData('点赞出错')
                if (result.affectedRows != 1) return res.ResData('用户已经成功点赞帖子')
                res.ResData('用户点赞帖子成功', 200)
            })
        })
    }
    // 用户取消点赞主贴
exports.delContentLike = (req, res) => {
        var content_id = req.body.contentid
        var user_id = req.body.userid
        var sql = 'DELETE FROM content_user_like WHERE like_aid=? AND like_user_id=?'
        db.query(sql, [content_id, user_id], (err, result) => {
            if (err) return res.ResData('取消点赞帖子出错')
            if (result.affectedRows != 1) return res.ResData("用户已经成功取消点赞帖子")
            res.ResData("用户取消点赞帖子成功", 200)
        })
    }
    //查询用户是否点赞这个帖子
exports.seaContentCommentLike = (req, res) => {
        var comment_id = req.query.commentid
        var user_id = req.query.userid
        var sql = 'SELECT * FROM content_s_user_like WHERE like_s_aid=? AND like_s_user_id=?'
        db.query(sql, [comment_id, user_id], (err, result) => {
            if (err) return res.ResData("查询用户是否点赞出错")
            if (result.length != 1) return res.ResData('用户没点赞')
            res.ResData('用户点赞', 200)
        })
    }
    // 用户点赞主贴
exports.addContentCommentLike = (req, res) => {
        var comment_id = req.body.commentid
        var user_id = req.body.userid
        var sql = 'SELECT * FROM content_s_user_like WHERE like_s_aid=? AND like_s_user_id=?'
        db.query(sql, [comment_id, user_id], (err, resResult) => {
            if (err) return res.ResData("查询失败！")
            if (resResult.length > 0) return res.ResData('已经点赞成功！')
            var sql2 = 'INSERT INTO content_s_user_like(like_s_aid,like_s_user_id) VALUES(?,?)'
            db.query(sql2, [comment_id, user_id], (err, result) => {
                if (err) return res.ResData('点赞出错')
                if (result.affectedRows != 1) return res.ResData('用户已经成功点赞帖子')
                res.ResData('用户点赞帖子成功', 200)
            })
        })
    }
    // 用户取消点赞从贴
exports.delContentCommentLike = (req, res) => {
    var comment_id = req.body.commentid
    var user_id = req.body.userid
    var sql = 'DELETE FROM content_s_user_like WHERE like_s_aid=? AND like_s_user_id=?'
    db.query(sql, [comment_id, user_id], (err, result) => {
        if (err) return res.ResData('取消点赞帖子出错')
        if (result.affectedRows != 1) return res.ResData("用户已经成功取消点赞帖子")
        res.ResData("用户取消点赞帖子成功", 200)
    })
}
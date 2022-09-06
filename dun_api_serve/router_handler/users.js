const db = require("../db");
const dayjs = require('dayjs')
var bcrypt = require('bcryptjs');
// 添加用户
exports.addUsers = (req, res) => {
        var uname = req.body.username
        var upassword = bcrypt.hashSync(req.body.password);
        var add_time = (Date.parse(new Date()) / 1000)
            // 检查用户名是否存在
        var sql = 'SELECT * FROM dj_users WHERE uname=?'
        db.query(sql, uname, (err, result) => {
            if (err) return res.ResData("查询失败！")
            if (result.length > 0) return res.ResData('用户名已存在！', 201)
                // 添加数据
            var sql2 = "INSERT INTO dj_users(uname,upassword,add_time) VALUES(?,?,?)"
            db.query(sql2, [uname, upassword, add_time], (err, data) => {
                if (err) return res.ResData(err);
                // 返回结果
                db.query(sql, uname, (err, result) => {
                    if (err) return res.ResData("查询失败")
                        // console.log(result);
                    if (result.length > 0) {
                        res.ResData('添加用户成功', 200, {
                            "id": result[0].id,
                            "username": result[0].uname,
                            "nickname": result[0].nickname,
                            "email": result[0].u_email,
                            "face": result[0].face,
                            "sex": result[0].sex,
                            "signature": result[0].signature,
                            "add_time": result[0].add_time
                        })
                    }
                })
            })

        })
    }
    // 获取用户列表
exports.getUsers = (req, res) => {
        // 接收数据     get请求数据req.body,post请求req.query
        var keyword = req.query.query;
        var page_size = req.query.pagesize; //每页显示条数
        var page_num = req.query.pagenum; //当前页码数
        if (keyword) keyword = keyword.trim()
        if (page_size == '' || page_num == '') {
            res.ResData("参数错误")
        }
        var sql = "SELECT * FROM dj_users a LEFT JOIN dj_role b ON a.user_type= b.role_id"
        if (keyword) {
            sql += " WHERE a.uname LIKE '%" + keyword + "%' OR a.nickname LIKE '%" + keyword + "%' LIMIT ?,?"
        } else {
            sql += " limit ?,?"
        }
        var params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
            // console.log(params)
        db.query(sql, params, (err, result) => {
            if (err) return res.ResData('查询失败', 1, err)
                // res.ResData('获取用户列表成功', 200, result)
                // 计算总记录数 
            var sqlTotal = "select count(*) as num from dj_users "
            if (keyword) {
                sqlTotal += " where uname like '%" + keyword + "%' OR nickname LIKE '%" + keyword + "%'"
                    // console.log(sqlTotal);
            }
            db.query(sqlTotal, (err, among) => {
                if (err) return res.ResData("获取用户列表失败")
                var total = among[0]['num']; //总记录数
                // res.ResData('获取用户列表成功', 200, total)
                if (page_num > Math.floor(total / page_size)) {
                    // return res.ResData('已经超过最大页')
                    page_num = Math.floor(total / page_size)
                }
                var retUsers = []
                for (idx in result) {
                    var manager = result[idx];
                    var role_name = manager.role_name;
                    if (!manager.role_id) {
                        role_name = "超级管理员"
                    }
                    retUsers.push({
                        "id": manager.id,
                        "username": manager.uname,
                        "nickname": manager.nickname,
                        "email": manager.u_email,
                        "face": manager.face,
                        "sex": manager.sex,
                        "signature": manager.signature,
                        "add_time": dayjs(manager.add_time * 1000).format('YYYY-MM-DD'),
                        "is_black": manager.is_black,
                        "ustate": manager.ustate,
                        "role_name": role_name
                    })
                }
                const data = {
                    "totalpage": total,
                    "pagenum": page_num,
                    "result": retUsers,
                }
                res.ResData("获取用户列表成功", 200, data)
            })

        })

    }
    // 删除用户
exports.delUsers = (req, res) => {
        var id = req.body.id
        var sql = 'DELETE FROM dj_users WHERE id=?'
        db.query(sql, id, (err, result) => {
            if (err) return res.ResData("删除用户出错！")
            if (result.affectedRows < 1) return res.ResData("已经删除用户", 201)
            res.ResData('删除用户成功', 200)
        })
    }
    // 查询用户信息
exports.searchUser = (req, res) => {
        var id = req.params.id
            // console.log(id);
        var sql = 'select * from dj_users where id=?'
        db.query(sql, id, (err, result) => {
            if (err) return res.ResData('查询失败')
            if (result.length > 0) {
                var history_Records = result[0].history_Record
                if (history_Records == '') {
                    history_Records = null
                } else {
                    history_Records = history_Records.split(',').map(Number)
                    if (history_Records[history_Records.length - 1] == 0) history_Records.pop()
                }
                res.ResData('查询成功', 200, {
                    "id": result[0].id,
                    "username": result[0].uname,
                    "nickname": result[0].nickname,
                    "email": result[0].u_email,
                    "face": result[0].face,
                    "sex": result[0].sex,
                    "history_Record": history_Records,
                    "signature": result[0].signature == '' ? null : result[0].signature,
                    "add_time": dayjs(result[0].add_time * 1000).format('YYYY-MM-DD'),
                })
            } else {
                res.ResData('用户查询失败')
            }
        })
    }
    // 提交修改用户基本信息
exports.submit = (req, res) => {
        var id = req.params.id
        var nickname = req.body.nickname
        var u_email = req.body.email
        var sex = req.body.sex
        var signature = req.body.signature
        var sql = "update dj_users set nickname=?,u_email=?,sex=?,signature=? where id=?"
        db.query(sql, [nickname, u_email, sex, signature, id], (err, result) => {
            if (err) return res.ResData('更新用户信息出错')
            if (result.affectedRows < 1) return res.ResData('更新用户信息失败')
            var sql = "select * from dj_users where id=? "
            db.query(sql, id, (err, resResult) => {
                if (err) return res.ResData('查询更新后用户信息出错')
                res.ResData('更新用户信息成功', 200, {
                    "id": resResult[0].mg_id,
                    "nickname": resResult[0].nickname,
                    "sex": resResult[0].sex,
                    "email": resResult[0].u_email,
                    "signature": resResult[0].signature
                })
            })
        })
    }
    // 修改用户密码
exports.putpassword = (req, res) => {
        const userid = req.body.userid
        const oldpwd = req.body.oldpwd
        const newpwd = bcrypt.hashSync(req.body.newpwd)
        const sql = 'SELECT * FROM dj_users WHERE id=?'
        db.query(sql, userid, (err, result) => {
            if (err) return res.ResData(err.message);
            if (result.length !== 1) return res.ResData('用户id不存在', 206)
            if (result[0].is_black == 1) return res.ResData('用户被封禁中', 205)
                //判断用户输入密码是否正确
            const compareResult = bcrypt.compareSync(oldpwd, result[0].upassword)
            if (!compareResult) return res.ResData('原密码错误', 207)
            var sql2 = "UPDATE dj_users SET upassword=? WHERE id=?"
            db.query(sql2, [newpwd, userid], (err, result2) => {
                if (err) return res.ResData('更新用户密码出错')
                res.ResData('修改用户密码成功', 200)
            })
        })
    }
    // 修改用户头像
exports.submitUserImg = (req, res) => {
        // 1.接收数据
        // console.log(req.body);
        var id = req.params.id
        var img = req.body.tmp_path
            // 2.更新数据
        var sql = "update dj_users set face=? where id=?"
        db.query(sql, [img, id], (err, result) => {
            if (err) return res.ResData('更新用户头像出错')
            if (result.affectedRows < 1) return res.ResData('更新用户头像失败')
            var sql = "select * from dj_users where id=? "
            db.query(sql, id, (err, resResult) => {
                // console.log(resResult[0]);
                res.ResData('更新用户信息成功', 200, {
                    "id": resResult[0].id,
                    "nickname": resResult[0].nickname,
                    "username": resResult[0].uname,
                    "face": resResult[0].face,
                    "sex": resResult[0].sex,
                    "email": resResult[0].u_email,
                    "signature": resResult[0].signature
                })
            })
        })
    }
    // 修改用户封禁状态
exports.submitUserBlack = (req, res) => {
        var id = req.params.id
        var black = req.body.black
        var sql = "UPDATE dj_users SET is_black=? WHERE id=?"
        db.query(sql, [black, id], (err, result) => {
            if (err) return res.ResData('修改用户封禁状态出错')
            if (result.affectedRows < 1) return res.ResData('修改用户封禁状态失败')
            res.ResData('修改用户封禁状态成功', 200)
        })
    }
    //用户帖子动态
exports.userContent = (req, res) => {
        const keyword = req.query.query; //查询的用户id
        const page_size = req.query.pagesize; //每页显示条数
        var page_num = req.query.pagenum; //当前页码数
        var sql = "SELECT * FROM dj_content a LEFT JOIN dj_users b ON a.co_user_id=b.id"
        if (page_size == '' || page_num == '') {
            return res.ResData("参数错误")
        }
        if (keyword) {
            sql += " where co_user_id=" + keyword + " limit ?,?"
        } else {
            sql += " limit ?,?"
        }
        // console.log(sql);
        var params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
        db.query(sql, params, (err, result) => {
            if (err) return res.ResData('查询失败', 1, err)
                // 计算总记录数 
            var sqlTotal = "SELECT COUNT(*) AS num FROM dj_content"
            if (keyword) {
                sqlTotal += " where co_user_id=" + keyword + ""
            }
            // 处理数据库图片链接格式
            for (idx in result) {
                if (result[idx].co_img !== null) result[idx].co_img = result[idx].co_img.split(',')
            }
            // console.log(result);
            // 获取总主帖数和发送数据
            db.query(sqlTotal, (err, among) => {
                if (err) return res.ResData("获取用户帖子列表失败", err)
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
                        'co_user_id': result[i].co_user_id,
                        'img': result[i].co_img == '' ? null : result[i].co_img,
                        'add_time': dayjs(result[i].co_add_time * 1000).format('YYYY-MM-DD HH:mm'),
                        'user_name': result[i].uname,
                        'user_nickname': result[i].nickname,
                        'user_face': result[i].face
                    })
                }
                const data = {
                    "totalpage": total,
                    "pagenum": page_num,
                    "result": getContents,
                }
                res.ResData("获取用户帖子列表成功", 200, data)
            })

        })
    }
    // 获取用户粉丝列表--用户id下的全部粉丝
exports.userFan = (req, res) => {
        const keyword = req.query.query;
        const page_size = req.query.pagesize; //每页显示条数
        var page_num = req.query.pagenum; //当前页码数
        // console.log(keyword);
        if (page_size == '' || page_num == '') {
            res.ResData("参数错误")
        }
        var sql = "SELECT * FROM user_fan a LEFT JOIN dj_users b ON a.fa_ruser_id= b.id"
        if (keyword) {
            sql += " where a.fa_user_id=" + keyword + " limit ?,?"
                // console.log(sql);
        } else {
            sql += " limit ?,?"
        }
        var params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
            // console.log(sql)
        db.query(sql, params, (err, result) => {
            if (err) return res.ResData('查询失败', 1, err)
                // res.ResData('获取用户列表成功', 200, result)
                // 计算总记录数 
            var sqlTotal = "SELECT COUNT(*) AS num FROM user_fan a LEFT JOIN dj_users b ON a.fa_ruser_id= b.id"
            if (keyword) {
                sqlTotal += " where a.fa_user_id=" + keyword + ""
                    // console.log(sqlTotal);
            }
            db.query(sqlTotal, (err, among) => {
                if (err) return res.ResData("获取用户粉丝列表失败")
                var total = among[0]['num']; //总记录数
                // res.ResData('获取用户列表成功', 200, total)
                if (page_num > Math.floor(total / page_size)) {
                    // return res.ResData('已经超过最大页')
                    page_num = Math.floor(total / page_size)
                }
                var retUsers = []
                    // console.log(result);
                for (idx in result) {
                    retUsers.push({
                        "id": result[idx].id,
                        "username": result[idx].uname,
                        "nickname": result[idx].nickname,
                        "face": result[idx].face,
                        "sex": result[idx].sex,
                        "signature": result[idx].signature,
                    })
                }
                const data = {
                    "totalpage": total,
                    "pagenum": page_num,
                    "result": retUsers,
                }
                res.ResData("获取用户粉丝列表成功", 200, data)
            })
        })
    }
    // 获取用户关注用户列表--用户id下的全部关注用户
exports.userFocusOn = (req, res) => {
        const keyword = req.query.query;
        const page_size = req.query.pagesize; //每页显示条数
        var page_num = req.query.pagenum; //当前页码数
        if (page_size == '' || page_num == '') {
            res.ResData("参数错误")
        }
        var sql = "SELECT * FROM user_fan a LEFT JOIN dj_users b ON a.fa_user_id= b.id"
        if (keyword) {
            sql += " where a.fa_ruser_id=" + keyword + " limit ?,?"
                // console.log(sql);
        } else {
            sql += " limit ?,?"
        }
        var params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
            // console.log(sql)
        db.query(sql, params, (err, result) => {
            if (err) return res.ResData('查询失败', 1, err)
                // res.ResData('获取用户列表成功', 200, result)
                // 计算总记录数 
            var sqlTotal = "SELECT COUNT(*) AS num FROM user_fan a LEFT JOIN dj_users b ON a.fa_user_id= b.id"
            if (keyword) {
                sqlTotal += " where a.fa_ruser_id=" + keyword + ""
                    // console.log(sqlTotal);
            }
            db.query(sqlTotal, (err, among) => {
                if (err) return res.ResData("获取用户关注列表失败")
                var total = among[0]['num']; //总记录数
                // res.ResData('获取用户列表成功', 200, total)
                if (page_num > Math.floor(total / page_size)) {
                    // return res.ResData('已经超过最大页')
                    page_num = Math.floor(total / page_size)
                }
                var retUsers = []
                    // console.log(result);
                for (idx in result) {
                    retUsers.push({
                        "id": result[idx].id,
                        "username": result[idx].uname,
                        "nickname": result[idx].nickname,
                        "face": result[idx].face,
                        "sex": result[idx].sex,
                        "signature": result[idx].signature,
                    })
                }
                const data = {
                    "totalpage": total,
                    "pagenum": page_num,
                    "result": retUsers,
                }
                res.ResData("获取用户关注列表成功", 200, data)
            })
        })
    }
    // 查询用户收藏列表
exports.userCollect = (req, res) => {
        const keyword = req.query.query;
        const page_size = req.query.pagesize; //每页显示条数
        var page_num = req.query.pagenum; //当前页码数
        if (page_size == '' || page_num == '') {
            res.ResData("参数错误")
        }
        var sql = "SELECT * FROM content_user a LEFT JOIN dj_content b ON a.cu_ba_content_id=b.co_id LEFT JOIN dj_users c ON b.co_user_id=c.id"
        if (keyword) {
            sql += " WHERE cu_user_id=" + keyword + " limit ?,?"
        } else {
            sql += " limit ?,?"
        }
        var params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
            // console.log(sql)
        db.query(sql, params, (err, result) => {
            if (err) return res.ResData('查询失败', 1, err)
                // res.ResData('获取用户列表成功', 200, result)
                // 计算总记录数 
            var sqlTotal = "SELECT COUNT(*) AS num FROM content_user"
            if (keyword) {
                sqlTotal += " where cu_user_id=" + keyword + ""
            }
            db.query(sqlTotal, (err, among) => {
                if (err) return res.ResData("获取用户收藏列表失败")
                var total = among[0]['num']; //总记录数
                if (page_num > Math.floor(total / page_size)) {
                    // return res.ResData('已经超过最大页')
                    page_num = Math.floor(total / page_size)
                }
                // 处理数据库图片链接格式
                for (idx in result) {
                    if (result[idx].co_img !== null) result[idx].co_img = result[idx].co_img.split(',')
                }
                var retUsers = []
                for (i in result) {
                    retUsers.push({
                        'cuid': result[i].cu_id,
                        'id': result[i].cu_ba_content_id,
                        'ba_id': result[i].co_ba_id,
                        'title': result[i].co_title,
                        'content': result[i].co_content,
                        'img': result[i].co_img == '' ? null : result[i].co_img,
                        'add_time': dayjs(result[i].co_add_time * 1000).format('YYYY-MM-DD HH:mm'),
                        'co_user_id': result[i].id,
                        'user_name': result[i].uname,
                        'user_nickname': result[i].nickname,
                        'user_face': result[i].face,
                    })
                }
                const data = {
                    "totalpage": total,
                    "pagenum": page_num,
                    "result": retUsers,
                }
                res.ResData("用户收藏列表成功", 200, data)
            })
        })
    }
    //查询是否关注这个用户
exports.seaLike = (req, res) => {
        var member_id = req.query.memberid
        var user_id = req.query.userid
            // console.log(req.query);
        var sql = 'SELECT * FROM user_fan WHERE fa_user_id=? AND fa_ruser_id=?'
        db.query(sql, [member_id, user_id], (err, result) => {
            if (err) return res.ResData("查询是否关注这个用户出错")
            if (result.length != 1) return res.ResData('没有关注这个用户')
            res.ResData('关注这个用户', 200)
        })
    }
    // 关注这个用户
exports.addLike = (req, res) => {
        var member_id = req.body.memberid
        var user_id = req.body.userid
            // console.log(req.body);
        var sql = 'SELECT * FROM user_fan WHERE fa_user_id=? AND fa_ruser_id=?'
        db.query(sql, [member_id, user_id], (err, resResult) => {
            if (err) return res.ResData("查询失败！")
            if (resResult.length > 0) return res.ResData('已经关注这个用户！')
            var sql2 = 'INSERT INTO user_fan(fa_user_id,fa_ruser_id) VALUES(?,?)'
            db.query(sql2, [member_id, user_id], (err, result) => {
                if (err) return res.ResData('关注用户出错')
                if (result.affectedRows != 1) return res.ResData('用户已经关注这个用户')
                res.ResData('关注用户成功', 200)
            })
        })
    }
    // 取消关注这个用户
exports.delLike = (req, res) => {
        var member_id = req.body.memberid
        var user_id = req.body.userid
        var sql = 'DELETE FROM user_fan WHERE fa_user_id=? AND fa_ruser_id=?'
        db.query(sql, [member_id, user_id], (err, result) => {
            if (err) return res.ResData('取消关注用户出错')
            if (result.affectedRows != 1) return res.ResData("用户已经成功取消关注这个用户")
            res.ResData("用户取消关注这个用户成功", 200)
        })
    }
    // 用户发送申请小吧主
exports.applicationTeam = (req, res) => {
        var user_id = req.body.user_id
        var takeover_id = req.body.takeover_id
        var post_id = req.body.post_id
        var content = req.body.content
        var add_time = (Date.parse(new Date()) / 1000)
        var sql = 'SELECT * FROM dj_ba WHERE ba_id=?'
        db.query(sql, post_id, (err, resResult) => {
            if (err) return res.ResData("查询失败！")
                // console.log(resResult[0].ba_team_ids.split(','));
                // console.log(resResult[0].ba_team_ids.split(',').map(Number).includes(user_id));
            if (resResult[0].ba_team_ids.split(',').map(Number).includes(user_id) || resResult[0].ba_user_id == user_id) return res.ResData("你已经是该吧吧务", 202)
            var sql = 'SELECT * FROM ba_admin_application WHERE aa_user_id=? AND aa_takeover_id=? AND aa_post_id=? AND aa_status=0'
            db.query(sql, [user_id, takeover_id, post_id], (err, resResult2) => {
                if (err) return res.ResData("查询是否重复发送失败！")
                if (resResult2.length > 0) return res.ResData("用户已经发送申请吧务", 201)
                var sql2 = 'INSERT INTO ba_admin_application(aa_user_id,aa_takeover_id,aa_post_id,aa_content,aa_add_time) VALUES(?,?,?,?,?)'
                db.query(sql2, [user_id, takeover_id, post_id, content, add_time], (err, resResult3) => {
                    if (err) return res.ResData('发送申请吧务出错')
                    res.ResData('发送申请吧务成功', 200)
                })
            })
        })
    }
    //用户申请小吧主的列表
exports.getUserTeam = (req, res) => {
        var user_id = req.params.id
        var sql = 'SELECT * FROM ba_admin_application a LEFT JOIN dj_users b ON a.aa_user_id=b.id LEFT JOIN dj_ba c ON a.aa_post_id=c.ba_id WHERE aa_user_id=? ORDER BY aa_status, aa_add_time DESC'
        db.query(sql, user_id, (err, result) => {
            if (err) return res.ResData("用户申请小吧主的全部列表出错")
            if (result.length <= 0) return res.ResData('用户申请小吧主的全部列表为空', 204)
            var getLetter = []
            for (i in result) {
                getLetter.push({
                    'id': result[i].aa_id,
                    'user_id': result[i].aa_user_id,
                    'takeover_id': result[i].aa_takeover_id,
                    'post_id': result[i].aa_post_id,
                    'content': result[i].aa_content,
                    'add_time': dayjs(result[i].aa_add_time * 1000).format('YYYY-MM-DD'),
                    'status': result[i].aa_status,
                    'result': result[i].aa_result,
                    'ba_name': result[i].ba_name,
                    'user_name': result[i].uname,
                    'user_nickname': result[i].nickname,
                    'user_face': result[i].face,

                })
            }
            res.ResData("用户申请小吧主的全部列表获取成功", 200, getLetter)
        })
    }
    // 用户撤销申请小吧主
exports.delTeam = (req, res) => {
        var id = req.body.id
        var user_id = req.body.userid
        var sql = 'DELETE FROM ba_admin_application WHERE aa_id=? AND aa_user_id=?'
        db.query(sql, [id, user_id], (err, result) => {
            if (err) return res.ResData('撤销申请小吧主出错')
            if (result.affectedRows != 1) return res.ResData("已经成功撤销申请小吧主", 201)
            res.ResData("撤销申请小吧主成功", 200)
        })
    }
    //吧主接收的申请
exports.getBaTeam = (req, res) => {
        var takeover_id = req.params.id
            // console.log(req.params);
        var sql = 'SELECT * FROM ba_admin_application a LEFT JOIN dj_users b ON a.aa_user_id=b.id LEFT JOIN dj_ba c ON a.aa_post_id=c.ba_id WHERE aa_takeover_id=? ORDER BY aa_status, aa_add_time DESC'
        db.query(sql, takeover_id, (err, result) => {
            if (err) return res.ResData("查询吧务的申请出错")
            if (result.length <= 0) return res.ResData('没有申请', 204)
            var getLetter = []
            for (i in result) {
                getLetter.push({
                    'id': result[i].aa_id,
                    'user_id': result[i].aa_user_id,
                    'takeover_id': result[i].aa_takeover_id,
                    'post_id': result[i].aa_post_id,
                    'content': result[i].aa_content,
                    'add_time': dayjs(result[i].aa_add_time * 1000).format('YYYY-MM-DD'),
                    'status': result[i].aa_status,
                    'result': result[i].aa_result,
                    'ba_name': result[i].ba_name,
                    'user_name': result[i].uname,
                    'user_nickname': result[i].nickname,
                    'user_face': result[i].face,

                })
            }
            res.ResData("查询吧务的申请成功", 200, getLetter)
        })
    }
    // 吧主处理接收的申请(修改申请状态+处理结果)
exports.submitBaTeam = (req, res) => {
        var id = req.body.id
        var result = req.body.result
            // console.log(req.body);
        var sql = "UPDATE ba_admin_application SET aa_status=1,aa_result=? WHERE aa_id=?"
        db.query(sql, [result, id], (err, result) => {
            if (err) return res.ResData('处理申请出错')
            if (result.affectedRows < 1) return res.ResData('处理申请失败')
            res.ResData('处理申请成功', 200)
        })
    }
    // 吧主添加小吧主
exports.addBaTeam = (req, res) => {
        var post_id = req.body.postid
        var takeover_id = req.body.takeoverid
        var sql = 'SELECT * FROM dj_ba WHERE ba_id=?'
        db.query(sql, post_id, (err, resResult) => {
            if (err) return res.ResData("查询失败！")
            if (resResult[0].ba_team_ids.split(',').includes(takeover_id.toString()) || resResult[0].ba_user_id == takeover_id) return res.ResData("此人已经是该吧吧务", 201)
            var team = []
            if (resResult[0].ba_team_ids.length !== 0) {
                team = resResult[0].ba_team_ids.split(',')
                team.push(takeover_id)
                team = team.join(',')
            } else {
                team = takeover_id + ','
            }
            var sql = 'UPDATE dj_ba SET ba_team_ids=? WHERE ba_id=?'
            db.query(sql, [team, post_id], (err, resResult2) => {
                if (err) return res.ResData("添加吧务出错！")
                if (resResult2.affectedRows < 1) return res.ResData("添加吧务出错")
                res.ResData('添加吧务成功', 200)
            })
        })
    }
    // 吧主删除小吧主
exports.delBaTeam = (req, res) => {
        var post_id = req.body.postid
        var takeover_id = req.body.takeoverid
        var sql = 'SELECT * FROM dj_ba WHERE ba_id=?'
        db.query(sql, post_id, (err, resResult) => {
            if (err) return res.ResData("查询失败！")
            if (!resResult[0].ba_team_ids.split(',').includes(takeover_id.toString())) return res.ResData("此人已经不是该吧吧务", 201)
            var team = []
            if (resResult[0].ba_team_ids.length !== 0) {
                team = resResult[0].ba_team_ids.split(',')
                    // team.push(takeover_id)
                for (let a = 0; a < team.length; a++) {
                    if (team[a] == takeover_id) team.splice(a, 1);
                }
                team = team.join(',')
            }
            var sql = 'UPDATE dj_ba SET ba_team_ids=? WHERE ba_id=?'
            db.query(sql, [team, post_id], (err, resResult2) => {
                if (err) return res.ResData("删除吧务出错！")
                if (resResult2.affectedRows < 1) return res.ResData("已经删除吧务")
                res.ResData('删除吧务成功', 200)
            })
        })
    }
    // 查询用户是吧主的贴吧列表
exports.getUserBaAdmin = (req, res) => {
        var id = req.params.id
            // console.log(id);
        var sql = 'SELECT * FROM dj_ba WHERE ba_user_id=?'
        db.query(sql, id, (err, result) => {
            if (err) return res.ResData('查询失败')
            var getLetter = []
            for (i in result) {
                getLetter.push({
                    'id': result[i].ba_id,
                    'name': result[i].ba_name,
                    'ba_user_id': result[i].ba_user_id,
                    'ba_team_ids': result[i].ba_team_ids == '' ? null : result[i].ba_team_ids.split(',').map(Number),
                })
            }
            res.ResData("获取用户是吧主的贴吧列表成功", 200, getLetter)
        })
    }
    // 查询用户是小吧主的贴吧列表
exports.getUserBaTeam = (req, res) => {
        var id = req.params.id
        var sql = "SELECT * FROM dj_ba WHERE ba_team_ids LIKE '%" + id + ",%' OR ba_team_ids LIKE '%," + id + "%'"
        db.query(sql, (err, result) => {
            if (err) return res.ResData('查询用户是小吧主的贴吧列表出错')
            if (result.length <= 0) return res.ResData("用户是小吧主的贴吧列表为空", 204)
            var getLetter = []
            for (i in result) {
                getLetter.push({
                    'id': result[i].ba_id,
                    'name': result[i].ba_name,
                    'ba_user_id': result[i].ba_user_id,
                    'ba_team_ids': result[i].ba_team_ids == '' ? null : result[i].ba_team_ids.split(',').map(Number),
                })
            }
            res.ResData("获取查询用户是小吧主的贴吧列表成功", 200, getLetter)
        })
    }
    // 用户申请创建贴吧
exports.createBa = (req, res) => {
        var user_id = req.body.user_id
        var ba_name = req.body.ba_name
        var content = req.body.content
        var add_time = (Date.parse(new Date()) / 1000)
        var sql = 'SELECT * FROM dj_ba WHERE ba_name=?'
        db.query(sql, ba_name, (err, resResult) => {
            if (err) return res.ResData("查询失败！")
            if (resResult.length > 0) return res.ResData("该吧已创建", 202)
            var sql = 'SELECT * FROM ba_application WHERE bn_user_id=? AND bn_ba_name=? AND bn_status=0'
            db.query(sql, [user_id, ba_name], (err, resResult2) => {
                if (err) return res.ResData("查询是否重复发送失败！")
                if (resResult2.length > 0) return res.ResData("用户已经发送申请创建贴吧", 201)
                var sql2 = 'INSERT INTO ba_application(bn_user_id,bn_ba_name,bn_content,bn_add_time) VALUES(?,?,?,?)'
                db.query(sql2, [user_id, ba_name, content, add_time], (err, resResult3) => {
                    if (err) return res.ResData('发送申请创建贴吧出错')
                    res.ResData('发送申请创建贴吧成功', 200)
                })
            })
        })
    }
    // 处理申请创建贴吧申请(修改申请状态+处理结果)
exports.submitBaCreate = (req, res) => {
        var id = req.body.id
        var result = req.body.result
            // console.log(req.body);
        var sql = "UPDATE ba_application SET bn_status=1,bn_result=? WHERE bn_id=?"
        db.query(sql, [result, id], (err, result) => {
            if (err) return res.ResData('处理创建贴吧申请出错')
            if (result.affectedRows < 1) return res.ResData('处理创建贴吧申请失败')
            res.ResData('处理创建贴吧申请成功', 200)
        })
    }
    //查看指定用户申请创建贴吧的列表(和下面全部列表重复，删除需要前端接口,代码更换)
exports.getBaUserTeam = (req, res) => {
        var user_id = req.params.id
        var sql = 'SELECT * FROM ba_application a LEFT JOIN dj_users b ON a.bn_user_id=b.id WHERE bn_user_id=? ORDER BY bn_status, bn_add_time DESC'
        db.query(sql, user_id, (err, result) => {
            if (err) return res.ResData("用户申请创建贴吧的全部列表出错")
            if (result.length <= 0) return res.ResData('用户申请创建贴吧的全部列表为空', 204)
            var getLetter = []
            for (i in result) {
                getLetter.push({
                    'id': result[i].bn_id,
                    'user_id': result[i].bn_user_id,
                    'takeover_id': result[i].bn_takeover_id,
                    'ba_name': result[i].bn_ba_name,
                    'content': result[i].bn_content,
                    'add_time': dayjs(result[i].bn_add_time * 1000).format('YYYY-MM-DD'),
                    'status': result[i].bn_status,
                    'result': result[i].bn_result,
                    'user_name': result[i].uname,
                    'user_nickname': result[i].nickname,
                    'user_face': result[i].face,
                })
            }
            res.ResData("用户申请创建贴吧的全部列表获取成功", 200, getLetter)
        })
    }
    // 用户申请创建贴吧的全部列表
exports.getBaApplication = (req, res) => {
        const keyword = req.query.query;
        const page_size = req.query.pagesize; //每页显示条数
        var page_num = req.query.pagenum; //当前页码数
        if (page_size == '' || page_num == '') {
            res.ResData("参数错误")
        }
        var sql = "SELECT * FROM ba_application a LEFT JOIN dj_users b ON a.bn_user_id=b.id"
        if (keyword) {
            sql += " WHERE bn_user_id=" + keyword + " ORDER BY bn_status, bn_add_time DESC limit ?,?"
        } else {
            sql += " ORDER BY bn_status, bn_add_time DESC limit ?,?"
        }
        var params = [(parseInt(page_num) - 1) * parseInt(page_size), parseInt(page_size)]
            // console.log(sql)
        db.query(sql, params, (err, result) => {
            if (err) return res.ResData('查询失败', 1, err)
            var sqlTotal = "SELECT COUNT(*) AS num FROM ba_application"
            if (keyword) {
                sqlTotal += " where bn_user_id=" + keyword + ""
            }
            db.query(sqlTotal, (err, among) => {
                if (err) return res.ResData("用户申请创建贴吧的全部列表失败")
                var total = among[0]['num']; //总记录数
                if (page_num > Math.floor(total / page_size)) {
                    // return res.ResData('已经超过最大页')
                    page_num = Math.floor(total / page_size)
                }
                var retUsers = []
                for (i in result) {
                    retUsers.push({
                        'id': result[i].bn_id,
                        'user_id': result[i].bn_user_id,
                        'takeover_id': result[i].bn_takeover_id,
                        'ba_name': result[i].bn_ba_name,
                        'content': result[i].bn_content,
                        'add_time': dayjs(result[i].bn_add_time * 1000).format('YYYY-MM-DD'),
                        'status': result[i].bn_status,
                        'result': result[i].bn_result,
                        "user_username": result[i].uname,
                        "user_nickname": result[i].nickname,
                        "user_email": result[i].u_email,
                        "user_face": result[i].face,
                        "user_sex": result[i].sex,
                        "user_signature": result[i].signature,
                        "user_add_time": dayjs(result[i].add_time * 1000).format('YYYY-MM-DD'),
                        "user_is_black": result[i].is_black,
                        "user_ustate": result[i].ustate,
                    })
                }
                const data = {
                    "totalpage": total,
                    "pagenum": page_num,
                    "result": retUsers,
                }
                res.ResData("用户申请创建贴吧的全部列表成功", 200, data)
            })
        })
    }
    // 用户撤销申请创建贴吧
exports.delBa = (req, res) => {
        var id = req.body.id
        var user_id = req.body.userid
        var sql = 'DELETE FROM ba_application WHERE bn_id=? AND bn_user_id=?'
        db.query(sql, [id, user_id], (err, result) => {
            if (err) return res.ResData('撤销申请创建贴吧出错')
            if (result.affectedRows != 1) return res.ResData("已经成功撤销申请创建贴吧", 201)
            res.ResData("撤销申请创建贴吧成功", 200)
        })
    }
    // 修改吧基本信息
exports.submitba = (req, res) => {
        var id = req.params.id
        var name = req.body.name
        var signature = req.body.signature
        var img = req.body.img
        var sql = "UPDATE dj_ba SET ba_name=?,ba_signature=?,ba_img=? WHERE ba_id=?"
        db.query(sql, [name, signature, img, id], (err, result) => {
            if (err) return res.ResData('更新吧信息出错')
            if (result.affectedRows < 1) return res.ResData('更新吧信息失败')
            res.ResData('更新吧信息成功', 200)
        })
    }
    // 用户添加历史记录
exports.addHistoryRecord = (req, res) => {
    var user_id = req.body.userid
    var content_id = req.body.contentid
    var sql = 'SELECT * FROM dj_users WHERE id=?'
    db.query(sql, user_id, (err, resResult) => {
        if (err) return res.ResData("查询失败！")
            // 正常情况
        var record = []
        if (resResult[0].history_Record.length !== 0) {
            record = resResult[0].history_Record.split(',')
                // 重复情况
            if (record.includes(content_id.toString())) {
                if (record[1] == '') {
                    return
                } else {
                    for (let i = 0; i < record.length; i++) {
                        if (record[i] == content_id) {
                            for (let j = i; j < record.length - 1; j++) {
                                record[j] = record[j + 1];
                            }
                            record[record.length - 1] = content_id;
                        }
                    }
                }
            } else {
                if (record[1] == '') record.splice(1, 1)
                if (record.length >= 10) {
                    for (let i = 0; i < record.length - 1; i++) {
                        record[i] = record[i + 1];
                    }
                    record[record.length - 1] = content_id;
                } else {
                    record.push(content_id)
                }
            }
            record = record.join(',')
        } else {
            record = content_id + ','
        }
        var sql = 'UPDATE dj_users SET history_Record=? WHERE id=?'
        db.query(sql, [record, user_id], (err, resResult2) => {
            if (err) return res.ResData("添加历史记录出错！")
            if (resResult2.affectedRows < 1) return res.ResData("添添加历史记录失败")
            res.ResData('添加历史记录成功', 200)
        })
    })
}
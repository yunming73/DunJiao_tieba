// 导入数据库
const db = require('../db/index')

// 导入加密密码包
const bcrypt = require('bcryptjs')

// 导入jsonwebtoken
const jwt = require('jsonwebtoken')

// 时间转换
const dayjs = require('dayjs')
    // 前端登录
exports.login = (req, res) => {
        const userinfo = req.body;
        // console.log(userinfo);
        // 2、根据用户名查询用户数据
        const sql = 'SELECT * FROM dj_users WHERE uname=?'
            // 执行sql语句 查询用户信息
        db.query(sql, userinfo.username, (err, result) => {
            // 执行sql语句失败
            if (err) return res.ResData(err.message);
            // 执行成功，但是查询到的数据不等于1
            if (result.length !== 1) return res.ResData('用户名不存在', 206)
                // 用户是否是封禁状态
            if (result[0].is_black == 1) return res.ResData('用户被封禁中', 205)
                // 3、判断用户输入密码是否正确
            const compareResult = bcrypt.compareSync(userinfo.password, result[0].upassword)
            if (!compareResult) return res.ResData('密码错误')

            // 4.生成token字符串
            // 清除密码
            const user = {...result[0], upassword: '' }

            // 将用户信息加密生成token
            const secret = "secret"
            const token = jwt.sign(user, secret, { expiresIn: '10h' })
            var sql2 = "UPDATE dj_users SET ustate=1 WHERE id=?"
            db.query(sql2, result[0].id, (err, result2) => {
                if (err) return res.ResData('更新用户登录状态出错')
                const data = {
                    "id": result[0].id,
                    "username": result[0].uname,
                    "nickname": result[0].nickname,
                    "email": result[0].u_email,
                    "face": result[0].face,
                    "sex": result[0].sex,
                    "signature": result[0].signature,
                    "add_time": dayjs(result[0].add_time * 1000).format('YYYY-MM-DD'),
                    "user_type": result[0].user_type,
                    "is_black": result[0].is_black,
                    "token": 'Bearer' + token
                }
                res.ResData('登录成功', 200, data)
            })
        })
    }
    // 前端退出(更新用户登录状态)
exports.logout = (req, res) => {
        const id = req.body.id;
        var sql = "UPDATE dj_users SET ustate=0 WHERE id=?"
        db.query(sql, id, (err, result) => {
            if (err) return res.ResData('更新用户登录状态出错')
            res.ResData('退出成功', 200)
        })
    }
    // 后台管理员登录
exports.adminLogin = (req, res) => {
    const userinfo = req.body;
    const sql = "SELECT * FROM dj_users WHERE user_type=0 and uname=?"
    db.query(sql,userinfo.username ,(err, result) => {
        if (err) return res.ResData(err.message);
        if(result.length==0) return res.ResData("用户不存在")
        if (result[0].uname !== userinfo.username) return res.ResData('该用户不是管理员!')
        const compareResult = bcrypt.compareSync(userinfo.password, result[0].upassword)
        if (!compareResult) return res.ResData('密码错误')
            // 生成token字符串 --清除密码
        const user = {...result[0], password: '' }
            // 将用户信息加密生成token
        const secret = "jinitaimei"
        const token = jwt.sign(user, secret, { expiresIn: '10h' })
        const data = {
            "id": result[0].id,
            "username": result[0].uname,
            "nickname": result[0].nickname,
            "email": result[0].u_email,
            "face": result[0].face,
            "sex": result[0].sex,
            "signature": result[0].signature,
            "add_time": result[0].add_time,
            "user_type": result[0].user_type,
            "is_black": result[0].is_black,
            "token": 'Bearer' + token
        }
        res.ResData('登录成功', 200, data)
    })
}
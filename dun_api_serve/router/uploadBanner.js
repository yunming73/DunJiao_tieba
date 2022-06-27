// 上传轮播图
var express = require('express')
var router = express.Router()
var fs = require('fs')
var multer = require('multer') //主要用于上传文件
    //文件上传
var upload = multer({ dest: 'imgs/home_banner/' })
    //第三方config获取项目文件
var upload_config = require('config').get('upload_config');
// console.log(upload_config);
router.post('/upload/banner', upload.single('icon'), (req, res, next) => {
    // res.ResData("文件上传")
    // Headers->Content-Type->multipart/form-data
    // body->form-data->file
    // console.log(req.file);
    var str = 'img/home_banner/'
    var fileExarry = req.file.originalname.split('.')
    var ext = fileExarry[fileExarry.length - 1]
    var targetPath = req.file.destination + req.file.filename + '.' + ext
    var imgstr = str + req.file.filename + '.' + ext
        // console.log(imgstr);
        // console.log(ext);
    fs.rename(req.file.path, targetPath, (err) => {
        if (err) return res.ResData("文件上传失败")
    })
    res.ResData("文件上传成功", 200, { "tmp_path": imgstr, "url": upload_config.baseURL + targetPath })
})
module.exports = router
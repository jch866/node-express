/**
 * Created by jch866 on 2017/11/22.
 */
var express = require('express');
var router = express.Router();
var Cate = require('../models/category');
router.get('/',function(req,res,next){
    //判断当前用户是不是管理员
    //获取分类导航的数据
    Cate.find().sort({_id:-1}).then(function (rs) {
        res.render('main/index',{
            userInfo:req.info, //发送到模板的数据
            navs:rs
        });
    })




    //next()
})
module.exports = router;
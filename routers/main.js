/**
 * Created by jch866 on 2017/11/22.
 */
var express = require('express');
var router = express.Router();
var Cate = require('../models/category');
var Content = require('../models/content');

var data={};
router.use(function (req,res,next) {   //进入到main里面的都要用到这个数据  相当于公共数据
    var page = req.query.page ||'';
    data = {
        userInfo:req.info,
        limit:3,
        count:0,
        page,
        conLists:[],
        navs:[]
    }
    next()// 可能有promise的作用
})
//首页数据展示
router.get('/',function(req,res,next){
    var cate_id = req.query.cate_id ||'';
    var where = {};
    if(cate_id){
        where.category = cate_id;
    }
    Content.count().where(where).then(function (n) {
            data.count = n;
            data.pages = Math.ceil(n/data.limit);
            data.page = Math.min(data.pages,data.page); //取值不能超过总页数
            data.page = Math.max(1,data.page);//取值不能小于1
        var skip  = data.limit*(data.page-1);
            return Content.find().where(where).limit(data.limit).skip(skip).sort({_id:-1}).populate(['user','category'])
    }).then(function (allCon) {
        data.conLists = allCon;
        return Cate.find()
    }).then(function (rs) {
        data.navs = rs;
        res.render('main/index',{
            //userInfo:req.info, //发送到模板的数据
            data
        });
    })

    //判断当前用户是不是管理员
    //获取分类导航的数据
    // Cate.find().sort({_id:-1}).then(function (rs) {
    //     res.render('main/index',{
    //         userInfo:req.info, //发送到模板的数据
    //         navs:rs
    //     });
    // })

    //next()
})
router.get('/view',function (req,res,next) {
    var article_id = req.query.article_id||'';
    var cate_id = req.query.cate_id;
    data.article_id = article_id;
    data.cate_id = cate_id;
    Content.findOne({_id:data.article_id}).populate('user category').then(function (rs) {
        data.article = rs;
        return Cate.find();
    }).then(function (navs) {
        data.navs = navs;
        res.render('main/view',{
            data
        })
    })

})
module.exports = router;
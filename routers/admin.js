/**
 * Created by jch866 on 2017/11/22.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Cate = require('../models/category');
var Content = require('../models/content');
// var util = require('util')
//判断当前路径是不是管理员身份进入的
router.use(function (req,res,next) {
    if(!req.info.isAdmin){
        res.send('sorry，只有管理员才有权限 ')
        return
    }
    next()
})

//内容分类首页
router.get('/content',function (req,res,next) {
    let page = req.query.page || 1; //当前页数
    // 通过req.query.page来指定   http://localhost:8080/admin/user?page=1  要对page做些校验，比如是不是数字
    let limit = 2; //每页条数
    Content.count().then(function(count){
        //console.log(count) //查询用户总数
        //从数据库里读取所有记录
        var pages = Math.ceil(count / limit);
        page = Math.min(pages,page); //取值不能超过总页数
        page = Math.max(1,page);//取值不能小于1
        let skip = (page-1)*limit; //忽略条数
        //populate的参数对应new Schema 中的对象参数的KEY
        Content.find().limit(limit).skip(skip).sort({_id:-1}).populate('category user').then(function (contents) {
            //console.log(contents)
            res.render('admin/content',{
                info:req.info,
                lists:contents,
                count:count,
                pages:pages,
                page:page,
                limit:limit,
                pagePath:'/admin/content'
            })
        })
    })

})
//添加内容分类 显示添加页 GET
router.get('/content/add',function (req,res,next) {
    Cate.find().then(function (cates) {
        res.render('admin/content_add',{
            info:req.info,
            cates:cates
        })
    })
})
//添加内容分类 提交添加内容 POST
router.post('/content/add',function (req,res,next) {
    if(!req.body.title){
        res.render('admin/error',{
            info:req.info,
            tips:'内容标题不能为空'
        })
        return
    }
    var obj = req.body;
    var data = {
        category:obj.category,
        title:obj.title,
        des:obj.des,
        user:req.info._id.toString(),
        content:obj.content
    };
    new Content(data).save().then(function (rs) {
        res.render('admin/success',{
            info:req.info,
            tips:'内容保存成功',
            url:'/admin/content'
        })
    })


})

//编辑内容
router.get('/content/edit',function (req,res,next) {
    var id = req.query.id || '';
    var cates = [];
    Cate.find().then(function (rs) {
        cates = rs;
        return Content.findOne({_id:id}).populate('category')
    }).then(function (result) {
        //console.log(result);
        res.render('admin/content_edit',{
            info:req.info,
            cates,
            result
        })
    })
})
//编辑内容 用post方式提交
router.post('/content/edit',function (req,res,next) {
    var id = req.query.id || '';
   var title = req.body.title.trim()||'',
       cate  = req.body.category || '';
   if(!title || !cate){
       res.render('admin/error',{
           info:req.info,
           tips:'分类信息或者标题不能为空',
           url:'/admin/content/edit?id='+id
       })
       return ;
   }
   var obj = {
       category:req.body.category,
       title:req.body.title,
        des:req.body.des,
        content:req.body.content,
   };
   Content.update({_id:id},obj).then(function (json) {
       console.log(json);
       res.render('admin/success',{
           info:req.info,
           tips:'修改内容成功',
            url:'/admin/content'
       })
   })

})

//删除一条内容纪录
router.get('/content/del',function (req,res,next) {
    var id = req.query.id || '';
    Content.remove({_id:id}).then(function (json) {
        console.log(json.result);
        res.render('admin/success',{
            info:req.info,
            tips:'删除内容成功',
            url:'/admin/content'
        })
    })

})


//后台首页
router.get('/',function(req,res,next){
    //这里的路径不用写/admin/user 因为app.use('/admin',require('./routers/admin'))已经处理了
    res.render('admin/index',{
            info:req.info
    })
})
//后台用户管理页
router.get('/user',function(req,res,next){
    //这里的路径不用写/admin/user 因为app.use('/admin',require('./routers/admin'))已经处理了
    // limit(n) 限制的条数
    // skip(n) 路过的条数
    let page = req.query.page || 1; //当前页数
    // 通过req.query.page来指定   http://localhost:8080/admin/user?page=1  要对page做些校验，比如是不是数字
    let limit = 2; //每页条数
    User.count().then(function(count){
        //console.log(count) //查询用户总数
        //从数据库里读取所有记录
        var pages = Math.ceil(count / limit);
        page = Math.min(pages,page); //取值不能超过总页数
        page = Math.max(1,page);//取值不能小于1
        let skip = (page-1)*limit; //忽略条数
        User.find().limit(limit).skip(skip).then(function (users) {
            //console.log(users) // 所有的注册用户
            res.render('admin/user',{
                info:req.info,
                lists:users,
                count:count,
                pages:pages,
                page:page,
                limit:limit,
                pagePath:'/admin/user'
            })
        })
   })
})

//添加分类首页
router.get('/category',function(req,res,next){
    Cate.find().then(function (rs) {
        if(rs.length!=0){
            let page = req.query.page || 1;
            let limit = 2;
            Cate.count().then(function(count) {
                var pages = Math.ceil(count / limit);
                page = Math.min(pages, page);
                page = Math.max(1, page);
                let skip = (page - 1) * limit;
                Cate.find().sort({_id:-1}).limit(limit).skip(skip).then(function (cates) {
                    res.render('admin/category', {
                        info: req.info,
                        lists: cates,
                        //分页要传以下参数
                        count: count,
                        pages: pages,
                        page: page,
                        limit: limit,
                        pagePath:'/admin/category'
                    })
                })
            })
        }else{
            res.render('admin/category',{
                msg:'暂时没有数据'
            })
        }

    })


})
//添加分类页
router.get('/category/add',function(req,res,next){
    res.render('admin/cate_add',{
        info:req.info
    })

})

//点击添加分类按钮时POST
router.post('/category/add',function(req,res,next){
    var name = req.body.category||'';
    if(!name){
        res.render('admin/error',{
            info:req.info,
            tips:'分类名称不能为空',
           // url:'http://www.baidu.com'
        })
        return
    }
    Cate.findOne({name:name}).then(function(rs){
        if(rs){ //分类存在
            res.render('admin/error',{
                info:req.info,
                tips:'分类名称已经存在'
            })
            return Promise.reject()
        }else{ //分类不存在 就保存
            return new Cate({name:name}).save()
        };
    }).then(function(rs){
        res.render('admin/success',{
            info:req.info,
            tips:'添加分类成功',
            url:'/admin/category'
        })
    })
})
//编辑分类
router.get('/category/edit',function(req,res){
    //获取分类信息，并用表单信息展示
    var id = req.query.id ||'';
    Cate.findOne({_id:id}).then(function (rs) {
        //console.log(rs)
        if(!rs){
            res.render('admin/error',{
                info:req.info,
                msg:'分类信息不存在'
            })
        }else{
            res.render('admin/cate_edit',{
                info:req.info,
                item:rs
            })
        }
    })
})
//点击编辑分类按钮时POST 处理逻辑和添加分类 还是有区别
//
router.post('/category/edit',function(req,res) {
    var id = req.query.id || '';
    //获取POST过来的名称
    var name = req.body.category || '';

    Cate.findOne({_id: id}).then(function (rs) {
        if (!rs) {
            res.render('admin/error', {
                info: req.info,
                tips: '分类名称不存在'
            })
            return Promise.reject()
        } else {
            if (name === rs.name) {
                res.render('admin/success', {
                    info: req.info,
                    tips: '修改分类成功',
                    url: '/admin/category'
                })
                return Promise.reject()
            } else {
                //当前修改的名字是不是已经存在于数据库中   用户已经修改过了
                return Cate.findOne({ //找同名的分类
                    _id: {$ne: id}, //id不等于当前id,但名称是修改的名称
                    name: name
                })
            }
        }
    }).then(function (samecate) {
         if (samecate) { //有同名的分类存在了
            res.render('admin/error', {
                info: req.info,
                tips: '数据库中已经有相同的分类名了',
                url: '/admin/category'
            })
            return Promise.reject()
        } else {
            return Cate.update({
                _id: id
            }, {
                name: name
            })
        }
    }).then(function (rs) {
       // console.log(rs) //{ n: 1, nModified: 1, ok: 1 }
        res.render('admin/success', {
            info: req.info,
            tips: '修改分类成功',
            url: '/admin/category'
        })
    })
})

//分类删除操作
router.get('/category/del',function(req,res){
    var id= req.query.id || '';
    if(!id){
        res.render('admin/error', {
            info: req.info,
            tips: 'ID不存在',
            url: '/admin/category'
        })
    }else{
        Cate.remove({_id:id}).then(function (rs) {
            res.render('admin/success', {
                info: req.info,
                tips: '删除成功',
                url: '/admin/category'
            })
        })
    }
})


module.exports = router;
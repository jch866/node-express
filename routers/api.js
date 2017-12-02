/**
 * Created by jch866 on 2017/11/22.
 */
var express = require('express');
var router = express.Router();
//通过模型类操作数据库存
var User = require('../models/user')
var postdata;
router.use(function(res,req,next){
    postdata = {
        code:0,
        message:''
    }
    next()
})
router.post('/user/register',function(req,res,next){
    //console.log(req.body)

    var body = req.body;
    if(!body.user){
        postdata.code = 1, postdata.message ='用户名不能为空'
        res.json(postdata);
        return;
    }
    if(!body.pwd){
        postdata.code = 2, postdata.message ='密码不能为空'
        res.json(postdata);
        return;
    }
    if(body.pwd!=body.repwd){
        postdata.code = 3, postdata.message ='两次密码不一样'
        res.json(postdata);
        return;
    }
    //基于数据库的验证 判断用户名是否已经被注册
    User.findOne({
        user:body.user
    }).then((userInfo)=>{
        if(userInfo){
            postdata.code = 4, postdata.message ='用户已经存在'
            res.json(postdata);
            return;
        }
        var user = new User({
            user:body.user,
            pwd:body.pwd
        })
        return user.save();
    }).then((newUserInfo)=>{
        if(newUserInfo){
            //console.log(0)
            //console.log(newUserInfo)
            postdata.message ='注册成功'
            res.json(postdata);
        }
    })
})

router.post('/user/login',function(req,res){
    var u = req.body.user;
    var p = req.body.pwd;
    if(!u || !p){
        postdata.code = 5;
        postdata.message ='用户名或者密码不能为空';
        res.json(postdata)
        return
    }
    User.findOne({
        user:u,
        pwd:p
    }).then((info)=>{
        //console.log(1);
        //console.log(info);
        if(!info){
            postdata.code = 6;
            postdata.message = '用户名或密码错误';
            res.json(postdata);
            return;
        }
        postdata.message = '登录成功';
        //发送COOKIES
        postdata.userInfo = {
            _id:info._id,
            user:info.user
        }
        req.cookies.set('userInfo',JSON.stringify({
            _id:info._id,
            user:info.user
            //不用发送isadmin到客户端，这个选项要实时读取
        }) );
        res.json(postdata);
    })
});

router.get('/user/logout',function(req,res){
    req.cookies.set('userInfo',null)
    postdata.message='退出'
    res.json(postdata);
})
module.exports = router;
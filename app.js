/**
 * Created by jch866 on 2017/11/22.
 * 此项目对于表单提交，只是做了简单的校验
 */
var express = require('express');
var swig = require('swig');
var app = express();
var mongoose = require('mongoose');
//模块引擎解析的后缀  swig.renderFile用来解析模块方法
var bodyParse = require('body-parser');
var Cookies = require('cookies');
app.engine('html',swig.renderFile);
var User = require('./models/user.js')
//设置swig页面不缓存
//console.log(bodyparse);
//利用bodyparse中间件 处理前台用户传到后台的数据  自动在request上增加一个body的属性
app.use(bodyParse.urlencoded({extended:true})); //issue

app.use(bodyParse.json())

app.use(function(req,res,next){

    req.cookies = new Cookies(req,res);
    //解析用户登录COOKIES信息
    req.info = {};
    let cookieinfo = req.cookies.get('userInfo');
    if(cookieinfo) {
        try{
            req.info = JSON.parse(cookieinfo);
            //实时从数据库读这个用户信息，是不是管理员
            User.findById(req.info._id).then(function(findinfo){
                req.info.isAdmin = Boolean(findinfo.isAdmin);
                next()
            })
        }catch (e){
            next()
        }
    }else{
        next()
    }

})
/**
 * 'views' 固定的
 * './views'  模块目录
 */
app.set('views','./views');
/**
 * 'view engine' 固定的
 * 'html'  模块引擎解析的后缀
 */
app.set('view engine','html')

swig.setDefaults({
    cache: false
})

//当访问的路径以'/public'开始时，直接访问__dirname+'/public'下面的静态资源
app.use('/public',express.static(__dirname+'/public'))

app.use('/admin',require('./routers/admin')); //后台管理
app.use('/api',require('./routers/api')); //api
app.use('/',require('./routers/main')); //前台展示

mongoose.connect('mongodb://localhost/blog',{useMongoClient: true},function(err){
    if(err){
        console.log('数据库连接失败')
    }else{
        console.log('数据库连接成功');
        app.listen(8080)
    }
})

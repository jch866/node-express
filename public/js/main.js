//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
var vm = new Vue({
    el: '#blog',
    data:()=>{
        return {
            login_user:'',
            login_pwd:'',
            reg_user:'',
            reg_pwd:'',
            reg_repwd:'',
            islogin:false,
            tip:'',
            istip:false,
            hidebox:true,
            myinfo:false,
            comment_con:'',
            comments:[],
            pagecomments:[],
            com_len:'',
            pagination:{
                limit:3,
                page:1,
                count:0,
                pages:0
            }
        }
    },
    methods : {
        show(n){
            var vm = this;
          if(n===1){
              if(vm.pagination.page === vm.pagination.pages){
                  return '没有下一页'
              }else{
                  return '下一页'
              }
          }
          if(n === -1){
              if(vm.pagination.page === 1){
                  return '没有上一页'
              }else{
                  return '上一页'
              }
          }
        },
        page(){
            return `${this.pagination.page} / ${this.pagination.pages}`
        },
        showPageList(){
            var vm = this;
            var all = vm.comments;
            var p = vm.pagination;
            p.count = all.length;
            p.pages = Math.ceil(all.length/p.limit);
            var start = (p.page - 1)*p.limit;
            var end = start+p.limit;
            vm.pagecomments = all.slice(start,end);
        },
        go(n){
            var vm = this;
            var p = this.pagination;
            p.page += n;
            p.page = Math.min(p.page,p.pages);
            p.page = Math.max(1,p.page);
            var start = (p.page - 1)*p.limit;
            var end = start+p.limit;
            vm.pagecomments = vm.comments.slice(start,end);
        },
        timeParse(t){
            t = new Date(t);
            var c = function(n){return n>9?n:'0'+n};
            var ymd = t.getFullYear()+'-'+c((t.getMonth()+1))+'-'+c(t.getDate());
            var hms = c(t.getHours())+':'+c(t.getMinutes())+':'+c(t.getSeconds());
            return ymd+' '+hms;
        },
        transTime(time){
            var c =  new Date(time);
            return this.timeParse(c);
        },
        getComments(){
            var vm = this;
            if(!vm.$refs.hideId){return};
            var article_id = vm.$refs.hideId.value;
            let url = '/api/comment?article_id='+vm.$refs.hideId.value;
            axios.get(url).then((res)=>{
                console.log(res);
                if(!res.data.code) {
                    vm.comments = res.data.lists;
                    vm.showPageList();
                    vm.$refs.total.innerHTML = vm.comments.length;
                    vm.$refs.stotal.innerHTML = vm.comments.length;
                }
            })
        },
        goReg(){
            vm.islogin = !vm.islogin;
            vm.reg_user='';
            vm.reg_pwd='';
            vm.reg_repwd=''
        },
        logout(){
            let url = '/api/user/logout';
            axios.get(url).then((res)=>{
                console.log(res);
              if(!res.data.code) {window.location.reload()}
            })

        },
        login(){
        let url = '/api/user/login';
                axios.post(url,{
                    user:vm.login_user,
                    pwd:vm.login_pwd
                }).then((res)=>{
                if(res.data.code===0){ //登录成功
                    vm.istip = true;
                    vm.tip = '恭喜，登录成功';
                    window.location.reload()
                }else{
                    vm.istip = true;
                    vm.tip = res.data.message;
                }
                    setTimeout(()=>{
                        vm.istip = false;
                    },1000)
            })
         },
        register(){
           axios.post('/api/user/register',{
               user:vm.reg_user,
               pwd:vm.reg_pwd,
               repwd:vm.reg_repwd
           }).then((res)=>{
               console.log(res);
            if(res.data.code===0){ //注册成功
                vm.istip = true;
                vm.tip = '恭喜，注册成功';
                 setTimeout(()=>{
                    vm.istip = false;
                    vm.islogin = false;
                 },1000)
             }else{
                vm.istip = true;
                vm.tip = res.data.message
            }
           })
        },
        postComment(){
            let vm = this;
            let article_id = vm.$refs.hideId.value;
            let url = '/api/comment/post';
            axios.post(url,{ // username 和时间可以由后台返回
                con:vm.comment_con,
                article_id
            }).then(function (rs) {
                console.log(rs.data);
                newrs = rs.data;
                if(newrs.code ===0) {
                    vm.comment_con = '';
                    vm.comments = newrs.data.comments;
                    vm.showPageList();
                    vm.page();
                    vm.$refs.total.innerHTML = vm.comments.length;
                    vm.$refs.stotal.innerHTML = vm.comments.length;
                }
            })
        }
    },
    mounted:function(){
       this.getComments()
    }
})

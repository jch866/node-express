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
            com_len:''
        }
    },
    methods : {
        getComments(){
            var vm = this;
            if(!vm.$refs.hideId){return};
            var article_id = vm.$refs.hideId.value;
            let url = '/api/comment?article_id='+vm.$refs.hideId.value;
            axios.get(url).then((res)=>{
                console.log(res);
                if(!res.data.code) {
                    vm.comments = res.data.lists;
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
                    console.log(res);
                if(res.data.code===0){ //登录成功
                    vm.istip = true;
                    vm.tip = '恭喜，登录成功';
                    window.location.reload()
                    //vm.hidebox = false;
                    //vm.myinfo=true

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

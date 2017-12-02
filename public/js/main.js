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
            myinfo:false
        }
    },
    methods : {
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
        }
    }
})
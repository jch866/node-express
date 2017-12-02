/**
 * Created by jch866 on 2017/11/22.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
//new mogoose.Schema({}) 这样也可以
var sm = new Schema({
    user:'string',
    pwd:'string',
    isAdmin:{
        type:Boolean,
        default:false
    }
})
module.exports = sm;
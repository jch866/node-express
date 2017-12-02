/**
 * Created by jch866 on 2017/11/22.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
//new mogoose.Schema({}) 这样也可以
var sm = new Schema({
    name:'string',
})
module.exports = sm;
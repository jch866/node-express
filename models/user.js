/**
 * Created by jch866 on 2017/11/23.
 */
var mongoose = require('mongoose');
var userschema = require('../schemas/users')

module.exports = mongoose.model('User',userschema)
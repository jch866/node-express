/**
 * Created by jch866 on 2017/11/23.
 */
var mongoose = require('mongoose');
var categoryschema = require('../schemas/category')

module.exports = mongoose.model('Cate',categoryschema)
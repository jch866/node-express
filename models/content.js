/**
 * Created by jch866 on 2017/11/23.
 */
var mongoose = require('mongoose');
var contentschema = require('../schemas/content')

module.exports = mongoose.model('Content',contentschema)
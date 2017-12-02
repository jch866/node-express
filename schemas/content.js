/**
 * Created by jch866 on 2017/11/22.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

module.exports = new Schema({
    category:{
        type:mongoose.Schema.Types.ObjectId, // var Schema = mongoose.Schema;  type:Schema.Types.objectId,
        ref:'Cate' //对应  mongoose.model('Cate',categoryschema) 中的值
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    title:'string',
    des:'string',
    content:'string',
    views:{
        type:Number,
        default:0
    },
    addtime:{
        type: Date,
        default:new Date()
    }
});
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const todoSchema = new Schema({
  name: String, //資料型別是字串
  required: ture //這個是必填欄位
})

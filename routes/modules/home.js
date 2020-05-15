// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 準備引入路由模組
// 引用 Todo model
const Todo = require('../../models/todo')
// 設定首頁路由
router.get('/', (req, res) => {
  Todo.find() //取出 Todo model 裡的所有資料
    .lean() //把 Mongoose 的 Model 物件轉換成乾淨的JavaScript資料陣列
    .sort({ _id: 'asc' }) //asc = 升冪  desc＝ 降冪
    .then(todos => res.render('index', { todos })) //將資料傳給 index 樣板
    .catch(error => console.error(error)) //錯誤處理
})

// 匯出路由器
module.exports = router
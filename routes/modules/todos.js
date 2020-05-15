// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 準備引入路由模組
// 引用 Todo model
const Todo = require('../../models/todo')
// 設定todo路由
//新增todo的頁面
router.get('/new', (req, res) => {
  return res.render('new')
})

//接住表單，並送往資料庫 ＝ create 功能
router.post('/', (req, res) => {
  const name = req.body.name //從 req.body 拿出表單的 name 資料
  return Todo.create({ name })  //呼叫Todo 物件直接新增資料存入資料庫
    .then(() => res.redirect('/'))  //新增完成後導回首頁
    .catch(error => console.log(error))
})

//新增詳細頁面
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id) //取出 Todo model 裡的 id 資料
    .lean() //把 Mongoose 的 Model 物件轉換成乾淨的JavaScript資料陣列
    .then((todo) => res.render('detail', { todo })) //將資料傳給 detail 樣板
    .catch(error => console.log(error))
})

//新增修改頁面
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Todo.findById(id) //取出 Todo model 裡的 id 資料
    .lean() //把 Mongoose 的 Model 物件轉換成乾淨的JavaScript資料陣列
    .then((todo) => res.render('edit', { todo })) //將資料傳給 edit 樣板
    .catch(error => console.log(error))
})

//接住修改頁面的表單，把資料庫的資料改成表單資料 = update 功能
router.put('/:id', (req, res) => {
  const id = req.params.id
  const { name, isDone } = req.body //解構賦值
  return Todo.findById(id)
    .then(todo => {
      todo.name = name  //把資料庫資料 name 改成收到的表單資料
      todo.isDone = isDone === 'on' //checkbox有打勾為 on
      return todo.save() //儲存此筆資料
    })
    .then(() => res.redirect(`/todos/${id}`)) //回到詳細頁面
    .catch(error => console.log(error))
})

//接住修改頁面的表單，按表單回傳的資料把資料庫的同樣的資料刪除 = delete 功能
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id) //取出 Todo model 裡的 id 資料
    .then(todo => todo.remove()) //刪除此筆資料
    .then(() => res.redirect('/')) //重新呼叫首頁
    .catch(error => console.log(error))
})




// 匯出路由器
module.exports = router
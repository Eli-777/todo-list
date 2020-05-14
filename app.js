// 載入 express 並建構應用程式伺服器
const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Todo = require('./models/todo')


const app = express()

// 設定連線到 mongoDB
mongoose.connect('mongodb://localhost/todo-list', { useNewUrlParser: true, useUnifiedTopology: true })

// 取得資料庫連線狀態
const db = mongoose.connection

// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})

// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

//設定樣版引擎
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

// 設定首頁路由
app.get('/', (req, res) => {
  Todo.find() //取出 Todo model 裡的所有資料
    .lean() //把 Mongoose 的 Model 物件轉換成乾淨的JavaScript資料陣列
    .then(todos => res.render('index', { todos })) //將資料傳給 index 樣板
    .catch(error => console.error(error)) //錯誤處理
})

//新增todo的頁面
app.get('/todos/new', (req, res) => {
  return res.render('new')
})

//接住表單，並送往資料庫
app.post('/todos', (req, res) => {
  const name = req.body.name //從 req.body 拿出表單的 name 資料
  return Todo.create({ name })  //呼叫Todo 物件直接新增資料存入資料庫
    .then(() => res.redirect('/'))  //新增完成後導回首頁
    .catch(error => console.log(error))
})

//新增詳細頁面
app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  return Todo.findById(id) //取出 Todo model 裡的 id 資料
    .lean() //把 Mongoose 的 Model 物件轉換成乾淨的JavaScript資料陣列
    .then((todo) => res.render('detail', { todo })) //將資料傳給 detail 樣板
    .catch(error => console.log(error))
})


// 設定 port 3000
app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})
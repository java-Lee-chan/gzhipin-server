var express = require('express');
var router = express.Router();

const UserModel = require('../db/models').UserModel;
const md5 = require('blueimp-md5');
const filter = {password: 0, _v: 0}; // 指定过滤的属性

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// 注册一个路由：用户注册
/* 
1. path为：/register
2. 请求方式为：POST
3. 接收 username 和 password 参数
4. admin是已注册用户
5. 注册成功返回：{code: 0, data: {_id: 'abc', username: 'xxx', password: '123'}}
6. 注册失败返回：{code: 1, msg: '此用户已存在'}
*/
/* 
1. 获取请求参数
2. 处理
3. 返回响应参数
*/
// router.post('/register', function(req, res){
//   // 1. 获取请求参数
//   const {username, password} = req.body;

//   // 2. 处理
//   if(username === 'admin'){ // 注册会失败
//     // 返回相应数据(失败)
//     res.send({code: 1, msg: '此用户已存在'});
//   }else { // 注册会成功
//     // 返回相应数据(成功)
//     res.send({code: 0, data: {_id: 'abc123', username, password}});
//   }
// });

// 注册的路由
router.post('/register', function(req, res){
  // 读取请求参数数据
  const {username, password, type} = req.body;
  // 处理：判断用户是否已经存在，如果存在，返回提示错误的信息，如果不存在，保存
  // 查询（根据username）
  UserModel.findOne({username}, function(err, user){
    if(!err){
      // 如果user有值（已存在）
      if(user){
        // 返回提示错误的信息
        res.send({code: 1, msg: '此用户已存在'});
      }else{  // 没值（不存在）
        // 保存
        new UserModel({username, type, password: md5(password)}).save(function(err, user){
          if (!err){
            // 生成一个cookie(userid: user._id)，并交给浏览器保存
            res.cookie('userid', user._id, {maxAge: 1000*60*60*24});
            // 返回包含user的json数据
            const data = {username, type, _id: user._id}; // 相应数据中不要携带password
            res.send({code: 0, data});
          }else {
            console.log(err);
          }
        });
      }
    }
  });
});

// 登录的路由
router.post('/login', function(req, res){
  const {username, password} = req.body;
  // 根据username和password查询数据库users，如果没有，返回提示错误的信息，如果有，返回登录成功的信息(包含user)
  UserModel.findOne({username, password: md5(password)}, filter, function(err, user){
    if(!err){
      if(user){ // 登陆成功
        res.cookie('userid', user._id, {maxAge: 1000*60*60*24});
        res.send({code: 0, data: user});
      }else {   // 登录失败
        res.send({code: 1, msg: '用户名或密码错误'});
      }
    }else {
      console.log(err);
    }
  });
});

// 更新用户信息的路由
router.post('/update', function(req, res){
  // 从请求的 cookie 中的到 userid
  const userid = req.cookies.userid;
  // 如果不存在，直接返回一个提示信息
  if(!userid) {
    return res.send({code: 1, msg: '请先登录'});
  }
  // 存在，根据userid更新对应的user文档数据
  // 得到提交的用户数据
  const user = req.body;
  UserModel.findByIdAndUpdate({_id: userid}, user, function(err, oldUser){
    if(!err){
      if(!oldUser){
        // 通知浏览器删除userid的cookie
        res.clearCookie('userid');
        // 返回一个提示信息
        res.send({code: 1, msg: '请先登录'});
      }else {
        // 准备一个返回的user数据对象
        const {_id, username, type} = oldUser;
        const data = Object.assign(user, {_id, username, type});
        // 返回
        res.send({code: 0, data});
      }
    }
  });
});
module.exports = router;

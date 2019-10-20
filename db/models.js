/* 
包含n个操作数据库集合数据的Model模块
1.连接数据库
  1.1 引入 mongoose
  1.2 连接指定数据库（URL只有数据库是变化的）
  1.3 获取连接对象
  1.4 绑定连接完成的监听（用来提示连接成功）
2. 得到对应特定集合的 Model
  2.1 定义 Shema（描述文档结构）
  2.2 定义 Model（与集合对应，可以操作集合）
  2.3 向外暴露Model
*/
// 1.连接数据库
//   1.1 引入 mongoose
const mongoose = require('mongoose');
//   1.2 连接指定数据库（URL只有数据库是变化的）
mongoose.connect('mongodb://localhost:27017/gzhipin2', {useNewUrlParser: true, useUnifiedTopology: true});
//   1.3 获取连接对象
const conn = mongoose.connection;
//   1.4 绑定连接完成的监听（用来提示连接成功）
conn.once('open', function(){
  console.log('数据库连接成功');
});

// 2. 得到对应特定集合的 Model
//   2.1 定义 Shema（描述文档结构）
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: {type: String,required: true},  // 用户名
  password: {type: String,required: true},   // 密码
  type: {type: String,required: true},      // 用户类型：laoban/dashen
  header: String, // 头像名称
  post: String,   // 职位
  info: String,   // 个人或职位简介
  company: String,// 公司名称
  salary: String  // 月薪  
});
//   2.2 定义 Model（与集合对应，可以操作集合）
const UserModel = mongoose.model('user', userSchema);
//   2.3 向外暴露Model
exports.UserModel = UserModel;

// module.exports = UserModel;
// exports.xxx = value
// exports.yyy = value




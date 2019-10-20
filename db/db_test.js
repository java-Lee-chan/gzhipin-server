/* 
测试使用mongoose操作mongodb数据库
1.连接数据库
  1.1 引入 mongoose
  1.2 连接指定数据库（URL只有数据库是变化的）
  1.3 获取连接对象
  1.4 绑定连接完成的监听（用来提示连接成功）
2. 得到对应特定集合的 Model
  2.1 定义 Shema（描述文档结构）
  2.2 定义 Model（与集合对应，可以操作集合）
3. 通过 Model 或其实例对集合数据进行 CRUD 操作
  3.1 通过 Model 实例的 save() 添加数据
  3.2 通过 Model 的 find()/findOne() 查询多个或一个数据
  3.3 通过 Model 的 findByIdAndUpdate() 更新某个数据
  3.4 通过 Model 的 remove()删除匹配的数据
*/
const md5 = require('blueimp-md5'); // md5加密的函数
// 1. 连接数据库
// 1.1 引入 mongoose
const mongoose = require('mongoose'); 
// 1.2 连接指定数据库（URL只有数据库是变化的）
mongoose.connect('mongodb://localhost:27017/gzhipin_test', {useNewUrlParser: true, useUnifiedTopology: true});
// 1.3 获取连接对象
const conn = mongoose.connection;
// 1.4 绑定连接完成的监听（用来提示连接成功）
conn.once('open', function(){
  console.log("数据库连接成功");
});

// 2. 得到对应特定集合的 Model
//   2.1 定义 Shema（描述文档结构）
const Schema = mongoose.Schema;
const userSchema = new Schema({ // 指定文档的结构：属性名/属性值得类型，是否是必须的，默认值
  username: { // 用户名
    type: String,
    required: true
  },
  password: { // 密码
    type: String,
    required: true
  },
  type: { // 用户类型：dashen/laoban
    type: String, 
    required: true  
  },
  header: String
});
//   2.2 定义 Model（与集合对应，可以操作集合）
const UserModel = mongoose.model("user", userSchema);    // 集合名：users

// CRUD
// 3.1 通过 Model 实例的 save() 添加数据
function testSave(){
  // 创建 UserModel 的实例
  const userModel = new UserModel({username: 'Bob', password: md5('234'), type: 'laoban'})
  // 调用 save() 保存
  userModel.save(function(err, userDoc){
    if(!err){
      console.log("save()", userDoc);
    }
  });
}
// testSave();

// 3.2 通过 Model 的 find()/findOne() 查询多个或一个数据
function testFind(){
  // 查询多个:得到的是所有匹配文档对象的数组，如果没有匹配的结果是[]
  UserModel.find({}, function(err, docs){ 
    if(!err){
      console.log("find()", docs);
    }
  });
  // 查询一个:得到的是匹配的文档对象，如果没有匹配的结果是 null
  UserModel.findOne({_id: '5dabe54cf699cb0528b7bec5'}, function(err, doc){
    if(!err){
      console.log("findOne()", doc);
    }
  });
}
// testFind();

// 3.3 通过 Model 的 findByIdAndUpdate() 更新某个数据
function testUpdate(){
  UserModel.findByIdAndUpdate('5dabe657785d3f05402187a9', {username: 'Jack'}, function(err, prevDoc){
    if(!err){
      console.log('findByIdAndUpdate()', prevDoc);
    }
  })
}
// testUpdate();

// 3.4 通过 Model 的 remove()删除匹配的数据
function testDelete(){
  UserModel.deleteOne({_id: '5dabe657785d3f05402187a9'}, function(err, doc){
    if(!err){
      console.log('remove()', doc); // { n: 1/0, ok: 1, deletedCount: 1 }
    }
  })
}
testDelete();



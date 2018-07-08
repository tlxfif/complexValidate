第一次写框架 可能代码性能并不好 ^_^

# complexValidate v0.2 前端复杂验证框架

## 使用说明

## 1.引入jquery,引入complexValidate

## 2.需要在验证的input外指定一个元素,就叫它验证范围吧
```
<div id="validate"></div>
```
## 3.指定该组input的验证组别,以及需要验证的方式
### 3.1 例如:

```
<input type="text"  validateGroup="1" validate="mail">
```
### 3.2 其中 mail 是内置的验证类型,类似的一些内置的验证类型还有:
******
|    验证类型   |   说明   |
| --------     | -----:   |
| notNull      |不能为空  | 
| null         |只能为空  |
| mail         |邮箱      |
| phone        |手机号    |
| idcard       |身份证    |
| password     |密码      |
| length       |长度      |
| float        |浮点数   |
| int          |整数      |
| url          |链接      |
| date         |日期      |
| username     |用户名    |

### 3.3 如果一个input需要多个验证类型则用"|"隔开
例如:
```
<input type="text"  validateGroup="1" validate="int|length(1,2)">
```
以上代码只匹配一位整数


### 3.4 这样设置的原因如下:
考虑到在同一验证范围内可能会存在多组验证,例如
```
<div id="validate">
    <div>
      <input type="text" validateGroup="1"><br>
      <input type="text" validateGroup="1"><br>
      <button id="sub1">验证1</button>
    </div>
    <div>
      <input type="text" validateGroup="1"><br>
      <input type="text" validateGroup="1"><br>
      <input type="text" validateGroup="2"><br>
      <button id="sub2">验证2</button>
    </div>
</div>
```

## 4.配置并使用
### 4.1 假如我需要验证如下页面
```
<div id="validate">
    <input type="text" placeholder="不能为空" validateGroup="1" validate="notNull|length(1,5)"><br>
    <input type="text" placeholder="只能为空" validateGroup="1" validate="null"><br>
    <input type="text" placeholder="邮箱" validateGroup="1" validate="mail"><br>
    <button id="sub1">验证1</button>
    <br><br><br><br>
    <input type="date" placeholder="不能为空" validateGroup="2" validate="notNull"><br>
    <input type="text" placeholder="整数并且不为空" validateGroup="2" validate="notNull|int|phone"><br>
    <input type="text" placeholder="xxx" validateGroup="2" validate="xxx(1,2)"><br>
    <input type="text" value="" validateGroup="2" validate="password|int"><br>
    <input type="text" value="" validateGroup="2" validate="password|int"><br>
    <button id="sub2">验证2</button>
</div>
```
则需要在js中配置如下代码
```
simpleValidate.option({
    group:[
        {
            validateRound:"#validate",
            validateGroup:"1"
        },
        {
            validateRound:"#validate",
            validateGroup:"2"
        }
    ]
});
```
validateRound为验证范围

validateGroup为验证组,同一验证组只需要声明配置一次即可

### 4.2 开始验证
```
$(document).on("click","#sub1",function(){
    var arr=window.simpleValidate.validate("1",function (item,status) {
        if(status){
            item.css("background-color","#58eead")
        }else{
            item.css("background-color","#8f7cee")
        }
    });
});
$(document).on("click","#sub2",function(){
    window.simpleValidate.validate("2",function (item,status) {
        if(status){
            item.css("background-color","#58eead")
        }else{
            item.css("background-color","#ff777e")
        }
    });
});
```
当分别点击两个按钮时验证不同的组别
验证每一个input调用一次window.simpleValidate.validate方法中的回调函数
传入当前input及状态
函数执行完毕返回当前验证组input对象及验证状态的数组

## 5.自定义验证类型
很明显,目前内置的验证函数根本无法满足很多复杂的验证
这个框架提供让用户自己设定验证函数的方式例如:
我们可以在配置对象simpleValidate.ption中添加regex这个对象
```
simpleValidate.option({
    group:[
        {
            validateRound:"#validate",
            validateGroup:"1"
        }
    ],
    regex:{
        xxx:{
            type:'fun',
            regex:function (input,multiRegex,k,j) {
                  var len=$(input[0]).val().length
                    return len>=k&&len<j
                 }
        }
    }
});
```
如上代码所示,在框架中添加了xxx这个验证类型,在如下代码中即可使用
```
<input type="text"  validateGroup="1" validate="xxx(1,2)">
```
其中xxx的值为一个对象,验证对象的type属性的值目前只能为"fun"或"regex"

~~目前type属性的值为"fun"的验证类型在使用时只能独占,不能多个验证类型一起共同验证~~

如果type为"regex"则,验证对象的regex属性只能为一个正则表达式

如果type为"fun"则,验证对象的regex属性只能为一个匿名函数

该函数的第一个参数返回拥有该验证类型(xxx)的input数组

第二个参数返回多验证函数multiRegex指针

调用multiRegex函数时只需要把input作为第一个参数,验证类型作为之后的参数传递该函数会验证完毕后返回真假

例如:multiRegex(input,"int","notNull"),目前该函数只会验证type属性为regex的验证类型

第三个参数及以后的参数由用户定义

如上述代码所示,定义了k,j参数,在 validate="xxx(1,2)" 传递
目前验证参数不能传递匿名对象












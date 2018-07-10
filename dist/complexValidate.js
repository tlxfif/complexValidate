/*!
 * complexValidate v0.3
 * Date: 2018-07-010T21:44Z
 */
(function () {
    //基本正则
    var validateRegex={
        notNull:{
            type:'regex',
            regex:/\S/
        },
        null:{
            type:'regex',
            regex:/^\s*$/g
        },
        mail: {
            type: 'regex',
            regex: /^((([A-Za-z0-9_\.-]+)@([\dA-Za-z\.-]+)\.([A-Za-z\.]{2,6})[; ,])*(([A-Za-z0-9_\.-]+)@([\dA-Za-z\.-]+)\.([A-Za-z\.]{2,6})))$/,
        },
        phone:{
            type:'regex',
            regex:/^1\d{10}$/
        },
        idcard:{
            type:'regex',
            regex:/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4}$/
        },
        password:{
            type:'fun',
            regex:function (curr,input,regex) {
                if(regex($(input[0]),"notNull")&&regex($(input[1]),"notNull")){
                    return $(input[0]).val()==$(input[1]).val()
                }
                return false
            }
        },
        length:{
            type:'fun',
            regex:function (curr,input,reg,k,j) {
                var len=$(curr).val().length
                return len>=k&&len<j
            }
        },
        float:{
            type:'regex',
            regex:/^-?\d*\.?\d+$/
        },
        int:{
            type:'regex',
            regex:/^-?\d+$/
        },
        url:{
            type:'regex',
            regex:/^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
        },
        date:{
            type:'regex',
            regex:/^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/
        },
        username:{
            type:'regex',
            regex:/^[a-zA-Z0-9_-]{4,16}$/
        }
    }
    var complexValidate =new Object();
    var currGroupObj=null//当前组对象
    var _option=null;//配置对象
    //设置配置对象validateRegex
    function option(opt){
        _option=opt.group
        if(opt.regex){
            for(var name in opt.regex){
                validateRegex[name]=opt.regex[name]
            }
        }
    }
    complexValidate.option=option;
    //返回带参数的validateRegex
    function getAttribute(text) {
        var val=text.trim(" ")
        var left=val.indexOf("(")
        if(left==-1){
            return {attribute:val}
        }else{
            return {
                attribute:val.substring(0,left).trim(" "),
                param:left+1<val.length-1?val.substring(left+1,val.length-1):undefined
            }
        }
    }
    function findbyvalidate(reg) {
        var input=$(currGroupObj.validateRound+" *"+"[validateGroup='"+currGroupObj.validateGroup+"'][validate*='"+reg+"']")
        var out=[]
        for (var i=0;i<input.length;i++) {
            var item=$(input[i]).attr("validate").split("|")
            for(var j=0;j<item.length;j++){
                if(reg==getAttribute(item[j]).attribute){
                    out.push(input[i])
                }
            }
        }
        return out
    }
    //匹配单个正则
    function Regex(item) {
        var validateArr=item.attr("validate")
        var v=validateArr.split("|")//验证类型匹配器
       return Regexing(item,v)
    }
    //匹配过程共用
    function Regexing(item,v,isexport) {
        for (var i in v){
            var attr=getAttribute(v[i])
            var reg=attr.attribute
            var attribute=validateRegex[reg]
            if(attribute){
                switch (attribute.type){
                    case 'regex':
                        if(attribute.regex.test(item.val())!=true){return false}break
                    case 'fun':
                        //返回当前区域validateRound中同一验证组validateGroup中同一验证类型validate的input数组
                        //外部调用不需要查找
                        var input=isexport?item:findbyvalidate(reg)
                        if(attr.param){
                            var flag=eval("attribute.regex(item,input,exRegex,"+attr.param+")")
                            if(flag!=true){return false}
                        }else{
                            if(attribute.regex(item,input,exRegex)!=true){return false}
                        }
                        break
                }
            }else{
                throw new Error("找不到"+reg+"验证类型");
            }
        }
        return true
    }
    //暴露匹配方法
    function exRegex(item,v) {
        return Regexing($(item),v.split("|"),true)
    }
    //验证返回验证未通过的对象
    function validate(group,callback){
        var groupObj= searchGroup(group)
        currGroupObj=groupObj
        //在当前验证区域validateRound中寻找带有group验证组的所有input标签
        var input=$(groupObj.validateRound+" *"+"[validateGroup="+group+"]")
        var arr=new Array();//返回对象
        for(var i=0;i<input.length;i++){
            var status=Regex($(input[i]))
            arr.push({el:$(input[i]),status:status});
            if(callback){callback($(input[i]),status);}
        }
        return arr;
    }
    complexValidate.validate=validate;
    //在配置文件中搜索验证组
    function searchGroup(groupid){
        if(_option==null){
            throw new Error("没有配置 complexValidate.option");
        }
        for(var i in _option){
            if(_option[i].validateGroup===groupid){
                return _option[i];
            }
        }
        throw new Error("验证组未定义");
        return null;
    }
    window.complexValidate=complexValidate;
})();
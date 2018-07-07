//自定义配置
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

//test
$(document).on("click","#sub",function(){
    var arr=window.simpleValidate.validate("1",function (item,status) {
        if(status){
            item.css("background-color","#58eead")
        }else{
            item.css("background-color","#8f7cee")
        }
    });

    window.simpleValidate.validate("2",function (item,status) {
        if(status){
            item.css("background-color","#58eead")
        }else{
            item.css("background-color","#ff777e")
        }
    });
});





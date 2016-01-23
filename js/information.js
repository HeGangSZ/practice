/**
 * Created by Neo on 2016/1/12.
 */
//输入节点返回去重按符号分割的数组
function text(element){
    var textNode = $(element),
        textContent = textNode.value.trim().split(/[\s\,\;\.\、\；\，\。]+/);
    textContent=uniqArray(textContent);
    return textContent
}

function warn(){
    var textContent = text("#text");
    if(textContent.length>10){
        $("#p1").innerHTML = "你输入的爱好不能超过10个噢!"
    }
    else {
        $("#p1").innerHTML = null;

    }
}

function checkBox(){
    var textContent = text("#text");
    if(textContent.length<=10){
        var divNode =$("div");
        for(var i= 0,j=textContent.length;i<j;i++){
            var checkbox = document.createElement("input"),
                label = document.createElement("label");
            checkbox.type = "checkbox";
            checkbox.id = i;
            label.for = i;
            label.innerHTML = textContent[i];
            divNode.appendChild(checkbox);
            divNode.insertBefore(label,checkbox)

        }
    }
}

$.on("#button","click",checkBox);
$.on("#text","input",warn);
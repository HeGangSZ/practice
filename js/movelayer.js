/**
 * Created by Neo on 2016/2/18.
 */
/**
 * Created by Neo on 2016/2/18.
 */


window.onload = function(){


    //计算offsetLeft和offsetTop
    function offset(element,direction){
        var length = element[direction]
        while(element.offsetParent){
            length += element.offsetParent[direction]
            element = element.offsetParent
        }
        return length
    }

    //判断进入容器方向，输出up，right，down，left，代表上右下左
    function enterDirection(element,event){
        var w = element.offsetWidth
        var h = element.offsetHeight

        var offsetLeft = offset(element,"offsetLeft")
        var offsetTop = offset(element,"offsetTop")

        var x = (event.pageX-offsetLeft-(w / 2)) * (w > h ? (h / w) : 1);
        var y = (event.pageY-offsetTop-(h / 2)) * (h > w ? (w / h) : 1);
        var direction = Math.round((((Math.atan2(y, x) * (180 / Math.PI)) + 180) / 90) + 3) % 4;

        switch(direction){
            case 0:
                direction = "up";
                break;
            case 1:
                direction = "right";
                break;
            case 2:
                direction = "down";
                break;
            case 3:
                direction = "left";
                break;
        }
        return direction
    }


    function movelayer(enterElement,moveElement,event){
        var direction =  enterDirection(enterElement,event)
        //由进入方向决定改变的元素属性
        var changeAttr =null
        var stayAttr = null
        if(direction == "left" || direction == "right"){
            changeAttr = "left"
            stayAttr = "top"
        }
        else{
            changeAttr = "top"
            stayAttr = "left"
        }

        //根据事件类型决定是否重置，如果是鼠标进入事件则将元素位置重置
        //reset重置需要改变属性的值，根据重置后的位置来决定向哪边移动
        var reset = null
        if(event.type == "mouseenter" || event.type == "mouseover" ){
            if(direction == "right" || direction == "down") {
                reset = 100
            }
            else{
                reset = -100
            }
        }

        //moveStatus用来记录运动状态，如果没有才进行重置，防止事件重复触发
        if(!moveElement.moveStatus && reset){
            moveElement.style[stayAttr] = "0%"
            moveElement.style[changeAttr] = reset + "%"

        }

        //iSpeed是运动速度，根据进入方向决定速度正负
        var setSpeed = 10
        var iSpeed = null;
        if(reset){
            iSpeed = reset>0?-setSpeed:setSpeed;
        }
        else{
            if(direction == "down" || direction == "right"){
                iSpeed = setSpeed
            }
            else{
                iSpeed = -setSpeed
            }
        }

        //达到目标后清除状态
        function clear(target){
            moveElement.style[changeAttr] = target+"%"
            clearInterval(moveElement.time)
            moveElement.moveStatus = null
        }


        //清除定时器，防止事件重复触发
        clearInterval(moveElement.time)
        moveElement.time = setInterval(function(){
            moveElement.style[changeAttr] = (parseInt(moveElement.style[changeAttr])+iSpeed) +"%"
            moveElement.moveStatus = true
            //reset存在则是鼠标进入，正负代表进入进入方向
            if(reset > 0){
                //如果达到目标则清除定时器和运动状态
                if(parseInt(moveElement.style[changeAttr])<0){
                    clear(0)
                }
            }
            else if(reset <0){
                if(parseInt(moveElement.style[changeAttr])>0){
                    clear(0)
                }
            }
            //reset不存在则是鼠标移出
            else{
                if(parseInt(moveElement.style[changeAttr]) >= 100){
                    clear(100)
                }
                if(parseInt(moveElement.style[changeAttr]) <= -100){
                    clear(-100)
                }
            }
        },20)

    }





    var wrap = document.getElementsByClassName("wrap")
    var content = document.getElementsByClassName("content")
    var layer = document.getElementsByClassName("layer")

    for(var i= 0,j=wrap.length;i<j;i++){

        wrap[i].onmouseenter = function(e){
            e = e || window.element

            movelayer(this,this.getElementsByClassName("layer")[0],e)

        }


        wrap[i].onmouseleave = function(e){
            e = e || window.element

            movelayer(this,this.getElementsByClassName("layer")[0],e)

        }


    }

}





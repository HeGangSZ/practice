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


    function movelayer(element,event,changeAttr,stayAttr,reset){
        var direction =  enterDirection(element,event)

        //element.moveStatus用来记录是否在运动，如果没有才进行重置，防止事件重复触发
        if(!element.moveStatus && (reset!=0)){
            element.style[stayAttr] = "0%"
            element.style[changeAttr] = reset + "%"
        }

        var setSpeed = 5
        //reset是重置需要改变属性的值，根据重置后的位置来决定向哪边移动
        var iSpeed = null;
        if(reset ==0){
            if(direction == "up" || "right"){
                iSpeed = setSpeed
            }
            else{
                iSpeed = -setSpeed
            }
        }
        else{
            iSpeed = reset>0?-setSpeed:setSpeed;
        }


        //达到目标后清除状态
        function clear(){
            clearInterval(element.time)
            element.moveStatus = null
        }


        //清除定时器，防止事件重复触发
        clearInterval(element.time)
        element.time = setInterval(function(){
            element.style[changeAttr] = (parseInt(element.style[changeAttr])+iSpeed) +"%"
            element.moveStatus = true
            if(reset > 0){
                if(parseInt(element.style[changeAttr])<0){
                    element.style[changeAttr] = 0
                    clear()
                }
            }
            else if(reset <0){
                if(parseInt(element.style[changeAttr])>0){
                    element.style[changeAttr] = 0
                    clear()
                }
            }
            else if(reset ==0){
                if(parseInt(element.style[changeAttr])>100){
                    element.style[changeAttr] = 100
                    clear()
                }

            }
        },20)
    }

    var wrap = document.getElementsByClassName("wrap")
    var layer = document.getElementsByClassName("layer")

    for(var i= 0,j=wrap.length;i<j;i++){

        wrap[i].onmouseenter = function(e){
            e = e || window.element
            var _this = this
            var direction = enterDirection(_this,e)
            switch(direction){
                case "left":
                    movelayer(_this.getElementsByClassName("layer")[0],"left","top",-100)
                    break;
                case "right":
                    movelayer(_this.getElementsByClassName("layer")[0],"left","top",100)
                    break;
                case "down":
                    movelayer(_this.getElementsByClassName("layer")[0],"top","left",100)
                    break;
                case "up":
                    movelayer(_this.getElementsByClassName("layer")[0],"top","left",-100)
                    break;
            }
        }


        wrap[i].onmouseleave = function(e){
            e = e || window.element
            //movelayer(this.nextElementSibling,"top","left",-100)
        }
    }

}





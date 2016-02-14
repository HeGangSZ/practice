/**
 * Created by Neo on 2016/2/8.
 */
//    绑定事件
function addEvent(element,type,listener){
    type = type.replace(/^on/i,"").toLowerCase();
    var realListener = function (e) {
        if(typeof listener === "function") {
            e = e || window.event;
            listener.call(element, event);
        };
    };
    if(element.addEventListener){
        element.addEventListener(type,realListener,false);
    }
    else if(element.attachEvent){
        element.attachEvent("on"+type,realListener)
    }
    return element
};

//获取元素属性
function getStyle(element,attr){
    if(element.currentStyle){
        //获取IE8的透明度为NaN，待解决
        return element.currentStyle[attr];
    }
    else{
        return getComputedStyle(element,false)[attr]
    }
}


//运动框架
function startMove(element,attrs,fn){
    clearInterval(element.time)
//            将定时器赋值给element，可以不同element拥有自己的定时器

    element.time = setInterval(function(){
        var eAttr= null
        var iSpeed = null
        //用来检测多个状态是否都到达目标值，防止其中一个到达就停止了运动
        var bStop = true
        for(var attr in attrs){
            var iTarget = attrs[attr]

            if(attr === "opacity"){
                //parseInt是为了去掉小数位以防止透明度跳动
                eAttr = parseInt(parseFloat(getStyle(element,attr))*100)
            }
            else{
                eAttr = parseInt(getStyle(element,attr))
            }
            //iSpeed缓速变化
            iSpeed = (iTarget-eAttr)/8
            //iSpeed取整防止不到iTarget就停止
            iSpeed = iSpeed>0 ? Math.ceil(iSpeed) : Math.floor(iSpeed)
            //到达iTarget清除定时器，停止运动
            if(eAttr !== iTarget){
                //如果有其中一个没有到达目标，定时器就不会关闭，到达目标的值速度是0
                bStop = false
            }

            if(attr === "opacity"){
                element.style.opacity = (eAttr + iSpeed)/100
                element.style.filter = "alpha(opacity:"+(eAttr + iSpeed)+")"
            }
            else{
                element.style[attr] = eAttr + iSpeed + "px"
            }

        }

        if(bStop === true){
            //全部到达目标后停止定时器
            clearInterval(element.time)
            //链式运动，执行完本次运动执行下次运动
            if(fn){
                fn()
            }
        }
    },30)
}
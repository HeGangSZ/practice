/**
 * Created by Neo on 2016/2/3.
 */


    slide({direct:1,moveTime:1000,waitTime:2000})

/**
 *
 * @param {object} para
 *      @param {boolean} direct 方向，ture反向，false为正向
 *      @param {number} moveTime  切换一个图片的时间
 *      @param {number} waitTime  切换图片的间隔时间
 *
 */
function slide(para){
    var para = para || {};
    var direct = para.direct || null;
    var moveTime = para.moveTime || 300;
    var waitTime = para.waitTime  || 2000;
    var carousel = document.getElementById("carousel");
    var imgContainer = document.getElementById("imgContainer");
    var img = document.getElementById("imgContainer").getElementsByTagName("img");
    var imgWidth = img[0].width;
    var imgNum = img.length-2;
    var imgLength = imgNum*imgWidth;
    var prev = document.getElementById("prev");
    var next = document.getElementById("next");
    var buttons = document.getElementById("cButton").getElementsByTagName("span");
    var index = 1;  //图片索引
    var moveState = false;
    var itime;

    //移动函数
    function move(offleft){
        moveState = true;
        var left = parseInt(imgContainer.style.left)+offleft;
        //var moveTime = 300;    //移动时间
        var internal = 10;
        var speed = offleft/(moveTime/internal);
        begin();
        function begin() {
            if ((speed < 0 && left < parseInt(imgContainer.style.left)) || (speed > 0 && left > parseInt(imgContainer.style.left))) {
                imgContainer.style.left = parseInt(imgContainer.style.left) + speed + "px";
                setTimeout(begin,internal)
            }
            else {
                moveState = false;
                if (left < -imgLength) {
                    imgContainer.style.left = -imgWidth + "px"
                }
                if (left >  -imgWidth) {
                    imgContainer.style.left = -imgLength + "px"
                }
            }
        }
    }


    //给左右箭头绑定点击事件，每点击一次移动图片，并且改变按钮状态
    next.onclick=function(){
        if(!moveState){
            move( -imgWidth);
            if(index===imgNum){
                index=1}
            else{index+=1}
        }
        buttonLight()
    };

    prev.onclick=function(){
        if(!moveState){
            move(imgWidth);}
        if(index===1){
            index=imgNum}
        else{index-=1}
        buttonLight()
    };

    //控制按钮状态，先取消掉亮着的按钮，再设置新的按钮，序号与图片索引一样
    function buttonLight(){
        for(var i= 0,j=buttons.length;i<j;i++){
            if(buttons[i].className === "on"){
                buttons[i].className = ""
            }
        }
        buttons[index-1].className = "on"
    }

    //给每个按钮绑定状态，如果点击该按钮则跳转到相应图片
    for(var i= 0,j=buttons.length;i<j;i++){
        var thisIndex;
        buttons[i].onclick=function(){  //优化，如果当前按钮亮，则点击当前按钮无反应，直接退出函数
            if(this.className==="on"){
                return
            }
            thisIndex=parseInt(this.getAttribute("index"));
            if(!moveState){
                move(-imgWidth*(thisIndex-index))}
            index=thisIndex;
            buttonLight()
        }
    }

    function play(){
        console.log("leave")
        itime = setTimeout(function(){
            if(direct){
                prev.onclick()
                play()
            }
            else{
                next.onclick()
                play()
            }
        },waitTime) ;   //正反向
    }
    function stop(){
        console.log("enter")
        clearTimeout(itime)
    }


    carousel.onmouseenter = stop;
    carousel.onmouseleave = play;
    play()
}
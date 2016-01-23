/**
 * Created by Neo on 2016/1/12.
 */


function time(element){
    var timeNode = $(element),
        timeContent = timeNode.value,
        re = /(\d{4})-(\d{1,2})-(\d{1,2})/,
        inputTime = re.exec(timeContent);
    return inputTime
}

function al(){
    var enter = time("input"),
        iyear = parseInt(enter[1]),imonth =parseInt(enter[2]),iday=parseInt(enter[3]),
        itime = new Date(iyear,imonth-1,iday).getTime(),
        ntime = new Date().getTime(),
        stime = Math.floor((itime-ntime)/1000),
        output = $("#p2");
    if(stime>0){
        var days = parseInt(stime/86400),
            hours = parseInt(stime%86400/3600),
            minutes = parseInt(stime%3600/60),
            seconds = parseInt(stime%60),
            countDown = "现在距离"+iyear+"年"+imonth+"月"+iday+"日还有"+days+"天"+hours+"小时"+minutes+"分钟"+seconds+"秒!";
        output.innerHTML = countDown;
        if(stime=0){
            output.innerHTML="倒计时完毕!"
        }
        setTimeout(al,100)}
    else{
        output.innerHTML="你输入的时间无法倒计时！"
    }

}

$.on("button","click",al)
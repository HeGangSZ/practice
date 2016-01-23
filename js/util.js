/**
 * Created by Neo on 2016/1/16.
 */



/**
 * mini $
 *
 * @param {string} selector 选择器
 * @return {object.<HTMLElement>} 返回匹配的元素
 */
function $(selector) {
    if (selector[0] === "#") {
        var id = selector.slice(1);  //截取id值
        return document.getElementById(id);
    }

    else if (selector[0] === ".") {
        var className = selector.slice(1); //截取class值
        return document.getElementsByClassName(className)[0]; //className返回的是一个数组
    }

    else if (selector[0] === "[") {
        var allChild = document.getElementsByTagName("*"); //匹配所有标签
        var tag = selector.slice(1, -1);  //截取标签值
        var y = tag.indexOf("=");  //判断有无属性
        if (y !== -1) {
            var attribute = tag.slice(y+1); //截取属性值
            var tag = tag.slice(0, y); //截取标签值
            for (i = 0, j = allChild.length; i < j; i++) {
                if (allChild[i].getAttribute(tag) === attribute) {  //如果该子节点有该属性值返回该节点
                    return allChild[i];
                }
            }
        }
        else {
            for (i = 0, j = allChild.length ; i < j; i++) {
                if (allChild[i].getAttribute(tag)) {  //如果该子节点有该标签则返回该节点
                    return allChild[i];
                }
            }
        }
    }
    var tagNode = document.getElementsByTagName(selector);
    return tagNode[0];
}

//function $(selector) {
//    return document.querySelector(selector);
//}



/**
 * 判断是否有某个className
 * @param {HTMLElement} element 元素
 * @param {string} className className
 * @return {boolean}
 */
function hasClass(element, className) {
    var classNames = element.className;
    if (!classNames) {   //如果没有该className返回false
        return false;
    }
    classNames = classNames.split(/\s+/);   //将element.className以空格为间隔转为数组进行处理
    for (var i = 0, len = classNames.length; i < len; i++) {
        if (classNames[i] === className) {
            return true;     //对数组进行遍历匹配，如果找到则返回true
        }
    }
    return false;
}


///**
// * 添加className
// *
// * @param {HTMLElement} element 元素
// * @param {string} className className
// */
function addClass(element, className) {
    if(!hasClass(element,className)){
        element.className = element.className ?[element.className, className].join(' '):className;
    }
}


/**
 * 删除元素className
 *
 * @param {HTMLElement} element 元素
 * @param {string} className className
 */
function removeClass(element, className) {
    if(className && hasClass(element,className)){
        var classNames = element.className;
        classNames = classNames.split(/\s+/);
        for(var i= 0,j=classNames.length;i<j;i++){
            if(className === classNames[i]){
                classNames.splice(i,1);
                break;
            }
        }
        element.className = classNames.join(" ")
    }
}


/**
 *
 * @param {HTMLElement} element 元素
 * @param {string} type 事件名称
 * @return {HTMLElement} element 元素
 */
// 为了便于查找绑定过的事件，增加了一级命名空间
$.event = {
    listeners: []
};


// 给一个element绑定一个针对event事件的响应，响应函数为listener
$.event.addEvent = function(element,type,listener){
    type = type.replace(/^on/i,"").toLowerCase();

    var list = $.event.listeners;

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

    list[list.length] = [element, type, listener, realListener];

    return element
};


/**
 *
 * @param {HTMLElement} element 元素
 * @param {string} type 事件名称
 * @return {HTMLElement} element 元素
 */
// 移除element对象对于event事件发生时执行listener的响应
$.event.removeEvent = function (element, type, listener) {
    var list = $.event.listeners;
    var len = list.length;

    while(len--){
        var item = list[len];
        if(item[0]===element && item[1]===type && item[2] === listener){
            var realListener = item[3];
            if(element.removeEventListener){
                element.removeEventListener(type,realListener,false)
            }
            else if(element.detachEvent){
                element.detachEvent("on"+type,realListener)
            }
            list.splice(len,1)
        }
    }
};


// 实现对click事件的绑定
function addClickEvent(element, listener) {
   return $.event.addListener(element,"click",listener)
}

// 实现对于按Enter键时的事件绑定
function addEnterEvent(element, listener) {
    return $.event.addEvent(element, 'keypress', function (e) {
        var event = e || window.event;
        var keyCode = event.which || event.keyCode;
        if(keyCode === 13){
            listener.call(element,event)
        }
    });
}


/**
 *
 * @param {HTMLElement} element 元素
 * @param {string} tag 子标签名称
 * @param {string} eventName 事件名称
 * @param {string} listener 绑定函数
 */
//事件代理
$.event.delegateEvent = function(element, tag, eventName, listener) {
    $.event.addEvent(element, eventName, function (e) {
        e = e || window.event;
        var target = e.target || e.srcElement;
        if (target.tagName === tag.toUpperCase()) {
            listener.call(target, event)
        }
    });
};


$.on = function (selector, event, listener) {
    return $.event.addEvent($(selector), event, listener);
};

$.click = function (selector, listener) {
    return $.event.addEvent($(selector), 'click', listener);
};

$.un = function (selector, event, listener) {
    return $.event.removeEvent($(selector), 'click', listener);
};

$.delegate = function (selector, tag, event, listener) {
    return $.event.delegateEvent($(selector), tag, event, listener);
};


/**
 * 获取元素相对于浏览器窗口左上角的位置，会随着滚动条改变，使用top，left等属性查看
 * 注意：不是文档左上角，如果是相对于文档左上角，还需要加上scrollTop、scrollLeft
 *
 * @param {HTMLElement} element 元素
 * @return {Object} 位置
 */
function getPosition(element) {
    var box = element.getBoundingClientRect();
    return box;
}

/**
 * 获取元素绝对定位left
 *
 * @param  {Object} element 元素节点
 * @return {Number}  actualLeft 元素节点相对于文档的绝对left位置
 */
function getElementLeft(element){
    var actualLeft = element.offsetLeft;
    var current = element.offsetParent;
    while (current !== null){
        actualLeft += current.offsetLeft;
        current = current.offsetParent;
    }
    return actualLeft;
}

function getElementTop(element){
    var actualTop = element.offsetTop;
    var current = element.offsetParent;
    while (current !== null){
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }
    return actualTop;
}


/**
 * 判断arr是否为一个数组，返回一个bool值
 *
 * @param  {any}  arr 目标对象
 * @return {boolean}        判断结果
 */
function isArray(arr) {
    return '[object Array]' === Object.prototype.toString.call(arr);
}


/**
 * 判断fn是否为一个函数，返回一个bool值
 *
 * @param  {any}  fn 目标对象
 * @return {boolean}        判断结果
 */
function isFunction(fn) {
    // chrome下,'function' == typeof /a/ 为true.
    return '[object Function]' === Object.prototype.toString.call(fn);
}



/**
 * 判断一个对象是不是字面量对象，即判断这个对象是不是由{}或者new Object类似方式创建
 *
 * 事实上来说，在Javascript语言中，任何判断都一定会有漏洞，因此本方法只针对一些最常用的情况进行了判断
 *
 * @returns {Boolean} 检查结果
 */
function isPlain(obj){
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        key;
    if ( !obj ||
            //一般的情况，直接用toString判断
        Object.prototype.toString.call(obj) !== "[object Object]" ||
            //IE下，window/document/document.body/HTMLElement/HTMLCollection/NodeList等DOM对象上一个语句为true
            //isPrototypeOf挂在Object.prototype上的，因此所有的字面量都应该会有这个属性
            //对于在window上挂了isPrototypeOf属性的情况，直接忽略不考虑
        !('isPrototypeOf' in obj)
    ) {
        return false;
    }


    //判断new fun()自定义对象的情况
    //constructor不是继承自原型链的
    //并且原型中有isPrototypeOf方法才是Object
    if ( obj.constructor &&
        !hasOwnProperty.call(obj, "constructor") &&
        !hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf") ) {
        return false;
    }
    //判断有继承的情况
    //如果有一项是继承过来的，那么一定不是字面量Object
    //OwnProperty会首先被遍历，为了加速遍历过程，直接看最后一项
    for ( key in obj ) {}
    return key === undefined || hasOwnProperty.call( obj, key );
}


/**
 * 对一个object进行深度拷贝
 *
 * 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
 * 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等
 *
 * @param  {Object} source 需要进行拷贝的对象
 * @return {Object} 拷贝后的新对象
 */
function cloneObject (source) {
    var result = source, i, len;
    if (!source
        || source instanceof Number
        || source instanceof String
        || source instanceof Boolean) {
        return result;
    } else if (isArray(source)) {
        result = [];
        var resultLen = 0;
        for (i = 0, len = source.length; i < len; i++) {
            result[resultLen++] = cloneObject(source[i]);  //递归调用，直至是基本类型
        }
    } else if (isPlain(source)) {
        result = {};
        for (i in source) {
            if (source.hasOwnProperty(i)) {  //判定属性是否是继承来的
                result[i] = cloneObject(source[i]);
            }
        }
    }
    return result;
}


/**
 * 对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组
 *
 * @param  {Array} source 需要过滤相同项的数组
 * @return {Array}        过滤后的新数组
 */
function uniqArray(source) {
    var len = source.length,
        result = source.slice(0),
        i,datum;
    while (--len>0){
        i = len;
        datum = result[len];
        while (i--){
            if(datum === result[i]){
                result.splice(i,1);
                break;
            }
        }
    }
    return result;
}


// 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
function each(arr, fn) {
    for(var i= 0,j=arr.length;i<j;i++){
        fn(arr[i],i)
    }
}


// ------------------------------------------------------------------
// 判断IE版本号，返回-1或者版本号
// ------------------------------------------------------------------

// 首先要说明的是，各种判断浏览器版本的方法，难在所有环境下都正确。navigator下的字段容易被任意篡改。
// 所以在实际场景下，如果可能的话，避免使用获取IE版本号的方式来处理问题，
// 更推荐的是直接判断浏览器特性（http://modernizr.com/）而非从浏览器版本入手。

// 这是传统的userAgent + documentMode方式的ie版本判断。
// 这在大多数对老IE问题进行hack的场景下有效果。
function isIE(){
    var ie = /msie (\d+)\.\d+/i,
    userAgent = navigator.userAgent,
    ieVersion =document.documentMode || ie.exec(userAgent)[1] ;
    return ieVersion;
}



/**
     * 使标签可被点击移动（标签需absolute定位）
     * @param {string} mdElement 点击标签的ID名
     * @param {string} mvElement 移动标签的ID名（需为点击标签或点击标签的父级标签）
     *
     */
    function drag(mdElement,mvElement){
        var md=document.getElementById(mdElement);//获取点击的节点
        var mv;
        if(mdElement === mvElement){
            mv = md
        }
        else{
            mv = document.getElementById(mvElement);
        }
        md.onmousedown=function(event){    //点击md节点就执行move函数
            event = event || window.event;  //event表示点击事件的对象
            move(event,mv)
        };

        function move(event,mv) {
            var disX = event.clientX - mv.offsetLeft;
            var disY = event.clientY - mv.offsetTop;   //点击时的鼠标top距离-移动节点的top距离
            document.onmousemove = function (event) {     //当在document中鼠标移动时
                event = event || window.event;   //event表示移动事件的对象
                fMove(event, disX, disY,mv);  //如果要传递除event以外的其他参数就这样写
            };
            document.onmouseup = function (){  //当鼠标松开时将移动事件清空
                document.onmousemove=null;
                document.onmousedown=null;
            }
        }

        function fMove(e,ox,oy,mv){
            l= e.clientX -ox,  //e表示移动事件的对象
                t= e.clientY -oy,   //拖动时鼠标始终在图像点击处
                winW = document.documentElement.clientWidth || document.body.clientWidth,  //窗口最大宽度
                winH = document.documentElement.clientHeight || document.body.clientHeight, //窗口最大高度
                maxW =winW-mv.offsetWidth,  //可移动最大范围（元素不能移除窗口外）
                maxH =winH-mv.offsetHeight;
            if(l<0){l=0;}
            else if(l>maxW){l=maxW;}  //如果超出移动允许范围则使其成为最大范围
            if(t<0){t=0;}
            else if(t>maxH){t=maxH;}  //使div不会移动到窗口外

            mv.style.left = l+"px";
            mv.style.top = t+"px";
        }
}

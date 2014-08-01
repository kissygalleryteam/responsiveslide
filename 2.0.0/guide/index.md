## 综述

响应式页面需求越来越多，responsiveslide可以满足响应式页面slide需求。

* 版本：2.0.0
* 作者：常胤
* 标签：响应式
* demo：[http://kg.kissyui.com/responsiveslide/2.0.0/demo/index.html](http://kg.kissyui.com/responsiveslide/2.0.0/demo/index.html)

## 初始化组件

		document.ontouchmove = function(e) {e.preventDefault()};
	    S.use('kg/responsiveslide/2.0.0/index', function (S, Slide) {
			var $=S.all;
			var demo1 = new Slide({
				container:"#test"
			});

			//监听resize,orientationchange事件	
			$(window).on("resize", function(){
				demo1.resize();
			})

			$("#next").on("click", function(){
				demo1.next();
			})

			$("#prev").on("click", function(){
				demo1.prev();
			})
	    })


## API说明

-  resize(): 触发resize,orientationchange事件后，调用该方法，自适应slide
-  next(): 下一帧
-  prev(): 上一帧
-  switchTo(index): 跳转到指定帧

/**
 * @fileoverview 
 * @author satans17@gmail.com<satans17@gmail.com>
 * @module responsiveslide
 **/
KISSY.add(function (S, Node,Base,Event) {
    var EMPTY = '';
    var $ = Node.all;
    /**
     * 
     * @class Responsiveslide
     * @constructor
     * @extends Base
     */
    function Responsiveslide(comConfig) {
        var self = this;
        //调用父类构造函数
        Responsiveslide.superclass.constructor.call(self, comConfig);
		self._init();
    }
    S.extend(Responsiveslide, Base, /** @lends Responsiveslide.prototype*/{
		_init: function(){
			var self = this,
				container = $(self.get("container")),
				panelCls = self.get("panelCls");
			
			self.set("container",container);
			self.set("content",container.all("."+self.get("contentCls")));
			self.set("panels",container.all("."+panelCls));
			
			self.wrap();
			self.resize();
			self.bindEvt();
		},
		
		
		
		wrap: function(){
			var self = this,
				container = self.get("container"),
				content = self.get("content"),
				panels = self.get("panels");	
			
			content.wrapInner($('<div class="'+self.get("contentWrapCls")+'" />'));

			//包装一下所有的panel
			panels.wrap('<div class="'+self.get("panelWrapCls")+'" />');
			
			
			var contentWrap = container.one("."+self.get("contentWrapCls")),
				panels = container.all("."+self.get("panelWrapCls"))
			
			self.set("contentWrap",contentWrap);
			self.set("panels",panels);
			
			
			content.css({
				position:"relative",
				overflow:"hidden"
			});

			contentWrap.css({
				//position:"absolute"
			});
			
			panels.css({
				"float":"left"
			});
			
		},
		
		resize: function(){
			var self = this,
				content = self.get("content"),
				contentWrap = self.get("contentWrap"),
				panels = self.get("panels");
				contentWrap.hide();
				var contentWidth = content.innerWidth();
				contentWrap.show();
				contentWrap.width(contentWidth*panels.length);
				panels.width(contentWidth);
		
			contentWrap.css({
				transform: "translateX(-"+self.get("index")*content.width()+"px)"
			});
			
		},
		
		switchTo: function(index){
			var self = this,
				currentIndex = self.get("index"),
				panels = self.get("panels"),
				content = self.get("content"),
				contentWrap = self.get("contentWrap");
		
			//可以在切换前阻止
			if(self.fire("beforeSwitch",{currentIndex:currentIndex, index:index})===false){
				return;
			};
		
			if(index==panels.length){
				contentWrap.css({
					transform: "translateX(-"+self.get("index")*content.width()+"px)"
				});
			}
			
			contentWrap.stop(true).animate({
				transform: "translate3d(-"+index*content.width()+"px,0,0)"
			}, {
				duration: .3,
				useTransition:true,
				easing: "ease-out",
				complete: function(){
					self.set("index",index)
					self.fire("afterSwitch",{currentIndex:index});
				}
			});
			
			self.fire("switch",{currentIndex:currentIndex, index:index});	
		},
		
		next: function(){
			var self = this,
				index = self.get("index")+1,
				panels = self.get("panels"),
				len = panels.length;
			
			if(index>=len){
				self.fire("theLast");
				return;
			}
			
			self.switchTo(index);
		},
		
		prev: function(){
			var self = this,
				index = self.get("index")-1,
				panels = self.get("panels"),
				len = panels.length;
			
			if(index<0){
				self.fire("theFirst");
				return;
			}
			self.switchTo(index);
		},
		
		bindEvt: function(){
			var self = this ,
				container = self.get("container");
			
			// container.on("swipe", function(ev){
				// if(ev.direction=="left"){
					// self.next();
				// }
				
				// else if (ev.direction=="right"){
					// self.prev();
				// }
			// })
			
			//为了更多的效果自己实现
			var startTime, startX, deltaX;
			
			container.on(Event.Gesture.start, function(ev){
				var touch = ev.touches[0];
				startTime =  ev.timeStamp;
				startX = touch.pageX;
			})
			
			container.on(Event.Gesture.move, function(ev){
				var touch = ev.changedTouches[0],
					x = touch.pageX;
				deltaX = x - startX;
			})
			
			container.on(Event.Gesture.end, function(ev){
				if(deltaX<0){
					self.next();
				}else{
					self.prev();
				}
			})
			
		}
		
    }, {ATTRS : /** @lends Responsiveslide*/{
	
		//容器
		container:{},
		content:{},
		contentWrap:{},
		triggers:{},
		panels:{},
		
		//triggers 所在容器的 class, 默认为 ‘ks-switchable-nav’.
		navCls:{
			value:"ks-nav"
		},
		//{String} - panels 所在容器的 class, 默认为 ‘ks-switchable-content’.
		contentCls:{
			value:"ks-content"
		},
		contentWrapCls:{
			value:"ks-content-wrap"
		},
		//{String} - 默认为 ‘ks-switchable-trigger’, 会在 container 下寻找指定 class 的元素作为触发器.
		triggerCls:{
			value:"ks-trigger’"
		},
		//{String} - 默认为 ‘ks-switchable-panel’, 会在 container 下寻找指定 class 的元素作为面板.
		panelCls:{
			value:"ks-panel"
		},
		panelWrapCls:{
			value:"ks-panel-wrap"
		},
		
		index: {
			value:0
		}


    }});
    return Responsiveslide;
}, {requires:['node', 'base', 'event']});




/**
 * @fileoverview
 * @author satans17@gmail.com<satans17@gmail.com>
 * @module responsiveslide
 **/
KISSY.add(function (S, Node,Base,Event) {
    var $;
    var DOT = '.';
    $ = Node.all;
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

            if(!(container && container.length>0)){
                S.log("container is empty");
                return;
            }

            self.set("container",container);
            self.set("content",container.all(DOT+self.get("contentCls")));
            self.set("panels",container.all(DOT+panelCls));

            self.wrap();
            self.resize();
            //配置是否需要滑动
            if(self.get("touch")){
                self.bindEvt();
            }
            self.bindNav();
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
                position:"relative"
            });

            contentWrap.css({
                position:"relative"
            });

            panels.css({
                "float":"left"
            });

        },

        bindEvt: function(){
            var self = this ,
                container = self.get("container");
            //为了更多的效果自己实现
            var startX, deltaX;

            container.on("touchstart", function(ev){
                //ev.preventDefault();
                var touch = ev.touches[0];
                startX = touch.pageX;
            })

            container.on("touchmove", function(ev){
                var touch = ev.changedTouches[0],
                    x = touch.pageX;
                deltaX = x - startX;
            })

            container.on("touchend", function(ev){
                if (!(Math.abs(deltaX) <= 50)) {
                    ev.halt();
                    if (deltaX <= 50) {
                        self.next();
                    } else {
                        self.prev();
                    }
                }

            })

        },

        //重置容器宽度
        resize: function(){
            var self = this,
                content = self.get("content"),
                wrap = self.get("contentWrap"),
                panels = self.get("panels"),
                width;

            //wrap.css({"width":"auto"});
            //wrap.hide();
            width = content.width();
            //wrap.show();
            wrap.width(width*panels.length);
            panels.width(width);

            self.set("width",width);
            self.restore();
        },

        //还原内容位置
        restore: function(){
            var self = this,
                index = self.get("index");
            self.switchTo(index);
        },

        //切换到指定帧
        switchTo: function(index){
            var self = this,
                current = self.get("index"),
                panels = self.get("panels"),
                panelCls = self.get("panelCls"),
                pos = index*self.get("width");

            //可以在切换前阻止
            if(self.fire("beforeSwitch",{current:current, index:index})===false){
                return;
            };
            self.get("content").css({"overflow":"hidden"});

            panels.all(DOT+panelCls).show();

            //设置位置
            self.setPosition(pos,function(){
                self.set("index",index);
                //panels.hide();
                $(panels[index]).show();
                self.lazyLoad($(panels[index]));
                self.fire("afterSwitch",{current:index});
                panels.each(function(panel,i){
                    if(i!=index){
                        $(panel).one(DOT+panelCls).hide();
                    }
                });
                self.get("content").css({"overflow":""});
            });

            //switch事件
            self.fire("switch",{current:current, index:index});
        },

        //设置帧位置
        setPosition: function(pos,callback){
            var self = this,
                contentWrap = self.get("contentWrap");

            contentWrap.stop(false).animate({
                left:-pos
                //transform: "translate3d(-"+pos+"px,0,0)"
                //'transform': 'translateZ(0) translateX(-' + pos + 'px)'
            }, {
                duration: .3,
                //useTransition:true,
                //easing: "ease-out",
                //essing: "easeIn",
                complete: function(){
                    callback();
                }
            });
        },

        //下一帧
        next: function(){
            var self = this,
                index = self.get("index")+1,
                panels = self.get("panels");

            //如果已经是最后一帧则触发theLast事件
            if(index>=panels.length){
                self.fire("theLast");
                return;
            }

            self.switchTo(index);
        },

        //上一帧
        prev: function(){
            var self = this,
                index = self.get("index")-1;

            //如果已经是第一帧则出发theFirst事件
            if(index<0){
                self.fire("theFirst");
                return;
            }

            self.switchTo(index);
        },

        bindNav: function(){
            var self = this,
                activeTriggerCls = self.get("activeTriggerCls"),
                container = self.get("container"),
                triggerPanel = container.all(DOT+self.get("triggerPanelCls")),
                triggerCls = self.get("triggerCls"),
                triggers = container.all(DOT+triggerCls);

            //如果用户自己没有配置trigger，但是配置了triggerPanel
            if(triggers.length==0 && triggerPanel.length>0){
                //这样插入速度快点
                var len = self.get("panels").length, items = [];
                for(var i=0;i<len;i++){
                    items.push('<div class="'+triggerCls+'"></div>');
                }
                triggerPanel.html(items.join(""));
                triggers = triggerPanel.all(DOT+triggerCls);
            }

            triggers.each(function(item,index){
                $(item).on(Event.Gesture.tap, function(ev){
                    self.switchTo(index);
                })
            });

            self.on("afterSwitch",function(ev){
                triggers.removeClass(activeTriggerCls);
                $(triggers[ev.current]).addClass(activeTriggerCls)
            });

            self.set("triggers",triggers);

        },

        //懒加载支持
        lazyLoad: function(panel){
            var self = this;
            var lazyloadCls = self.get("lazyloadCls");
            //暂时只支持textarea的形式
            var datalzayload=panel.all("textarea."+lazyloadCls);
            datalzayload.each( function(item){
                var lazydiv = $("<div class='lazydiv'></div>");
                item.removeClass(lazyloadCls).hide();
                lazydiv.insertBefore(item);
                lazydiv.html(item.val(),true);
                self.fire("datalazyload",{
                    data:item.val(),
                    panel:lazydiv
                });
            });
        }



    }, {ATTRS : /** @lends Responsiveslide*/{

        //容器
        container:{},
        content:{},
        contentWrap:{},
        triggers:{},
        panels:{},

        //内容区域宽度
        width:{},

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
        triggerPanelCls: function(){
            value:""
        },
        //{String} - 默认为 ‘ks-switchable-trigger’, 会在 container 下寻找指定 class 的元素作为触发器.
        triggerCls:{
            value:"ks-trigger"
        },
        activeTriggerCls:{
            value:"ks-active"
        },
        //{String} - 默认为 ‘ks-switchable-panel’, 会在 container 下寻找指定 class 的元素作为面板.
        panelCls:{
            value:"ks-panel"
        },
        panelWrapCls:{
            value:"ks-panel-wrap"
        },
        lazyloadCls: {
            value:"ks-lazyload"
        },
        //是否允许滑动
        touch: {
            value:true
        },

        index: {
            value:0
        }


    }});
    return Responsiveslide;
}, {requires:['node', 'base', 'event']});




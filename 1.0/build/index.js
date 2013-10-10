/*
combined files : 

gallery/responsiveslide/1.0/index

*/
/**
 * @fileoverview 
 * @author 常胤<changyin@taobao.com>
 * @module responsiveslide
 **/
KISSY.add('gallery/responsiveslide/1.0/index',function (S, Node,Base) {
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
    }
    S.extend(Responsiveslide, Base, /** @lends Responsiveslide.prototype*/{

    }, {ATTRS : /** @lends Responsiveslide*/{

    }});
    return Responsiveslide;
}, {requires:['node', 'base']});





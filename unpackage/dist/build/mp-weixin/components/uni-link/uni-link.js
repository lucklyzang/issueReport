(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/uni-link/uni-link"],{"20f4":function(t,n,e){},4266:function(t,n,e){"use strict";var u=e("20f4"),a=e.n(u);a.a},"7c0f":function(t,n,e){"use strict";(function(t){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var e={name:"uniLink",props:{href:{type:String,default:""},text:{type:String,default:""},showUnderLine:{type:[Boolean,String],default:!0},copyTips:{type:String,default:"已自动复制网址，请在手机浏览器里粘贴该网址"},color:{type:String,default:"#999999"},fontSize:{type:[Number,String],default:14}},methods:{openURL:function(){t.setClipboardData({data:this.href}),t.showModal({content:this.copyTips,showCancel:!1})}}};n.default=e}).call(this,e("543d")["default"])},a0b0:function(t,n,e){"use strict";var u,a=function(){var t=this,n=t.$createElement;t._self._c},i=[];e.d(n,"b",(function(){return a})),e.d(n,"c",(function(){return i})),e.d(n,"a",(function(){return u}))},c8c8:function(t,n,e){"use strict";e.r(n);var u=e("7c0f"),a=e.n(u);for(var i in u)"default"!==i&&function(t){e.d(n,t,(function(){return u[t]}))}(i);n["default"]=a.a},f374:function(t,n,e){"use strict";e.r(n);var u=e("a0b0"),a=e("c8c8");for(var i in a)"default"!==i&&function(t){e.d(n,t,(function(){return a[t]}))}(i);e("4266");var r,o=e("f0c5"),c=Object(o["a"])(a["default"],u["b"],u["c"],!1,null,"2d1d5d28",null,!1,u["a"],r);n["default"]=c.exports}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/uni-link/uni-link-create-component',
    {
        'components/uni-link/uni-link-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("f374"))
        })
    },
    [['components/uni-link/uni-link-create-component']]
]);

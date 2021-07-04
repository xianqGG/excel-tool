import{m as e,e as t,a as r,q as n,r as a,u as c,b as l,c as s,R as i,S as o,d as u,T as m,L as p,W as d,f,C as g,I as h,g as E,w as x,x as w,t as y,h as v,i as b,j as S,G as _}from"./vendor.3ad4f78c.js";const k={error:[]},C={error:(...e)=>{k.error.push(...e),console.warn(...e)},cache:k},I=/\-|至/,R=/（单号）/,M=/（双号）/,T=/（(\d+)个）/,z=/^\d+$/,D=/、|，/,A=/(\d+\-\d+)号/;function P(e){return z.test(e)}function j(e=""){const t=[R,M].findIndex((t=>{const r=t.test(e);return e=e.replace(t,""),r}))+1;let r=0;try{r=+e.match(T)[1],e=e.replace(T,"")}catch(m){r=0}if(r)return Array(r).fill(e);if(A.test(e))return[e];if(!I.test(e))return[e];const[n,a]=e.split(I);if(P(n)&&P(a)&&+n>=+a)return[e];const c=new RegExp(a.replace(/\d+/,"(\\d+)")),[l,s]=[c.exec(n),c.exec(a)];if(!l||!s)return C.error("解析错误：",{start:n,end:a,val:e,matchReg:c}),[];const[i,o]=[+l[1],+s[1]],u=[];for(let p=i;p<=o;p++)t&&p%2!=t%2||u.push(n.replace(c,((e,t)=>e.replace(t,p+""))));return u}function L(e,t){const r=/(\d+)号/;return A.test(t)?[e,t]=[e+t.replace(A,""),A.exec(t)[1]]:r.test(t)&&([e,t]=[e+t.replace(r,""),r.exec(t)[1]]),[e=e.replace(/(\d+)组/,((e,t)=>e.replace(t,function(e){var t=["零","一","二","三","四","五","六","七","八","九"],r=["","万","亿","万亿","亿亿"],n=["","十","百","千"];function a(e){for(var r="",a="",c=0,l=!0;e>0;){var s=e%10;0===s?l||(l=!0,a=t[s]+a):(l=!1,r=t[s],a=(r+=n[c])+a),c++,e=Math.floor(e/10)}return a}var c=0,l="",s="",i=!1;if(0===e)return t[0];for(;e>0;){var o=e%1e4;i&&(s=t[0]+s),l=a(o),s=(l+=0!==o?r[c]:r[0])+s,i=o<1e3&&o>0,e=Math.floor(e/1e4),c++}return s.replace(/^一十/,"十")}(+t)))),t]}function q(e){return function(e){if("string"!=typeof e||!e)return[];e=e.trim();const[t,r]=e.split("：");return r?r.split(D).reduce(((e,t)=>[...e,...j(t)]),[]).map((e=>[t,e])):(C.error(`格式不匹配跳过：【${e}】`),[])}(e).map((([e,t])=>L(e,t)))}function F(e){localStorage.setItem("my_uid",e)}function B(){return F("")}function G(r){return e(r).toString(t)}window.___md5=G;const N=new r.Query("access_ids");async function Q(e){e=G(e);const t=await N.equalTo("hashId",e).first();if(!t)return null;const r=+new Date(t.get("expire"));return r&&r<Date.now()?null:{uid:t.get("hashId"),expire:r}}const U=()=>{const[e,t]=a.exports.useState("");return i.createElement(u,{block:!0,direction:"vertical",spacing:"s5"},i.createElement(h,{multiline:!0,minRows:5,value:e,width:"100%",onChange:e=>t(e.target.value),placeholder:"请输入需要被解析的内容"}),i.createElement(m.Paragraph,{fontSize:"s1",color:"assistant"},"解析样例：复兴路：2-1、5；复兴村：19号、25号；新乐街：1号-165号（单号）；新乐街：2号-230号（双号）；沫江社区：33幢1号-16号、34幢1号-13号（单号）、35幢2号-8号（双号）；永丰村：1组1号、2组69号、3组1号-19号；太平社区：1-1（44个）、1-2（30个）；永丰村1组1号-41号，2组1号-69号，3组1号-42号，4组1号-38号，5组1号-53号，6组1号-70号；喻坝村1组1号至7号，2组1号至47号，3组1号至81号，4组1号至53号，5组1号至94号，6组1号至111号；临江路南段2号、4号、42号、福禄大街北段28号、30号、向阳路南段1号-65号、福兴街34号附1号-附130号、福禄大街南段27号附1号-附100号、新政街25号附1号-附100号、福兴街33号附1号-附40号；幸福路7号、幸福路62号、幸福路72号、兴贸街56号、明珠街1号、明珠街3号、明珠街34号、明珠街36号；龙泉街：1号、3号、4号、6号、7号、8号、10号、12号、14号-45号、47号、49号-87号（单号）；"),i.createElement("div",null,i.createElement(d,{type:"primary",autoLoading:!0,onClick:async()=>{await x.time(100);const t=e.trim().split("；").reduce(((e,t)=>(e.push(...q(t).map((e=>({"名称":e[0],"号码":e[1]})))),e)),[]),r=C.cache.error.map((e=>JSON.stringify(e))).join("\n");C.cache.error.length=0,t[0]&&(t[0].错误信息=r);const n=w.utils.json_to_sheet(t,{header:["名称","号码","错误信息"]}),a=w.utils.book_new();w.utils.book_append_sheet(a,n),w.writeFile(a,"out.xlsx")}},"生成 Excel")))},$=(()=>{try{for(let e of navigator.userAgentData.brands)if("Chromium"==e.brand)return!0;return!1}catch(e){return!1}})();function H(){const[e,t]=a.exports.useState(null),r=a.exports.useRef(),{loading:n}=c((()=>Q(function(){try{return(localStorage.getItem("my_uid")||"").trim()}catch(e){return""}}()).catch((()=>null)).then((e=>{e?t(e):B()})))),{retry:x,loading:w}=l((async()=>{const e=r.current.value.trim();if(e)try{const r=await Q(e);if(!r)return y.error("无效的序列码");t(r),F(e)}catch(n){y.error("查询失败请重试")}})),v=s((()=>e&&e.expire&&e.expire<Date.now()?(y.warning("已截止有效期"),t(null),void B()):setTimeout(v,1e3)));return a.exports.useEffect((()=>{const e=v();return()=>{clearTimeout(e)}}),[e]),i.createElement(o,{spinning:n||w},i.createElement(J,null,i.createElement(u,{direction:"vertical",spacing:"s8",block:!0},i.createElement(m.Title,null,"门楼牌清单数据自动分解 ",i.createElement(m.Text,{color:"text",fontSize:"s3"},"有偿代做：网页开发、软件定制、Excel数据处理、PS修图、CDR排版;")),!$&&i.createElement(m.Paragraph,{color:"assistant",fontSize:"s2"},"推荐使用 Chromium 内核的浏览器来打开本站点，推荐新版的",i.createElement(p,{href:"https://www.microsoft.com/en-us/edge",target:"_blank",style:{verticalAlign:"baseline"}},"Edge 浏览器"),"或",i.createElement(p,{href:"https://www.google.cn/intl/zh-CN/chrome",target:"_blank",style:{verticalAlign:"baseline"}},"Chrome 浏览器"),"。"),e?i.createElement(i.Fragment,null,i.createElement(u,{block:!0,direction:"vertical",spacing:"s8"},i.createElement(u,{spacing:"s6"},i.createElement(m.Paragraph,{fontSize:"s2"},"有效期至：",e.expire?new Date(e.expire).toLocaleString():"永久有效"),i.createElement(d,{size:"s",onClick:()=>{B(),t(null)}},"重置序列码")),i.createElement(U,null))):i.createElement(f,{align:"middle",gutter:10},i.createElement(g,{span:10,sm:12,xs:18},i.createElement(h,{width:"100%",placeholder:"请输入序列码",inputRef:r,maxLength:32,limit:32,onPressEnter:x})),i.createElement(g,{span:4,sm:4,xs:6},i.createElement(d,{type:"primary",onClick:x},"验证"))),i.createElement(f,{justify:"center"},i.createElement("div",null,i.createElement(E,{component:"img",src:"./assets/qrcode.fddb5e33.png",suffix:"off",style:{marginTop:100,borderRadius:4},width:200,height:200}),i.createElement(m.Paragraph,{style:{textAlign:"center"},marginTop:12,fontSize:"s3"},"扫一扫，加微信"))))))}const J=n.div`
  width: 1080px;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 30px;
`;r.init({appId:"cb4IEhttbM3bmeUHuoVMc49C-MdYXbMMI",appKey:"kLnUa0sg5DEkIaGsvRAlQ5x3"}),v.render(i.createElement(i.StrictMode,null,i.createElement(b,{theme:S()},i.createElement(i.Fragment,null,i.createElement(_,{resetScrollBar:!0}),i.createElement(H,null)))),document.getElementById("root"));

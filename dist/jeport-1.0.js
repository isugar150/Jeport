var Jeport=function(e,t){var n;if(this.el=e,this.options=t,!e){console.error("Element is required for Jeport");return}let l={showPageNumbers:!1,watermark:{enabled:!1,image:void 0},...t},r=297;function o(e=!1){let t=document.createElement("div");if(t.className="_jeport_page",e||(t.style.padding="20mm"),l.watermark.enabled&&l.watermark.image){let n=document.createElement("div");n.className="_jeport_watermark";let r=document.createElement("img");r.src=l.watermark.image,n.appendChild(r),t.appendChild(n)}return t}function i(e,t){let l=e.cloneNode(!0);if(t.appendChild(l),t.scrollHeight>r){t.removeChild(l);let i=o();return(n.appendChild(i),e.nodeType===Node.TEXT_NODE)?function e(t,n,l){let o=t.textContent.split("\n"),i="",a="";for(let d=0;d<o.length;d++){let p=i+o[d]+"\n",m=document.createElement("span");if(m.textContent=p,n.appendChild(m),n.scrollHeight<=r)i=p,n.removeChild(m);else{a=o.slice(d).join("\n"),n.removeChild(m);break}}return(i&&n.appendChild(document.createTextNode(i.trim())),a)?(l.appendChild(document.createTextNode(a.trim())),l):n}(e,t,i):"TABLE"===e.tagName?function e(t,l,i){let d=t.cloneNode(!0),p=d.querySelector("thead"),m=d.querySelector("tbody");if(!p||!m)return a(t,l,i);let s=d.cloneNode(!1),h=!0,c=document.createElement("tbody");s.appendChild(c),l.appendChild(s);let g=Array.from(m.rows);for(let f=0;f<g.length;f++){let u=g[f].cloneNode(!0);h&&0===f&&s.insertBefore(p.cloneNode(!0),c),c.appendChild(u),l.scrollHeight>r&&(c.removeChild(u),0===c.rows.length&&l.removeChild(s),i=o(),n.appendChild(i),l=i,s=d.cloneNode(!1),c=document.createElement("tbody"),s.appendChild(c),l.appendChild(s),h=!1,f--)}return l}(e,t,i):a(e,t,i)}return t}function a(e,t,l){let o=e.cloneNode(!1);t.appendChild(o);let a=t;for(let d of e.childNodes)a=a.scrollHeight>r?i(d,l):i(d,a);return l&&""===l.textContent.trim()?(n.removeChild(l),t):a}this.init=function(t){(n=document.createElement("div")).className="_jeport_print-content",n.style.height="auto",e.parentNode.appendChild(n),n.innerHTML="";let a=o();return n.appendChild(a),r=a.clientHeight,function e(t,l){for(let r of t.childNodes)(r.nodeType===Node.ELEMENT_NODE||r.nodeType===Node.TEXT_NODE&&""!==r.textContent.trim())&&(l=i(r,l));let o=n.getElementsByClassName("_jeport_page");for(let a=o.length-1;a>=0;a--){let d=o[a].textContent.trim(),p=o[a].querySelector("img:not(.watermark img)"),m=!p&&d===(o[a].querySelector("._jeport_page-number")?.textContent||"").trim();(""===d||m)&&n.removeChild(o[a])}}(e,a),l.showPageNumbers&&function e(){let t=n.getElementsByClassName("_jeport_page"),l=t.length;for(let r=0;r<l;r++){let o=document.createElement("div");o.className="_jeport_page-number",o.textContent=`${r+1}/${l}`,t[r].appendChild(o)}}(),e.style.display="none",n.style.display="block",t(),this},this.print=function(){return setTimeout(function(){window.print()},250),this}};window.onload=function(){let e=document.getElementsByTagName("header")[0];if(e){let t=document.getElementsByTagName("body")[0];t.style.marginTop=`${e.clientHeight}px`}},window.onbeforeprint=function(){var e=document.createElement("style");e.innerHTML="@page { size: auto; margin: 0mm; }",document.head.appendChild(e)},window.onafterprint=function(){let e=document.getElementsByClassName("page");if(e.length>0){let t=e[e.length-1];t.offsetHeight<10&&t.remove()}};
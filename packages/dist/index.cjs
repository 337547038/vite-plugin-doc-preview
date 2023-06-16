/**
 * name: vite-plugin-doc-preview
 * version: 0.2.0
 */
"use strict";var M=Object.create;var $=Object.defineProperty;var T=Object.getOwnPropertyDescriptor;var U=Object.getOwnPropertyNames;var V=Object.getPrototypeOf,_=Object.prototype.hasOwnProperty;var z=(e,n)=>{for(var r in n)$(e,r,{get:n[r],enumerable:!0})},P=(e,n,r,t)=>{if(n&&typeof n=="object"||typeof n=="function")for(let s of U(n))!_.call(e,s)&&s!==r&&$(e,s,{get:()=>n[s],enumerable:!(t=T(n,s))||t.enumerable});return e};var y=(e,n,r)=>(r=e!=null?M(V(e)):{},P(n||!e||!e.__esModule?$(r,"default",{value:e,enumerable:!0}):r,e)),G=e=>P($({},"__esModule",{value:!0}),e);var N={};z(N,{default:()=>L});module.exports=G(N);var R=require("marked"),j=y(require("crypto"),1),O=y(require("path"),1),k=y(require("highlight.js"),1),E=y(require("esbuild"),1),S=/Virtual[a-zA-Z0-9]{8}\.(vue|tsx)$/;function K(e){return"Virtual"+j.default.createHash("sha256").update(e).digest("hex").substring(0,8)}var b=(e,n,r)=>{let t;try{t=k.default.highlight(e,{language:n}).value}catch{t=k.default.highlight(e,{language:"xml"}).value}return t=H(t,r),r&&(t=t.replace(/\n/g,"<br/>")),`
<pre class="language-${n}"><code class="hljs">${t}</code></pre>
`},H=(e,n)=>e.replace(/{/g,"&#123;").replace(/}/g,"&#125;");function L(e){let n=e?.marked||{},r=e?.previewId||"vue preview",t=e?.mode==="react",s=t?".tsx":".vue",v={};return{name:"vite:vueDocPreview",enforce:"pre",configResolved(p){},resolveId(p){if(S.test(p))return p},load(p){if(S.test(p)){let l=O.default.basename(p,s).replace(/^.*?\.md\./g,"");return setTimeout(()=>{delete v[l]}),v[l]}},transform(p,w){if(w.endsWith(".md")){let l="",i="",A={gfm:!0,...n},m={},C={},g=R.marked.lexer(p,A);g.forEach((a,c)=>{let{type:u,lang:x,text:o,block:B}=a;if(u==="code"&&x===r){let d=K(o);t?m={type:"html",text:`
<ReactPreview code="${encodeURIComponent(o)}">
                       <${d}/>
                       ${b(o,"jsx",t)}
                     </ReactPreview>
`}:m={type:"html",text:`
<code-preview code="${encodeURIComponent(o)}">
                       <${d}/>
                       <template #code>${b(o,"xml")}</template>
                     </code-preview>
`},g.splice(c,1,m),v[d]=o,C[d]=o}else if(u==="html"&&B&&!t){m={type:"space",text:`

`};let d=/<script[^>]*>([^<]|<(?!\/script))*<\/script>/,D=/<style[^>]*>([^<]|<(?!\/style))*<\/style>/;d.test(o)&&(i||(i=o),g.splice(c,1,m)),D.test(o)&&(l||(l=o),g.splice(c,1,m))}else u==="code"&&g.splice(c,1,{type:"html",text:b(o,x,t)})});let I=H(R.marked.parser(g)),f=[];t?e?.component?f.push(`import ReactPreview from "${e.component}"`):f.push('import ReactPreview from "vite-plugin-doc-preview/component/react"'):e?.component||f.push('import CodePreview from "vite-plugin-doc-preview/component/index"');for(let a in C)f.push(`import ${a} from "${w}.${a}${s}"`);let h=`${f.join(`
`)}
`;if(t){let a=`import React from 'react'

            ${h}
          export default ()=>{
             return (<div class="marked-body">${I}</div>)
             }`;return{code:E.default.transformSync(a,{loader:"tsx",target:"esnext",treeShaking:!0}).code,map:null}}if(i){let a=new RegExp("(?<=<script)(.*?)(?=>)","gi"),c=i.match(a);if(c&&c.toString().includes("setup"))i=i.replace("</script>",`${h}</script>`);else{let u="";try{u=" "+c.toString().match(/lang="(.*?)"/i)[0]}catch{}i+=`
<script setup${u}>${h}</script>`}}else i=`<script setup>${h}</script>`;return`<template><div class="marked-body">${I}</div></template>

                ${i}

                ${l}`}},closeBundle(){v={}}}}

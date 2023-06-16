/**
 * name: vite-plugin-doc-preview
 * version: 0.2.1
 */
import{marked as R}from"marked";import O from"crypto";import E from"path";import k from"highlight.js";import H from"esbuild";var C=/Virtual[a-zA-Z0-9]{8}\.(vue|tsx)$/;function A(t){return"Virtual"+O.createHash("sha256").update(t).digest("hex").substring(0,8)}var w=(t,g,d)=>{let e;try{e=k.highlight(t,{language:g}).value}catch{e=k.highlight(t,{language:"xml"}).value}return e=I(e,d),d&&(e=e.replace(/\n/g,"<br/>")),`
<pre class="language-${g}"><code class="hljs">${e}</code></pre>
`},I=(t,g)=>t.replace(/{/g,"&#123;").replace(/}/g,"&#125;");function V(t){let g=t?.marked||{},d=t?.previewId||"vue preview",e=t?.mode==="react",h=e?".tsx":".vue",f={};return{name:"vite:vueDocPreview",enforce:"pre",configResolved(s){},resolveId(s){if(C.test(s))return s},load(s){if(C.test(s)){let c=E.basename(s,h).replace(/^.*?\.md\./g,"");return setTimeout(()=>{delete f[c]}),f[c]}},transform(s,$){if($.endsWith(".md")){let c="",r="",P={gfm:!0,...g},p={},x={},a=R.lexer(s,P);a.forEach((i,o)=>{let{type:l,lang:y,text:n,block:S}=i;if(l==="code"&&y===d){let m=A(n);e?p={type:"html",text:`
<ReactPreview code="${encodeURIComponent(n)}">
                       <${m}/>
                       ${w(n,"jsx",e)}
                     </ReactPreview>
`}:p={type:"html",text:`
<code-preview code="${encodeURIComponent(n)}">
                       <${m}/>
                       <template #code>${w(n,"xml")}</template>
                     </code-preview>
`},a.splice(o,1,p),f[m]=n,x[m]=n}else if(l==="html"&&S&&!e){p={type:"space",text:`

`};let m=/<script[^>]*>([^<]|<(?!\/script))*<\/script>/,j=/<style[^>]*>([^<]|<(?!\/style))*<\/style>/;m.test(n)&&(r||(r=n),a.splice(o,1,p)),j.test(n)&&(c||(c=n),a.splice(o,1,p))}else l==="code"&&a.splice(o,1,{type:"html",text:w(n,y,e)})});let b=I(R.parser(a)),u=[];e?t?.component?u.push(`import ReactPreview from "${t.component}"`):u.push('import ReactPreview from "vite-plugin-doc-preview/component/react"'):t?.component||u.push('import CodePreview from "vite-plugin-doc-preview/component/index"');for(let i in x)u.push(`import ${i} from "${$}.${i}${h}"`);let v=`${u.join(`
`)}
`;if(e){let i=`import React from 'react'

            ${v}
          export default ()=>{
             return (<div class="marked-body">${b}</div>)
             }`;return{code:H.transformSync(i,{loader:"tsx",target:"esnext",treeShaking:!0}).code,map:null}}if(r){let i=new RegExp("(?<=<script)(.*?)(?=>)","gi"),o=r.match(i);if(o&&o.toString().includes("setup"))r=r.replace("</script>",`${v}</script>`);else{let l="";try{l=" "+o.toString().match(/lang="(.*?)"/i)[0]}catch{}r+=`
<script setup${l}>${v}</script>`}}else r=`<script setup>${v}</script>`;return`<template><div class="marked-body">${b}</div></template>

                ${r}

                ${c}`}},closeBundle(){f={}}}}export{V as default};

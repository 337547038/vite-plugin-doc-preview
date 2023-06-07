
const isVirtualModule = (id: string) => {
  return /@virtual/.test(id)
};
export default ()=>{
  let vuePlugin
  return {
    name: "vite:argo-vue-docs",
    resolveId(id) {

    },
    load(id) {
      // 遇到虚拟md模块，直接返回缓存的内容

    },
    async transform(code: string, id: string) {

    },
  }
}

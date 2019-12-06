
export default {
  install(Vue) {
    Vue.prototype.$formRules = this;
    Vue.formRules = this;
  },
  blur(title) {
    return { required: true, message: "请输入" + title, trigger: "blur" }
  }
}

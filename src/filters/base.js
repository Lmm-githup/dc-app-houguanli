import Vue from 'vue'

Vue.filter('gender', v => v == 1 ? '男' : '女')

Vue.filter('visibleStatus', v => v == 1 ? '可见' : '不可见')

Vue.filter('yesOrNo', v => v == 1 ? '是' : '否')

Vue.filter('effectStatus', v => v == 1 ? '正常' : '禁用')

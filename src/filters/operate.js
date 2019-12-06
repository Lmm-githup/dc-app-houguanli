import Vue from 'vue'

Vue.filter('usableStatus', function (v, isOperate) {
  if (!isOperate) {
    return v == 1 ? '正常' : '冻结';
  }
  return v == 1 ? '冻结' : '解冻';
})

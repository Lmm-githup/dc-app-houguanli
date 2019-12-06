import Vue from 'vue'

Vue.filter('orderStatus', function (v) {
  switch (v) {
    case 'P':
      return '审批中';
    case 'Y':
      return '审批通过';
    case 'N':
      return '审批拒绝';
    case 'D':
      return '制单';

    default:
      return v;
  }
})

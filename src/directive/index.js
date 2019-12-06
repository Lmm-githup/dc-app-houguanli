import Vue from 'vue'

Vue.directive('leaveBtn', {
  inserted(el) {
    el.addEventListener('mouseleave', el.blur);
  }
})

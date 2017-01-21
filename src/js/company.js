import Vue from 'vue'
import Company from './app/Company'

// for debugging
if (process.env.NODE_ENV !== 'production') Vue.config.debug = true

new Vue({
  el: '#app',
  render: h => h(Company)
})

console.log('this is Company page');


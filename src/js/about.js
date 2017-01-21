import Vue from 'vue'
import About from './app/About'

// for debugging
if (process.env.NODE_ENV !== 'production') Vue.config.debug = true

new Vue({
  el: '#app',
  render: h => h(About)
})

console.log('this is about page');


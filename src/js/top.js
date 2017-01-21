import Vue from 'vue'
import App from './app/Top'

// for debugging
if (process.env.NODE_ENV !== 'production') Vue.config.debug = true

new Vue({
  el: '#app',
  render: h => h(App)
})

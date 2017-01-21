<template>
  <div id="app">
    <h1>company</h1>
    <weeo-header></weeo-header>
  </div>
</template>

<script>
import WeeoHeader from './../components/WeeoHeader'
export default {
  name: 'app',
  components: {
    WeeoHeader
  },
}
</script>

<style lang="stylus">
body
  margin: 0
  padding: 0
</style>

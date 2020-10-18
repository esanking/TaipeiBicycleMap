<template>
  <div id="app">
    <Map />
  </div>
</template>

<script>
import Map from './view/Map.vue';

export default {
  name: 'App',
  components: {
    Map,
  },
};
</script>

<style lang="scss">
@import "./assets/all";
</style>

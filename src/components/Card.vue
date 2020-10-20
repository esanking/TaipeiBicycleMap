<template>
  <div>
    <div class="card w-100" @click="setFocus">
      <div class="card-body">
        <h5 class="card-title">{{ store.sna }}</h5>
        <h6 class="card-subtitle mb-2 text-muted">{{ store.sarea }}</h6>
        <div class="card-text my-3">
          <span>總共車位 {{ store.tot }}</span>
          <br>
          <span>可借車位 {{ store.sbi }}</span>
          <br>
          <span>可還車空位 {{ store.bemp }}</span>
        </div>
        <p>
          <i class="fas fa-home mr-2"></i>
          <a :href="getHref(store.ar)" class="card-link">{{ store.ar }}</a>
        </p>
        <p>
          更新時間 {{ store.time }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: ['store'],
  data() {
    return {};
  },
  methods: {
    getHref(address) {
      return `https://www.google.com.tw/maps/place/${address}`;
    },
    setFocus() {
      this.$emit('witchCard', this.store);
    },
  },
};
</script>

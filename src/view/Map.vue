<template>
  <div class="wrap d-flex">
    <div class="mapLeft col-md-3">
      <div class="row toolBox bg-primary d-flex justify-content-center">
        <div class="w-100 header bg-info" style="height: 200px;">
          <h3 class=" text-white">腳踏車地圖</h3>
          <div class="townSelect w-75">
            <select class=" custom-select" @change="fliterTown" name="" id="">
              <option value="選擇區域" selected disabled>
                選擇區域</option>
              <option :value="item" v-for="(item, key) in town" :key="key"
               :data-foo="item">
                {{ item }}</option>
            </select>
          </div>
          <p class="h5 w-100 text-white text-right px-2">總筆數 : {{ fltdData.length }} 筆</p>
        </div>
        <div class="cardGroup">
          <Card v-for="item in fltdData" :key="item.sno" :store="item"
           @witchCard="goWitchCard" class="my-2">
          </Card>
        </div>
      </div>
    </div>
    <div id="app" class="col-md-9">
      <!-- 初始化地圖設定 -->
      <div class="row">
        <l-map
          ref="myMap"
          :zoom="zoom"
          :center="center"
          :options="options"
          style="height: 100vh"
        >
          <!-- 載入圖資 -->
          <l-tile-layer :url="url" :attribution="attribution" />

          <!-- 自己所在位置 -->
          <l-marker ref="location" :lat-lng="center">
            <l-icon
              :icon-url="icon.type.black"
              :shadow-url="icon.shadowUrl"
              :icon-size="icon.iconSize"
              :icon-anchor="icon.iconAnchor"
              :popup-anchor="icon.popupAnchor"
              :shadow-size="icon.shadowSize"
            />
          </l-marker>
          <!-- 創建標記點 -->
          <l-marker :lat-lng="[item.lat, item.lng]" v-for="item in fltdData" :key="item.sno"
              @click="goWitchCard(item)">
            <!-- 標記點樣式判斷 -->
            <l-icon
              :icon-url="item.sna === store.sna ? icon.type.gold : icon.type.black"
              :shadow-url="icon.shadowUrl"
              :icon-size="icon.iconSize"
              :icon-anchor="icon.iconAnchor"
              :popup-anchor="icon.popupAnchor"
              :shadow-size="icon.shadowSize"
            />
            <!-- 彈出視窗 -->
            <l-popup>
              站別 {{ item.sna }}
              <br>
              可借車位數 {{ item.sbi }}
              <br>
              可還空位數 {{ item.bemp }}
              <br>
              地址 {{ item.ar}}
            </l-popup>
          </l-marker>
        </l-map>
      </div>
    </div>
  </div>
</template>

<script>
import 'leaflet.markercluster';
import Card from '@/components/Card.vue';

export default {
  name: 'Map',
  components: {
    Card,
  },
  data() {
    return {
      // 模擬資料
      data: [],
      town: [],
      fltTown: [],
      store: [],
      fltdData: [],

      zoom: 13,
      center: [24.99116, 121.53398],
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: 'Map data ©<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>|Created by <a href="https://github.com/fan630?tab=repositories" target="_blank">fan630</a>',
      options: {
        zoomControl: false,
      },
      icon: {
        type: {
          black:
            'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
          gold:
            'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
        },
        shadowUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      },
    };
  },
  methods: {
    goWitchCard(store) {
      this.center = [store.lat, store.lng];
      this.store = store;
    },
    fliterTown(e) {
      // this.data = this.data.filter((item) => item.sarea === city);
      if (e.target.options.selectedIndex > -1) {
        this.fltTown = e.target.options[e.target.options.selectedIndex].dataset.foo;
        console.log(this.fltTown);
      }
      this.fltdData = this.data.filter((item) => item.sarea === this.fltTown);
      this.center = [this.fltdData[0].lat, this.fltdData[0].lng];
    },
    // getData() {
    //   const cors = 'https://cors-anywhere.herokuapp.com/';
    //   const url = 'https://data.ntpc.gov.tw/api/datasets/71CD1490-A2DF-4198-BEF1-318479775E8A/json/preview';
    //   // const url = 'https://api.kcg.gov.tw/api/service/get/897e552a-2887-4f6f-a6ee-709f7fbe0ee3';
    //   // const url = 'http://tbike-data.tainan.gov.tw/Service/StationStatus/Json'
    //   this.$http.get(`${cors}${url}`)
    //     .then((res) => {
    //       console.log(res);
    //       this.data = res.data;
    //       console.log(this.data);
    //       res.data.forEach((item) => this.city.push(item.sarea));
    //       this.city = this.city.filter((item, index) => this.city.indexOf(item) === index);
    //       console.log(this.city);
    //     })
    //     .catch((req) => {
    //       console.log(req);
    //     });
    // },
  },
  mounted() {
    const cors = 'https://cors-anywhere.herokuapp.com/';
    const url = 'https://data.ntpc.gov.tw/api/datasets/71CD1490-A2DF-4198-BEF1-318479775E8A/json/preview';
    // const url = 'https://api.kcg.gov.tw/api/service/get/897e552a-2887-4f6f-a6ee-709f7fbe0ee3';
    // const url = 'http://tbike-data.tainan.gov.tw/Service/StationStatus/Json'
    this.$http.get(`${cors}${url}`)
      .then((res) => {
        console.log(res);
        this.data = res.data;
        res.data.forEach((item, index) => {
          this.data[index].time = `${item.mday.slice(8, 10)} : ${item.mday.slice(10, 12)}
         : ${item.mday.slice(12, 14)}`;
        });
        res.data.forEach((item) => this.town.push(item.sarea));
        this.town = this.town.filter((item, index) => this.town.indexOf(item) === index);
        console.log(this.town);
        console.log(this.data);
      })
      .catch((req) => {
        console.log(req);
      });
  },
  created() {
  },
};
</script>

<style lang="scss">
html,
body {
  padding: 0;
  margin: 0;
}
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
}
.toolBox {
  overflow-y: auto;
  height: 100vh;
}
</style>

<template>
  <div class="wrap d-flex">
    <div class="mapLeft col-md-3">
      <div class="row toolBox bg-primary">
        <div class="sticky-top">
          <div class="townSelect ml-5">
            <select class=" custom-select" name="" id="">
              <option selected>選擇區域</option>
              <option :value="item" v-for="(item, key) in city" :key="key">
                {{ item }}</option>
            </select>
          </div>
        </div>
        <div class="cardGroup">
          <Card v-for="item in data" :key="item.sno" :store="item">
          </Card>
        </div>
      </div>
    </div>
    <div id="app" class="col-md-9">
      <!-- 初始化地圖設定 -->
      <l-map
        ref="myMap"
        :zoom="zoom"
        :center="center"
        :options="options"
        style="height: 100vh"
        class="row"
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
          <l-popup> 你的位置 </l-popup>
        </l-marker>
        <!-- 創建標記點 -->
        <l-marker :lat-lng="[item.lat, item.lng]" v-for="item in data" :key="item.sno">
          <!-- 標記點樣式判斷 -->
          <l-icon
            :icon-url="item.sna === '大鵬華城' ? icon.type.gold : icon.type.black"
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
      city: [],

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
    // 等地圖創建後執行
    this.$nextTick(() => {
      // 獲得目前位置
      navigator.geolocation.getCurrentPosition((position) => {
        const p = position.coords;
        // 將中心點設為目前的位置
        this.center = [p.latitude, p.longitude];
        // 將目前的位置的標記點彈跳視窗打開
        this.$refs.location.mapObject.openPopup();
      });
    });
    const cors = 'https://cors-anywhere.herokuapp.com/';
    const url = 'https://data.ntpc.gov.tw/api/datasets/71CD1490-A2DF-4198-BEF1-318479775E8A/json/preview';
    // const url = 'https://api.kcg.gov.tw/api/service/get/897e552a-2887-4f6f-a6ee-709f7fbe0ee3';
    // const url = 'http://tbike-data.tainan.gov.tw/Service/StationStatus/Json'
    this.$http.get(`${cors}${url}`)
      .then((res) => {
        console.log(res);
        this.data = res.data;
        res.data.forEach((item, index) => {
          this.data[index].mday = `${item.mday.slice(8, 10)} : ${item.mday.slice(10, 12)}
         : ${item.mday.slice(12, 14)}`;
          console.log(this.data);
        });
        res.data.forEach((item) => this.city.push(item.sarea));
        this.city = this.city.filter((item, index) => this.city.indexOf(item) === index);
        console.log(this.city);
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
.toolBox {
  overflow-y: auto;
  height: 100vh;
}
</style>

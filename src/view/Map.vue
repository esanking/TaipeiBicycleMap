<template>
  <div class="wrap d-flex">
    <Loading :active.sync="isLoading">
      <i class="fas fa-biking fa-spin fa-3x"></i>
      <div class="mt-3"><b>Loading ...</b></div>
    </Loading>
    <div class="mapLeft bg-primary">
      <div class=" toolBox  d-flex justify-content-center flex-wrap">
        <div class="w-100 header bg-info " style="height: 200px;">
          <h3 class=" text-white">TaipeiBicycleMap</h3>
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
    <div id="app" class="w-100 map">
      <!-- 初始化地圖設定 -->
      <div class="icon d-flex justify-content-center align-items-center">
        <i class="fa fa-bars" aria-hidden="true" style="color:#fff; font-size:30px;"></i>
      </div>
      <div>
        <l-map
          ref="myMap"
          :zoom="zoom"
          :center="center"
          :options="options"
          style="height: 100vh"
        >
          <!-- 載入圖資 -->
          <l-tile-layer :url="url" :attribution="attribution" />

          <!-- 中心點 -->
          <l-marker ref="location" :lat-lng="center">
          </l-marker>
          <!-- 創建標記點 -->
          <l-marker :lat-lng="[item.lat, item.lng]" v-for="item in fltdData" :key="item.sno"
              @click="goWitchCard(item)">
            <!-- 標記點樣式判斷 -->
            <l-icon
              :icon-url="item.sna === store.sna ? icon.type.gold : icon.type.black"
              :icon-size="icon.iconSize"
              :icon-anchor="icon.iconAnchor"
              :popup-anchor="icon.popupAnchor"
            />
            <!-- 彈出視窗 -->
            <l-popup>
              站別 {{ item.sna }}
              <br>
              可借車位數 {{ item.sbi }}
              <br>
              可還空位數 {{ item.bemp }}
              <br>
              地址 <a :href="getHref(item.ar)">{{ item.ar}} </a>
            </l-popup>
          </l-marker>
        </l-map>
      </div>
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card.vue';
import $ from 'jquery';
import Bicycle from '@/assets/img/bicycle.png';
import RunBicycle from '@/assets/img/run_bicycle.png';

export default {
  name: 'Map',
  components: {
    Card,
  },
  data() {
    return {
      isLoading: false,
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
          black: Bicycle,
          gold: RunBicycle,
        },
        iconSize: [50, 50],
        iconAnchor: [12, 41],
        popupAnchor: [10, -40],
      },
    };
  },
  methods: {
    getHref(address) {
      return `https://www.google.com.tw/maps/place/${address}`;
    },
    goWitchCard(store) {
      this.center = [store.lat, store.lng];
      this.store = store;
    },
    fliterTown(e) {
      this.isLoading = true;
      if (e.target.options.selectedIndex > -1) {
        this.fltTown = e.target.options[e.target.options.selectedIndex].dataset.foo;
      }
      this.fltdData = this.data.filter((item) => item.sarea === this.fltTown);
      this.center = [this.fltdData[0].lat, this.fltdData[0].lng];
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    },
    getAddress() {
      this.isLoading = true;
      const cors = 'https://cors-anywhere.herokuapp.com/';
      const url = 'https://data.ntpc.gov.tw/api/datasets/71CD1490-A2DF-4198-BEF1-318479775E8A/json?page=0&size=1000';
      this.$http.get(`${cors}${url}`)
        .then((res) => {
          this.data = res.data;
          res.data.forEach((item, index) => {
            this.data[index].time = `${item.mday.slice(8, 10)} : ${item.mday.slice(10, 12)}
          : ${item.mday.slice(12, 14)}`;
          });
          res.data.forEach((item) => this.town.push(item.sarea));
          this.town = this.town.filter((item, index) => this.town.indexOf(item) === index);
          this.isLoading = false;
        });
    },
  },
  mounted() {
    $('.icon').click(() => {
      $('body').toggleClass('open');
    });
  },
  created() {
    this.getAddress();
  },
};
</script>

<style lang="scss">
  html,
  body {
    padding: 0;
    margin: 0;
  }
  .mapLeft {
    overflow: hidden;
    transition: all 1s;
    position: absolute !important;
    top: 0;
    left: 0;
    height: 100%;
    width: 25%;
    z-index: 600;
    @media (max-width: 767px) {
      width: 80%;
    }
  }
  .open .mapLeft {
    width: 0;
  }
  .map {
    position: relative;
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
  .cardGroup {
    width: 90%;
  }
  .icon {
    position: absolute;
    top: 50px;
    left: 25%;
    height: 60px;
    width: 60px;
    background-color: #ccc;
    z-index: 600;
    cursor: pointer;
    transition: all 1s;
    @media (max-width: 767px) {
      left: 80%;
    }
  }
  .open .icon {
    left: 0px;
  }
</style>

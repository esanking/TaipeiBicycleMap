module.exports = {
  publicPath: "./",
  devServer: {
    proxy: {
      "/json?page=0&size=1000": {
        target:
          "https://data.ntpc.gov.tw/api/datasets/71CD1490-A2DF-4198-BEF1-318479775E8A/json?page=0&size=1000",
        changeOrigin: true,
        ws: true,
        pathRewrite: { "^/json?page=0&size=1000": "/json?page=0&size=1000" }
      }
    }
  }
};

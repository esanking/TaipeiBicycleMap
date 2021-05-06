module.exports = {
  publicPath: "/",
  // outputDir: "public/live",
  devServer: { //自动打开浏览器
    port: "8080",
    host: "localhost",
    open: true,
    proxy: {
      "/api": {
        target: "https://data.ntpc.gov.tw/api/datasets/71CD1490-A2DF-4198-BEF1-318479775E8A/", //要跨域的域名 目标地址
        changeOrigin: true, //是否开启跨域  是否更改源路径
        ws: true,
        pathRewrite: {
          "^/api": ""  // /api/ / 凡是/api开头的地址都可以跨域
        }
      }
    }
  }
};
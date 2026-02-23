module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        pathRewrite: { "^/api": "/api" }, // 필요 시 경로 유지
      },
      "/uploads": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
};

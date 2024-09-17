const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = {
    devServer: (devServerConfig) => {
        devServerConfig.onBeforeSetupMiddleware = undefined;
        devServerConfig.onAfterSetupMiddleware = undefined;

        devServerConfig.setupMiddlewares = (middlewares, devServer) => {
            if (!devServer) {
                throw new Error("webpack-dev-server is not defined");
            }

            // 프록시 설정 추가
            if (devServer.app) {
                devServer.app.use(
                    "/api",
                    createProxyMiddleware({
                        target: "http://localhost:4000",
                        changeOrigin: true,
                    })
                );
            }

            // 추가적인 미들웨어 설정
            middlewares.unshift((req, res, next) => {
                res.setHeader("Access-Control-Allow-Origin", "*");
                next();
            });

            return middlewares;
        };

        return devServerConfig;
    },
};

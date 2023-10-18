
const { override, addWebpackAlias, addDecoratorsLegacy } = require("customize-cra")
const path = require('path')

module.exports = override(
  addWebpackAlias({
    "frame": path.resolve(__dirname, "./src/frame"),
    "api": path.resolve(__dirname, "./src/api"),
    "assets": path.resolve(__dirname, "./src/assets"),
    "common": path.resolve(__dirname, "./src/common"),
    "render": path.resolve(__dirname, "./src/render"),
    "services": path.resolve(__dirname, "./src/services"),
    "environments": path.resolve(__dirname, "./src/environments"),
    "types": path.resolve(__dirname, "./src/types"),
    "i18n": path.resolve(__dirname, "./src/i18n")
  }),
  addDecoratorsLegacy(), 
)
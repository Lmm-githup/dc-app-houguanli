'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    // baseURL: '"https://kbj.dgb.hnanrui.com/dgb-api"',
    baseURL:'"http://123.57.242.40/dgb-api"',//测试地址
    importStarTempUrl: '"http://123.57.242.40/imp_template_star.xlsx"',
    importGoldTempUrl: '"http://123.57.242.40/imp_template_gold.xlsx"'
    // importStarTempUrl: '"https://kbj.dgb.hnanrui.com/imp_template_star.xlsx"',
    // importGoldTempUrl: '"https://kbj.dgb.hnanrui.com/imp_template_gold.xlsx"'
})

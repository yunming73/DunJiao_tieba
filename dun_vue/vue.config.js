const path = require('path');
module.exports = {
    // configureWebpack: {
    //     externals: {
    //         qc: 'QC'
    //     }
    // }
    devServer: {
        open: true
            // allowedHosts: 'www.corho.com' // 允许访问的域名地址
    },
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [
                path.join(__dirname, './src/assets/styles/variables.less'),
                path.join(__dirname, './src/assets/styles/mixins.less')
            ]
        }
    }
}
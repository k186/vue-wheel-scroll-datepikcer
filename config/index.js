const path=require('path');

module.exports={
    build:{
        env:{
            NODE_ENV:'"production"'
        },
        indexHtml:path.resolve(__dirname,'../dist/index.html'),
        staticRoot:path.resolve(__dirname,'../dist'),
        staticSubDirectory:'static',
        staticPublishPath:'',
        productionSourceMap:false,
    },
    dev:{
        env:{
            NODE_ENV:'"development"'
        },
        port:8080,
        autoOpenBrowser:true,
        staticSubDirectory:'static',
        staticPublishPath:'/',
        proxyTable: {},
        cssSourceMap: true
    }
}

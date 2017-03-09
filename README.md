### vue deatePicker for mobile component

###[demo](http://k186studio.com/demos/vue/mobilePicker/)

###result
![](http://omhgkqaq2.bkt.clouddn.com/mobilepicker1.gif)


###Build Setup
```$xslt
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```
### props config
```$xslt
  valueStr: {
    type: String,
    default: ''
  },
  visible: {
    type: Boolean,
    default: false,
    required: true
  },
  options: {
    type: Object
  }
```

>`valueStr`: the init date value like 2017-3-7 14:50

>`visible`: without use vuex ,so you need control picker visible by yourself

>`selectDay`:callback function

#[example]()

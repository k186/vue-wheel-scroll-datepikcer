<template>
  <div>
    <div class="container clearfloat">
      <div class="row">
        <div class="input" v-on:click="showDatePicker(1)">{{date}}</div>
      </div>
      <div class="row">
        <div class="input" v-on:click="showDatePicker(2)">{{date2}}</div>
      </div>
      <span>时间格式设置说明：
              <br>* d      without 0 &nbsp;&nbsp;&nbsp;  * yy     2016 16
              <br>* dd     with 01   &nbsp;&nbsp;&nbsp;  * yyyy   2016
              <br>* M      without 0 &nbsp;&nbsp;  * h      12am 12pm 1 2
              <br>* MM     with 03   &nbsp;&nbsp;  * hh     12am 12pm 01 02
              <br>* m      minute 1
              <br>* mm     minute 01   &nbsp;&nbsp;  * H  24h 1 2 3 &nbsp;&nbsp;   * HH     24 01 02
              <br>年月日分隔符只能 是 '/' 或者 '- ' 小时分钟 英文冒号':'
            <br> 时间12小时制暂未实现，年份取最后2位暂未实现
        </span>
      <mobile-picker :valueStr="picker.value" :visible="picker.visible" :options="picker.options" v-on:checked="hideDatePicker"></mobile-picker>
    </div>
  </div>
</template>
<script>
  import mobilePicker from '../../components/datepickerMobile/pickerMobile'
  export default{
    name: 'mobilePickerDemo',
    data () {
      return {
        date: '2015-8-13',
        date2: '2016-10-11 20:15',
        options2: {
          format: 'yyyy/M/dd HH:mm',
          startDate: '1992-01-01',
          endDate: '2500-01-01',
          language: 'cn',
          timeRange: 10
        },
        options1: {
          format: 'yyyy/MM/dd',
          startDate: '2000-01-01',
          endDate: '3000-01-01',
          language: 'en',
          timeRange: 25
        },
        picker: {
          value: '',
          visible: false,
          id: '',
          options: {
            format: 'yyyy/MM/dd',
            startDate: '1992-01-01',
            endDate: '2500-01-01',
            language: 'cn',
            timeRange: 10
          }
        }
      }
    },
    methods: {
      showDatePicker (type) {
        if (type === 1) {
          this.picker.visible = true
          this.picker.value = this.date
          this.picker.options = this.options1
          this.picker.id = type
        } else if (type === 2) {
          this.picker.visible = true
          this.picker.id = type
          this.picker.value = this.date2
          this.picker.options = this.options2
        }
      },
      hideDatePicker (date) {
        if (typeof date === 'string') {
          if (this.picker.id === 1) {
            this.date = date
          } else {
            this.date2 = date
          }
        }
        this.picker.visible = false
      }
    },
    components: {
      mobilePicker
    }
  }
</script>
<style>
  @import "../../../static/style/coreCss/reset.scss";

  .clearfloat:after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0
  }

  .clearfloat {
    zoom: 1
  }

  .row {
    height: 1.2rem;
    line-height: 1.2rem;
  }

  .input {
    border-bottom: 1px solid #b3b3b3;
    background: white;
    height: inherit;
    line-height: inherit;
    font-size: .48rem;
    color: #333333;
    text-align: right;
    padding: 0 .2667rem;
    width: 100%;
  }
</style>

<template>
  <transition name="toggle-mask">
    <div class="mobile-mask" v-show="visible">
      <transition name="picker-Toggle">
        <div class="mobile-picker" v-show="visible">
          <div class="picker-control" v-if="!Format.isHour">
            <div class="control-cancel" v-on:click="cancel">{{'Cancel'|btnF(language)}}</div>
            <div class="control-date">
              <span>{{tmpYear}}</span>
              <span>-</span>
              <span>{{Format.month=='MM'&&(tmpMonth+1)<10?0:''}}{{tmpMonth+1}}</span>
              <span>-</span>
              <span>{{Format.day=='dd'&&tmpDay<10?0:''}}{{tmpDay}}</span>
            </div>
            <div class="control-ok" v-on:click="checked">{{'Confirm'|btnF(language)}}</div>
          </div>
          <div class="picker-control" v-if="Format.isHour&&panelType==1">
            <div class="control-cancel" v-on:click="cancel">{{'Cancel'|btnF(language)}}</div>
            <div class="control-date">
              <span>{{tmpYear}}</span>
              <span>-</span>
              <span>{{Format.month=='MM'&&(tmpMonth+1)<10?0:''}}{{tmpMonth+1}}</span>
              <span>-</span>
              <span>{{Format.day=='dd'&&tmpDay<10?0:''}}{{tmpDay}}</span>
              <span>&nbsp;</span>
              <span>{{tmpHour}}</span>
              <span>:</span>
              <span>{{tmpMinute}}</span>
            </div>
            <div class="control-ok" v-on:click="changeType(2)">{{'Next'|btnF(language)}}</div>
          </div>
          <div class="picker-control" v-if="Format.isHour&&panelType==2">
            <div class="control-cancel" v-on:click="changeType(1)">{{'Previous'|btnF(language)}}</div>
            <div class="control-date">
              <span>{{tmpYear}}</span>
              <span>-</span>
              <span>{{Format.month=='MM'&&(tmpMonth+1)<10?0:''}}{{tmpMonth+1}}</span>
              <span>-</span>
              <span>{{Format.day=='dd'&&tmpDay<10?0:''}}{{tmpDay}}</span>
              <span>&nbsp;</span>
              <span>{{tmpHour}}</span>
              <span>:</span>
              <span>{{tmpMinute}}</span>
            </div>
            <div class="control-ok" v-on:click="checked">{{'Confirm'|btnF(language)}}</div>
          </div>
          <div class="picker-panel">
            <div class="panel-box">
              <div class="box-year" v-show="!Format.isHour||Format.isHour&&panelType==1" v-on:touchstart="myTouch($event,'year')" v-on:touchmove="myMove($event,'year')"
                   v-on:touchend="myEnd($event,'year')">
                <div class="check-line"></div>
                <div class="year-checked">
                  <div class="year-list" data-translateY="0" style="transform: translateY(0rem);">
                    <div class="list-div" v-bind:class="{canNotChoose:!validYear(year.value)}" v-for="year in renderListYear" v-bind:data-index="year.index">{{year.value}}{{language=='cn'?'年':''}}
                    </div>
                  </div>
                </div>
                <div class="year-wheel" style="transform: rotate3d(1, 0, 0,0deg);">
                  <div class="wheel-div" v-for="year in renderListYear" v-bind:data-index="year.index"
                       v-bind:style="{transform: 'rotate3d(1, 0, 0, '+ (-year.index)*20%360+'deg) translate3d(0px, 0px, 2.5rem)'}">{{year.value}}{{language=='cn'?'年':''}}
                  </div>
                </div>
              </div>
              <div class="box-month" v-show="!Format.isHour||Format.isHour&&panelType==1" v-on:touchstart="myTouch($event,'month')" v-on:touchmove="myMove($event,'month')"
                   v-on:touchend="myEnd($event,'month')">
                <div class="check-line"></div>
                <div class="month-checked">
                  <div class="month-list" data-translateY="0" style="transform: translateY(0rem)">
                    <div class="list-div" v-bind:class="{canNotChoose:!validMonth(month.value-1)}" v-for="month in renderListMonth" v-bind:data-index="month.index">{{month.value|monthF(language)}}
                    </div>
                  </div>
                </div>
                <div class="month-wheel" style=" transform: rotate3d(1, 0, 0,0deg)">
                  <div class="wheel-div" v-for="month in renderListMonth" v-bind:data-index="month.index"
                       v-bind:style="{transform: 'rotate3d(1, 0, 0, '+ (-month.index)*20%360+'deg) translate3d(0px, 0px, 2.5rem)'}">{{month.value|monthF(language)}}
                  </div>
                </div>
              </div>
              <div class="box-day" v-show="!Format.isHour||Format.isHour&&panelType==1" v-on:touchstart="myTouch($event,'day')" v-on:touchmove="myMove($event,'day')"
                   v-on:touchend="myEnd($event,'day')">
                <div class="check-line"></div>
                <div class="day-checked">
                  <div class="day-list" data-translateY="0" style="transform: translateY(0rem)">
                    <div class="list-div" v-bind:class="{canNotChoose:!validDay(day)}" v-for="day in renderListDay" v-bind:data-index="day.index">
                      {{Format.day=='dd'&&day.value<10?'0':''}}{{day.value}}{{day.value|weekF(tmpYear,tmpMonth,language)}}
                    </div>
                  </div>
                </div>
                <div class="day-wheel" style=" transform: rotate3d(1, 0, 0,0deg)">
                  <div class="wheel-div" v-for="day in renderListDay" v-bind:data-index="day.index"
                       v-bind:style="{transform: 'rotate3d(1, 0, 0, '+ (-day.index)*20%360+'deg) translate3d(0px, 0px, 2.5rem)'}">
                    {{Format.day=='dd'&&day.value<10?'0':''}}{{day.value}}{{day.value|weekF(tmpYear,tmpMonth,language)}}
                  </div>
                </div>
              </div>
              <div class="box-hour" v-show="Format.isHour&&panelType==2" v-on:touchstart="myTouch($event,'hour')" v-on:touchmove="myMove($event,'hour')" v-on:touchend="myEnd($event,'hour')">
                <div class="check-line"></div>
                <div class="hour-checked">
                  <div class="hour-list" data-translateY="0" style="transform: translateY(0rem)">
                    <div class="list-div" v-for="hour in renderListHour" v-bind:data-index="hour.index">{{Format.hour=='HH'&&hour.value<10?'0':''}}{{hour.value}}</div>
                  </div>
                </div>
                <div class="hour-wheel" style=" transform: rotate3d(1, 0, 0,0deg)">
                  <div class="wheel-div" v-for="hour in renderListHour" v-bind:data-index="hour.index"
                       v-bind:style="{transform: 'rotate3d(1, 0, 0, '+ (-hour.index)*20%360+'deg) translate3d(0px, 0px, 2.5rem)'}">{{Format.hour=='HH'&&hour.value<10?'0':''}}{{hour.value}}
                  </div>
                </div>
              </div>
              <div class="box-minute" v-show="Format.isHour&&panelType==2" v-on:touchstart="myTouch($event,'minute')" v-on:touchmove="myMove($event,'minute')" v-on:touchend="myEnd($event,'minute')">
                <div class="check-line"></div>
                <div class="minute-checked">
                  <div class="minute-list" data-translateY="0" style="transform: translateY(0rem)">
                    <div class="list-div" v-for="minute in renderListMinute" v-bind:data-index="minute.index">{{Format.minute=='mm'&&minute.value<10?'0':''}}{{minute.value}}</div>
                  </div>
                </div>
                <div class="minute-wheel" style=" transform: rotate3d(1, 0, 0,0deg)">
                  <div class="wheel-div" v-for="minute in renderListMinute" v-bind:data-index="minute.index"
                       v-bind:style="{transform: 'rotate3d(1, 0, 0, '+ (-minute.index)*20%360+'deg) translate3d(0px, 0px, 2.5rem)'}">{{Format.minute=='mm'&&minute.value<10?'0':''}}{{minute.value}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>
<script>
  export default{
    name: 'pickerMobile',
    data () {
      let now = new Date()
      return {
        monthList: Array.from({length: 12}, (value, index) => 1 + index),
        hourList: Array.from({length: 24}, (value, index) => 0 + index),
        tmpYear: now.getFullYear(),
        tmpMonth: now.getMonth(),
        tmpDay: now.getDate(),
        tmpHour: now.getHours(),
        tmpMinute: now.getMinutes(),
        /* indefinite wheel spin tool */
        spin: {
          year: {
            head: -9,
            last: 9
          },
          month: {
            head: -9,
            last: 9
          },
          day: {
            head: -9,
            last: 9
          },
          hour: {
            head: -9,
            last: 9
          },
          minute: {
            head: -9,
            last: 9
          }
        },
        touchYear: {
          lastY: 0,
          velocity: 0,
          startTime: 0,
          latsTime: 0,
          lastMove: 0
        },
        touchMonth: {
          lastY: 0,
          velocity: 0,
          startTime: 0,
          latsTime: 0,
          lastMove: 0
        },
        touchDay: {
          lastY: 0,
          velocity: 0,
          startTime: 0,
          latsTime: 0,
          lastMove: 0
        },
        touchHour: {
          lastY: 0,
          velocity: 0,
          startTime: 0,
          latsTime: 0,
          lastMove: 0
        },
        touchMinute: {
          lastY: 0,
          velocity: 0,
          startTime: 0,
          latsTime: 0,
          lastMove: 0
        },
        /* spin branch size left and right */
        branch: 9,
        Format: {
          year: 'yyyy',
          month: 'M',
          day: 'd',
          isHour: false,
          hour: 'HH',
          minute: 'mm',
          separator: '-'
        },
        panelType: 1
      }
    },
    props: {
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
    },
    computed: {
      /* wheel render */
      RangeYear () {
        return {
          // max:this.validDateFormat(this.options.endDate).statues ? parseInt(this.options.endDate.split(this.validDateFormat(this.options.endDate).separator)[0]) : 5000,
          max: 5000,
          // min:this.validDateFormat(this.options.startDate).statues ? parseInt(this.options.startDate.split(this.validDateFormat(this.options.startDate).separator)[0]) : 1970
          min: 1970
        }
      },
      yearList () {
        // [current,.......,max,min,.....current-1]
        let List = []
        for (let k = 0; k <= this.RangeYear.max - this.RangeYear.min; k++) {
          List.push(this.RangeYear.min + k)
        }
        return List
      },
      renderListYear () {
        let list = []
        for (let k = this.spin.year.head; k <= this.spin.year.last; k++) {
          let obj = {
            value: this.getData(k, 'year'),
            index: k
          }
          list.push(obj)
        }
        return list
      },
      dayList () {
        /* get currentMonthLenght */
        let currentMonthLength = new Date(this.tmpYear, this.tmpMonth + 1, 0).getDate()
        /* get currentMonth day */
        let daylist = Array.from({length: currentMonthLength}, (value, index) => {
          return index + 1
        })
        return daylist
      },
      renderListDay () {
        let list = []
        for (let k = this.spin.day.head; k <= this.spin.day.last; k++) {
          let obj = {
            value: this.getData(k, 'day'),
            index: k
          }
          list.push(obj)
        }
        return list
      },
      renderListMonth () {
        let list = []
        for (let k = this.spin.month.head; k <= this.spin.month.last; k++) {
          let obj = {
            value: this.getData(k, 'month'),
            index: k
          }
          list.push(obj)
        }
        return list
      },
      renderListHour () {
        let list = []
        for (let k = this.spin.hour.head; k <= this.spin.hour.last; k++) {
          let obj = {
            value: this.getData(k, 'hour'),
            index: k
          }
          list.push(obj)
        }
        return list
      },
      minuteList () {
        if (this.Format.isHour) {
          let range = this.options.timeRange ? this.options.timeRange : 15
          let list = []
          for (let m = 0; m < Math.ceil(60 / range); m++) {
            let tempM = m * range
            if (tempM < 60) {
              list.push(tempM)
            }
          }
          return list
        } else {
          return Array.from({length: 60}, (value, index) => 0 + index)
        }
      },
      renderListMinute () {
        let list = []
        for (let k = this.spin.minute.head; k <= this.spin.minute.last; k++) {
          let obj = {
            value: this.getData(k, 'minute'),
            index: k
          }
          list.push(obj)
        }
        return list
      },
      /* props */
      language () {
        return this.options.language ? this.options.language : 'cn'
      },
      orYear () {
        let obj = this.validDateFormat(this.valueStr)
        if (this.valueStr !== '' && obj.statues) {
          this.tmpYear = Number(this.valueStr.split(obj.separator)[0])
          return this.tmpYear
        } else {
          this.tmpYear = new Date().getFullYear()
          return this.tmpYear
        }
      },
      orMonth () {
        let obj = this.validDateFormat(this.valueStr)
        if (this.valueStr !== '' && obj.statues) {
          this.tmpMonth = Number(this.valueStr.split(obj.separator)[1] - 1)
          return this.tmpMonth
        } else {
          this.tmpMonth = new Date().getMonth()
          return this.tmpMonth
        }
      },
      orDay () {
        let obj = this.validDateFormat(this.valueStr)
        if (this.valueStr !== '' && obj.statues) {
          this.tmpDay = this.valueStr.split(/\s/)[0] ? this.valueStr.split(/\s/)[0].split(obj.separator)[2] ? this.valueStr.split(/\s/)[0].split(obj.separator)[2] : this.valueStr.split(/\s/)[0].split(obj.separator)[2] : this.valueStr.split(obj.separator)[2]
          this.tmpDay = Number(this.tmpDay)
          return this.tmpDay
        } else {
          this.tmpDay = new Date().getDate()
          return this.tmpDay
        }
      },
      orHour () {
        if (this.Format.isHour) {
          if (this.valueStr !== '') {
            this.tmpHour = Number(this.valueStr.split(/\s/)[1] ? this.valueStr.split(/\s/)[1].split(':')[0] : 23)
            return this.tmpHour
          } else {
            this.tmpHour = new Date().getHours()
            return this.tmpHour
          }
        } else {
          this.tmpHour = new Date().getHours()
          return this.tmpHour
        }
      },
      orMinute () {
        if (this.Format.isHour) {
          if (this.valueStr !== '') {
            this.tmpMinute = Number(this.valueStr.split(/\s/)[1] ? this.valueStr.split(/\s/)[1].split(':')[1] : 59)
            return this.tmpMinute
          } else {
            this.tmpMinute = new Date().getMinutes()
            return this.tmpMinute
          }
        } else {
          this.tmpMinute = new Date().getMinutes()
          return this.tmpMinute
        }
      },
      startDate () {
        // todo use es6
        // update renderList in watch
        return this.validDateFormat(this.options.startDate).statues ? this.options.startDate : '1970-01-01'
      },
      endDate () {
        return this.validDateFormat(this.options.endDate).statues ? this.options.endDate : '5000-01-01'
      }
    },
    methods: {
      myTouch (e, type) {
        e.preventDefault()
        let roller = this.getType(type)
        let Box = roller.Box
        /* touchStart */
        /*
         * startY
         * lastY
         * velocity
         * latsTime
         * */
        let startFinger = e.changedTouches[0]
        Box.lastY = startFinger.pageY
        Box.velocity = 0
        Box.lastTime = Box.startTime = startFinger.timeStamp || Date.now()
        Box.lastMove = 0
        /* get speed */
        Box.startPoint = startFinger.pageY
        /* set css */
        this.setCss(0, type, Box.velocity, false)
      },
      myMove (evt, type) {
        evt.preventDefault()
        let roller = this.getType(type)
        let Box = roller.Box
        /* touchMove */
        /*
         * startY
         * lastY
         * velocity
         * latsTime
         * */

        let Finger = evt.changedTouches[0]
        let move = Finger.pageY - Box.lastY
        let now = Finger.timeStamp || Date.now()
        this.setCss(move, type, false)
        Box.lastY = Finger.pageY
        Box.lastTime = now
        Box.lastMove = move
      },
      myEnd (evt, type) {
        let roller = this.getType(type)
        let Box = roller.Box
        evt.preventDefault()
        let Finger = evt.changedTouches[0]
        let move = Finger.pageY - Box.lastY
        let now = Finger.timeStamp || Date.now()
        this.setCss(move, type, true)
        Box.lastY = Finger.pageY
        Box.lastTime = now
        Box.lastMove = move
        let delta = now - Box.startTime
        /* is flicker */
        // todo inertial
        let distance = Finger.pageY - Box.startPoint
        let v = distance / delta
        let time = 1000
        let a = 2
        // acceleration
        /* flicker 300ms */
        if (delta < 300) {
          distance = v * delta * a
          time += delta * a
          this.setCss(distance, type, true, time)
        }
      },
      setCss (move, type, isEnd, time) {
        let wheel, List
        let roller = this.getType(type)
        wheel = roller.wheel
        List = roller.List

        let singleHeight = this.px2rem(68)
        let singDegree = 20 / singleHeight
        /* set css */
        let currentListRem = this.$el.getElementsByClassName(List)[0].getAttribute('data-translateY')
        /* update css */
        let remHeight = this.px2rem(move) + parseFloat(currentListRem)
        let remDeg = -remHeight * singDegree
        let offsetHeight = remHeight - this.branch * singleHeight
        /* int css data */
        let Px = Math.round(this.rem2px(remHeight) / 68) * 68
        let rem = this.px2rem(Px)
        let aim = Math.round(remDeg / 20) * 20
        let checkRem = this.px2rem(Math.round(-remDeg / 20) * 68 - this.branch * 68)
        /* change spin */
        this.setSpin(type, aim)
        /* ------------ */
        if (isEnd) {
          /* data get int */
          remHeight = rem
          remDeg = aim
          offsetHeight = checkRem
          /* set css */
          if (time) {
            this.$el.getElementsByClassName(List)[0].style.transition = 'transform ' + time + 'ms cubic-bezier(0.19, 1, 0.22, 1)'
            this.$el.getElementsByClassName(wheel)[0].style.transition = 'transform ' + time + 'ms cubic-bezier(0.19, 1, 0.22, 1)'
          } else {
            this.$el.getElementsByClassName(List)[0].style.transition = 'transform 1000ms cubic-bezier(0.19, 1, 0.22, 1)'
            this.$el.getElementsByClassName(wheel)[0].style.transition = 'transform 1000ms cubic-bezier(0.19, 1, 0.22, 1)'
          }
          this.$el.getElementsByClassName(List)[0].setAttribute('data-translatey', remHeight)
          this.$el.getElementsByClassName(List)[0].style.transform = 'translateY(' + offsetHeight + 'rem)'
          this.$el.getElementsByClassName(List)[0].style.marginTop = -rem + 'rem'
          this.$el.getElementsByClassName(wheel)[0].style.transform = 'rotate3d(1, 0, 0, ' + remDeg + 'deg)'
        } else {
          this.$el.getElementsByClassName(List)[0].style.transition = ''
          this.$el.getElementsByClassName(wheel)[0].style.transition = ''
          this.$el.getElementsByClassName(List)[0].setAttribute('data-translateY', remHeight)
          this.$el.getElementsByClassName(List)[0].style.transform = 'translateY(' + offsetHeight + 'rem)'
          this.$el.getElementsByClassName(List)[0].style.marginTop = -rem + 'rem'
          this.$el.getElementsByClassName(wheel)[0].style.transform = 'rotate3d(1, 0, 0, ' + remDeg + 'deg)'
        }
        /* get check data */
        this.setCheckData(type, aim)
      },
      getType (type) {
        let wheel, List, Box
        switch (type) {
          case 'year':
            wheel = 'year-wheel'
            List = 'year-list'
            Box = this.touchYear
            break
          case 'month':
            wheel = 'month-wheel'
            List = 'month-list'
            Box = this.touchMonth

            break
          case 'day':
            wheel = 'day-wheel'
            List = 'day-list'
            Box = this.touchDay
            break
          case 'hour':
            wheel = 'hour-wheel'
            List = 'hour-list'
            Box = this.touchHour

            break
          case 'minute':
            wheel = 'minute-wheel'
            List = 'minute-list'
            Box = this.touchMinute
            break
        }
        return {wheel: wheel, List: List, Box: Box}
      },
      setSpin (type, aim) {
        switch (type) {
          case 'year':
            this.spin.year.head = this.branch * -1 + aim / 20
            this.spin.year.last = this.spin.year.head + this.branch * 2
            break
          case 'month':
            this.spin.month.head = this.branch * -1 + aim / 20
            this.spin.month.last = this.spin.month.head + this.branch * 2
            break
          case 'day':
            this.spin.day.head = this.branch * -1 + aim / 20
            this.spin.day.last = this.spin.day.head + this.branch * 2
            break
          case 'hour':
            this.spin.hour.head = this.branch * -1 + aim / 20
            this.spin.hour.last = this.spin.hour.head + this.branch * 2
            break
          case 'minute':
            this.spin.minute.head = this.branch * -1 + aim / 20
            this.spin.minute.last = this.spin.minute.head + this.branch * 2
            break
        }
      },
      setCheckData (type, deg) {
        let index = deg / 20
        if (type === 'year') {
          this.tmpYear = this.getData(index, type)
          /* update day check */
          this.setCss(0, 'day', true, 1000)
        } else if (type === 'month') {
          this.tmpMonth = this.getData(index, type) - 1
          /* update day check */
          this.setCss(0, 'day', true, 1000)
        } else if (type === 'day') {
          this.tmpDay = this.getData(index, type)
        } else if (type === 'hour') {
          this.tmpHour = this.getData(index, type)
        } else if (type === 'minute') {
          this.tmpMinute = this.getData(index, type)
        }
      },
      px2rem (d) {
        var val = parseFloat(d) / 75
        if (typeof d === 'string' && d.match(/px$/)) {
          val += 'rem'
        }
        return val
      },
      rem2px (d) {
        var val = parseFloat(d) * 75
        if (typeof d === 'string' && d.match(/rem$/)) {
          val += 'px'
        }
        return val
      },
      getData (idx, type) {
        if (type === 'year') {
          return this.yearList[idx % this.yearList.length >= 0 ? idx % this.yearList.length : idx % this.yearList.length + this.yearList.length]
        } else if (type === 'day') {
          return this.dayList[idx % this.dayList.length >= 0 ? idx % this.dayList.length : idx % this.dayList.length + this.dayList.length]
        } else if (type === 'month') {
          return this.monthList[idx % this.monthList.length >= 0 ? idx % this.monthList.length : idx % this.monthList.length + this.monthList.length]
        } else if (type === 'hour') {
          return this.hourList[idx % this.hourList.length >= 0 ? idx % this.hourList.length : idx % this.hourList.length + this.hourList.length]
        } else if (type === 'minute') {
          return this.minuteList[idx % this.minuteList.length >= 0 ? idx % this.minuteList.length : idx % this.minuteList.length + this.minuteList.length]
        }
      },
      setWheelCurrent () {
        // this.$el.getElementsByClassName(List)[0].setAttribute('data-translateY', remHeight)
        // this.$el.getElementsByClassName(List)[0].style.transform = 'translateY(' + offsetHeight + 'rem)'
        // this.$el.getElementsByClassName(List)[0].style.marginTop = -rem + 'rem'
        // this.$el.getElementsByClassName(wheel)[0].style.transform = 'rotate3d(1, 0, 0, ' + remDeg + 'deg)'
      },
      setFormat (format) {
        /*
         * d      without 0
         * dd     with 01
         * M      without 0
         * MM     with 03
         * yy     2016 16
         * yyyy   2016
         * h      12am 12pm 1 2
         * hh     12am 12pm 01 02
         * H      24h 1 2 3
         * HH     24 01 02
         * m      minute 1
         * mm     minute 01
         * */
        /* let  format=this.options.format */
        let reg1 = /^[yyyy]{4}-?\/?[M,MM]{1,2}-?\/?[d,dd]{1,2}\s[h,hh,H,HH]{1,2}:[m,mm]{1,2}$|^[yyyy]{4}-?\/?[M,MM]{1,2}-?\/?[d,dd]{1,2}$/
        let reg2 = /^[yyyy]{4}-?\/?[M,MM]{1,2}-?\/?[d,dd]{1,2}\s[h,hh,H,HH]{1,2}:[m,mm]{1,2}$/
        let reg3 = /^[yyyy]{4}-?\/?[M,MM]{1,2}-?\/?[d,dd]{1,2}$/
        // todo different format set different this.Format when you finished pick ,you should set out put date format base on this.Format value
        if (reg1.test(format)) {
          /* get separator - or / */
          if (format.split('-').length === 3) {
            this.Format.separator = '-'
          } else if (format.split('/').length === 3) {
            this.Format.separator = '/'
          } else {
            throw new TypeError('format must be like yyyy-M-dd, do not set like yyyy/M-dd')
          }
          if (reg2.test(format)) {
            let dateArr = format.split(/\s/)
            let yearArr = dateArr[0].split(this.Format.separator)
            let hourArr = dateArr[1].split(':')
            this.Format.isHour = true
            this.Format.year = yearArr[0]
            this.Format.month = yearArr[1]
            this.Format.day = yearArr[2]
            this.Format.hour = hourArr[0]
            this.Format.minute = hourArr[1]
          } else if (reg3.test(format)) {
            let dateArr = format.split(/\s/)
            let yearArr = dateArr[0].split(this.Format.separator)
            this.Format.isHour = false
            this.Format.year = yearArr[0]
            this.Format.month = yearArr[1]
            this.Format.day = yearArr[2]
          }
        } else {
          throw TypeError('format is wrong,try yyy-M-dd or find api advices')
        }
      },
      validDateFormat (DateStr) {
        let reg4 = /^\d{4}-?\/?\d{1,2}-?\/?\d{1,2}\s\d{1,2}:\d{1,2}$|^\d{4}-?\/?\d{1,2}-?\/?\d{1,2}$/
        let obj = {
          separator: '-',
          statues: false
        }
        if (reg4.test(DateStr)) {
          if (DateStr.split('-').length === 3) {
            obj.separator = '-'
          } else if (DateStr.split('/').length === 3) {
            obj.separator = '/'
          }
          obj.statues = true
          return obj
        } else {
          return obj
        }
      },
      /* valid data */
      validYear (year) {
        let obj1 = this.validDateFormat(this.startDate)
        let obj2 = this.validDateFormat(this.endDate)
        if (obj1.statues && obj2.statues) {
          if (Number(this.startDate.split(obj1.separator)[0]) <= year && year <= Number(this.endDate.split(obj2.separator)[0])) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      },
      validMonth (month) {
        let obj1 = this.validDateFormat(this.startDate)
        let obj2 = this.validDateFormat(this.endDate)
        if (obj1.statues && obj2.statues) {
          let satrDate = new Date(this.startDate.split(obj1.separator)[0], this.startDate.split(obj1.separator)[1] - 1).getTime()
          let endDate = new Date(this.endDate.split(obj2.separator)[0], this.endDate.split(obj2.separator)[1] - 1).getTime()
          let tempDate = new Date(this.tmpYear, month).getTime()
          if (satrDate <= tempDate && tempDate <= endDate) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      },
      validDay (day) {
        let obj1 = this.validDateFormat(this.startDate)
        let obj2 = this.validDateFormat(this.endDate)
        if (obj1.statues && obj2.statues) {
          let satrDate = new Date(this.startDate.split(obj1.separator)[0], this.startDate.split(obj1.separator)[1] - 1, this.startDate.split(obj1.separator)[2]).getTime()
          let endDate = new Date(this.endDate.split(obj2.separator)[0], this.endDate.split(obj2.separator)[1] - 1, this.endDate.split(obj2.separator)[2]).getTime()
          let tempDate = new Date(this.tmpYear, this.tmpMonth, day.value).getTime()
          if (satrDate <= tempDate && tempDate <= endDate) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      },
      validHour (hour) {
        let obj1 = this.validDateFormat(this.startDate)
        let obj2 = this.validDateFormat(this.endDate)
        if (obj1.statues && obj2.statues) {
          let satrDate = new Date(this.startDate.split(obj1.separator)[0], this.startDate.split(obj1.separator)[1] - 1, this.startDate.split(obj1.separator)[2], this.startDate.split(/\s/)[1] ? this.startDate.split(/\s/)[1].split(':')[0] ? this.startDate.split(/\s/)[1].split(':')[0] : 23 : 23).getTime()
          let endDate = new Date(this.endDate.split(obj1.separator)[0], this.endDate.split(obj1.separator)[1] - 1, this.endDate.split(obj1.separator)[2], this.endDate.split(/\s/)[1] ? this.endDate.split(/\s/)[1].split(':')[0] ? this.endDate.split(/\s/)[1].split(':')[0] : 23 : 23).getTime()
          let tempDate = new Date(this.tmpYear, this.tmpMonth, this.tmpDay, hour).getTime()
          if (satrDate <= tempDate && tempDate <= endDate) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      },
      validMinute (minute) {
        let obj1 = this.validDateFormat(this.startDate)
        let obj2 = this.validDateFormat(this.endDate)
        if (obj1.statues && obj2.statues) {
          let satrDate = new Date(this.startDate.split(obj1.separator)[0], this.startDate.split(obj1.separator)[1] - 1, this.startDate.split(obj1.separator)[2], this.startDate.split(/\s/)[1] ? this.startDate.split(/\s/)[1].split(':')[0] ? this.startDate.split(/\s/)[1].split(':')[0] : 23 : 23, this.startDate.split(/\s/)[1] ? this.startDate.split(/\s/)[1].split(':')[1] ? this.startDate.split(/\s/)[1].split(':')[1] : 59 : 59).getTime()
          let endDate = new Date(this.endDate.split(obj1.separator)[0], this.endDate.split(obj1.separator)[1] - 1, this.endDate.split(obj1.separator)[2], this.endDate.split(/\s/)[1] ? this.endDate.split(/\s/)[1].split(':')[0] ? this.endDate.split(/\s/)[1].split(':')[0] : 23 : 23, this.endDate.split(/\s/)[1] ? this.endDate.split(/\s/)[1].split(':')[1] ? this.endDate.split(/\s/)[1].split(':')[1] : 59 : 59).getTime()
          let tempDate = new Date(this.tmpYear, this.tmpMonth, this.tmpDay, this.tmpHour, minute.M).getTime()
          if (satrDate <= tempDate && tempDate <= endDate) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      },
      validCheckeDate () {
        let obj1 = this.validDateFormat(this.startDate)
        let obj2 = this.validDateFormat(this.endDate)
        if (obj1.statues && obj2.statues) {
          let satrDate = new Date(this.startDate.split(obj1.separator)[0], this.startDate.split(obj1.separator)[1] - 1, this.startDate.split(obj1.separator)[2], this.startDate.split(/\s/)[1] ? this.startDate.split(/\s/)[1].split(':')[0] ? this.startDate.split(/\s/)[1].split(':')[0] : 23 : 23, this.startDate.split(/\s/)[1] ? this.startDate.split(/\s/)[1].split(':')[1] ? this.startDate.split(/\s/)[1].split(':')[1] : 59 : 59).getTime()
          let endDate = new Date(this.endDate.split(obj1.separator)[0], this.endDate.split(obj1.separator)[1] - 1, this.endDate.split(obj1.separator)[2], this.endDate.split(/\s/)[1] ? this.endDate.split(/\s/)[1].split(':')[0] ? this.endDate.split(/\s/)[1].split(':')[0] : 23 : 23, this.endDate.split(/\s/)[1] ? this.endDate.split(/\s/)[1].split(':')[1] ? this.endDate.split(/\s/)[1].split(':')[1] : 59 : 59).getTime()
          let tempDate = new Date(this.tmpYear, this.tmpMonth, this.tmpDay, this.tmpHour, this.tmpMinute).getTime()
          if (satrDate <= tempDate && tempDate <= endDate) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      },
      /* btn */
      cancel () {
        this.$emit('checked', this.outPutDate(false))
        this.initWheel()
      },
      checked () {
        if (this.validCheckeDate()) {
          this.orYear = this.tmpYear
          this.orMonth = this.tmpMonth
          this.orDay = this.tmpDay
          if (this.Format.isHour) {
            this.orHour = this.tmpHour
            this.orMinute = this.tmpMinute
          }
          this.panelType = 1
          this.$emit('checked', this.outPutDate(true))
        } else {
          window.alert('所选时间超出设定范围,请重新选择')
        }
      },
      /* output */
      outPutDate (type) {
        if (type) {
          if (this.Format.isHour) {
            return this.tmpYear + this.Format.separator + (this.Format.month === 'MM' && (this.tmpMonth + 1) < 10 ? '0' : '') + Number(this.tmpMonth + 1) + this.Format.separator + (this.Format.day === 'dd' && this.tmpDay < 10 ? '0' : '') + this.tmpDay + ' ' + (this.Format.hour === 'HH' && this.tmpHour < 10 ? '0' : '') + this.tmpHour + ':' + (this.Format.minute === 'mm' && this.tmpMinute < 10 ? '0' : '') + this.tmpMinute
          } else {
            return this.tmpYear + this.Format.separator + (this.Format.month === 'MM' && (this.tmpMonth + 1) < 10 ? '0' : '') + Number(this.tmpMonth + 1) + this.Format.separator + (this.Format.day === 'dd' && this.tmpDay < 10 ? '0' : '') + this.tmpDay
          }
        } else {
          if (this.Format.isHour) {
            return this.orYear + this.Format.separator + (this.Format.month === 'MM' && (this.orMonth + 1) < 10 ? '0' : '') + Number(this.orMonth + 1) + this.Format.separator + (this.Format.day === 'dd' && this.orDay < 10 ? '0' : '') + this.orDay + ' ' + (this.Format.hour === 'HH' && this.orHour < 10 ? '0' : '') + this.orHour + ':' + (this.Format.minute === 'mm' && this.orMinute < 10 ? '0' : '') + this.orMinute
          } else {
            return this.orYear + this.Format.separator + (this.Format.month === 'MM' && (this.orMonth + 1) < 10 ? '0' : '') + Number(this.orMonth + 1) + this.Format.separator + (this.Format.day === 'dd' && this.orDay < 10 ? '0' : '') + this.orDay
          }
        }
      },
      /* changeType */
      changeType (type) {
        this.panelType = type
      },
      /* init wheel */
      initWheel () {
        /* init wheel and list */
        this.$el.getElementsByClassName('year-list')[0].style.transform = 'translateY(' + ((this.orYear - this.RangeYear.min) * (-1) - this.branch) * 68 / 75 + 'rem)'
        this.$el.getElementsByClassName('year-list')[0].style.marginTop = (this.orYear - this.RangeYear.min) * 68 / 75 + 'rem'
        this.$el.getElementsByClassName('year-list')[0].setAttribute('data-translatey', -(this.orYear - this.RangeYear.min) * 68 / 75)
        this.$el.getElementsByClassName('year-wheel')[0].style.transform = 'rotate3d(1, 0, 0, ' + (this.orYear - this.RangeYear.min) * 20 + 'deg)'

        this.$el.getElementsByClassName('month-list')[0].style.transform = 'translateY(' + (-this.orMonth * 68 / 75 - this.branch * 68 / 75) + 'rem)'
        this.$el.getElementsByClassName('month-list')[0].style.marginTop = this.orMonth * 68 / 75 + 'rem'
        this.$el.getElementsByClassName('month-list')[0].setAttribute('data-translatey', -this.orMonth * 68 / 75)
        this.$el.getElementsByClassName('month-wheel')[0].style.transform = 'rotate3d(1, 0, 0, ' + this.orMonth * 20 + 'deg)'

        this.$el.getElementsByClassName('day-list')[0].style.transform = 'translateY(' + (-(this.orDay - this.dayList[0]) * 68 / 75 - this.branch * 68 / 75) + 'rem)'
        this.$el.getElementsByClassName('day-list')[0].style.marginTop = (this.orDay - this.dayList[0]) * 68 / 75 + 'rem'
        this.$el.getElementsByClassName('day-list')[0].setAttribute('data-translatey', -(this.orDay - this.dayList[0]) * 68 / 75)
        this.$el.getElementsByClassName('day-wheel')[0].style.transform = 'rotate3d(1, 0, 0, ' + (this.orDay - this.dayList[0]) * 20 + 'deg)'

        this.$el.getElementsByClassName('hour-list')[0].style.transform = 'translateY(' + (-(this.orHour - this.hourList[0]) * 68 / 75 - this.branch * 68 / 75) + 'rem)'
        this.$el.getElementsByClassName('hour-list')[0].style.marginTop = (this.orHour - this.hourList[0]) * 68 / 75 + 'rem'
        this.$el.getElementsByClassName('hour-list')[0].setAttribute('data-translatey', -(this.orHour - this.hourList[0]) * 68 / 75)
        this.$el.getElementsByClassName('hour-wheel')[0].style.transform = 'rotate3d(1, 0, 0, ' + (this.orHour - this.hourList[0]) * 20 + 'deg)'

        this.$el.getElementsByClassName('minute-list')[0].style.transform = 'translateY(' + (-(this.orMinute - this.minuteList[0]) * 68 / 75 - this.branch * 68 / 75) + 'rem)'
        this.$el.getElementsByClassName('minute-list')[0].style.marginTop = (this.orMinute - this.minuteList[0]) * 68 / 75 + 'rem'
        this.$el.getElementsByClassName('minute-list')[0].setAttribute('data-translatey', -(this.orMinute - this.minuteList[0]) * 68 / 75)
        this.$el.getElementsByClassName('minute-wheel')[0].style.transform = 'rotate3d(1, 0, 0, ' + (this.orMinute - this.minuteList[0]) * 20 + 'deg)'

        this.spin.year.head = this.orYear - this.RangeYear.min - this.branch
        this.spin.year.last = this.orYear - this.RangeYear.min + this.branch

        this.spin.month.head = this.orMonth - this.branch
        this.spin.month.last = this.orMonth + this.branch

        this.spin.day.head = (this.orDay - this.dayList[0]) - this.branch
        this.spin.day.last = (this.orDay - this.dayList[0]) + this.branch

        this.spin.hour.head = (this.orHour - this.hourList[0]) - this.branch
        this.spin.hour.last = (this.orHour - this.hourList[0]) + this.branch

        this.spin.minute.head = (this.orMinute - this.minuteList[0]) - this.branch
        this.spin.minute.last = (this.orMinute - this.minuteList[0]) + this.branch
      }
    },
    watch: {
      visible: function (val, old) {
        if (val) {
          this.initWheel()
        }
        // init format
        if (this.options.format) {
          this.setFormat(this.options.format)
        }
      },
      options: function (val, oldVal) {
        // init format
        if (this.options.format) {
          this.setFormat(this.options.format)
        }
      }
    },
    filters: {
      weekF: (item, year, month, lang) => {
        let week = new Date(year, month, item).getDay()
        switch (lang) {
          case 'cn':
            return {0: '周日', 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六'}[week]
          case 'en':
            return {0: 'Su', 1: 'Mo', 2: 'Tu', 3: 'We', 4: 'Th', 5: 'Fr', 6: 'Sa'}[week]
          default:
            return item
        }
      },
      monthF: (month, lang) => {
        switch (lang) {
          case 'cn':
            return {1: '一月', 2: '二月', 3: '三月', 4: '四月', 5: '五月', 6: '六月', 7: '七月', 8: '八月', 9: '九月', 10: '十月', 11: '十一月', 12: '十二月'}[month]
          case 'en':
            return {1: 'JAN', 2: 'FEB', 3: 'MAR', 4: 'APR', 5: 'MAY', 6: 'JUN', 7: 'JUL', 8: 'AUG', 9: 'SEP', 10: 'OCT', 11: 'NOV', 12: 'DEC'}[month]
          default:
            return month
        }
      },
      btnF: (btn, lang) => {
        switch (lang) {
          case 'cn':
            return {Cancel: '取消', Confirm: '确认', Previous: '上一步', Next: '下一步'}[btn]
          case 'en':
            return {Cancel: 'Cancel', Confirm: 'Confirm', Previous: 'Previous', Next: 'Next'}[btn]
          default:
            return btn
        }
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss" rel="stylesheet/scss" src="./pickerMobile.scss"></style>

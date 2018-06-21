<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'
const animationDuration = 6000
export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    data: {
      type: Array,
      default: {}
    }
  },
  data() {
    return {
      orderCount: [0, 0, 0, 0, 0, 0, 0],
      orderTotal: [0, 0, 0, 0, 0, 0, 0],
      chart: null
    }
  },
  created() {
    this.data
      .filter(x => new Date().getTime() - x.createdAt < 604800000)
      .forEach(x => {
        const mm = Math.floor((new Date() - x.createdAt) / 86400000)
        // const mm = parseInt(6 * Math.random()) + 1
        this.orderCount[mm] += 1
        this.orderTotal[mm] += x.price.orderTotal
      })
  },
  mounted() {
    this.initChart()
    this.__resizeHanlder = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHanlder)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHanlder)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['週一', '週二', '週三', '週四', '週五', '週六', '週日'],
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }, {
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '訂單數量',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: this.orderCount,
          animationDuration
        },
        {
          name: '訂單金額',
          type: 'line',
          yAxisIndex: 1,
          data: this.orderTotal
        }]
      })
    }
  }
}
</script>

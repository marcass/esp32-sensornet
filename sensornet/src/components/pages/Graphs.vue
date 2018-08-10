<template>
  <div class='wrapper'>
    <div class='main-head'>
      <app-nav></app-nav>
      <h1>House data</h1>
    </div>
    <!-- <div class='side'>
      <select v-model="site" multiple>
        <option disabled value="">Select location(s) to graph</option>
        <option v-for="item in locations" v-bind:key="item">{{ item }}</option>
      </select>
      <select v-model="graph_items" multiple>
        <option disabled value="">Select attribute(s) to graph</option>
        <option v-for="item in sensorIDs" v-bind:key="item">{{ item }}</option>
      </select>
      <select v-model="range">
        <option disabled value="a">Select graph range</option>
        <option v-for="(item, index) in label" :value="val[index]" v-bind:key="item">{{ item }}</option>
      </select>
      <select v-model="period" v-if="range == '24_hours'">
        <option disabled value="">Select graph period in hours</option>
        <option v-for="n in 24" v-bind:key="n">{{ n }}</option>
      </select>
      <select v-model="period" v-if="range == '7_days'">
        <option disabled value="">Select graph period in days</option>
        <option v-for="n in 7" v-bind:key="n">{{ n }}</option>
      </select>
      <select v-model="period" v-if="range == '2_months'">
        <option disabled value="">Select graph period in days</option>
        <option v-for="n in 60" v-bind:key="n">{{ n }}</option>
      </select>
      <select v-model="period" v-if="range == '1_year'">
        <option disabled value="">Select graph period in Months</option>
        <option v-for="n in 12" v-bind:key="n">{{ n }}</option>
      </select>
      <select v-model="period" v-if="range == '5_years'">
        <option disabled value="">Select graph period in Years</option>
        <option v-for="n in 5" v-bind:key="n">{{ n }}</option>
      </select>
      <button v-on:click="graph({'items':graph_items, 'range':range, 'period':period})">Make the graph</button>
    </div> -->
    <div class='content'>
      <vue-plotly :data="data" :layout="layout" :options="options"/>
      <!-- <vue-plotly :data="data[1]" :layout="layout" :options="options"/> -->
    </div>
  </div>
</template>

<script>
import { getSensorDataTypes, postCustomData } from '../../../utils/door-api'
import AppNav from '../AppNav'
import VuePlotly from '@statnett/vue-plotly'
// import Plotly from 'plotly.js/dist/plotly'
export default {
  name: 'graphs',
  data () {
    return {
      data: [],
      datatypes: [],
      locations: [],
      sensorIDs: [],
      period: 1,
      range: '',
      val: ['24_hours', '7_days', '2_months', '1_year', '5_years'],
      label: ['Hours', 'Days', 'Months', 'Year', 'Years'],
      graph_items: [],
      // layout: {
      //   'title': 'House data',
      //   'yaxis': {'title': 'Temperature'},
      //   'yaxis2': {'title': 'Percent', 'overlaying': 'y', 'side': 'right'}
      // },
      laoyout: {
        'title': 'House data',
        'yaxis': {'title': 'Temperature'},
      },
      options: {},
      timeRes: '',
      firstdata: {'measurement': [{'location': 'marcus', 'sensors':[{'id': 'lounge', 'type': 'temp'}]}], 'range':'24_hours', 'period': 24}
    }
  },
  components: {
    AppNav,
    VuePlotly
  },
  methods: {
    loadedGraph () {
      // console.log(payload)
      postCustomData(this.firstdata).then((ret) => {
        // console.log(ret)
        // this.data = ret.data
        // console.log(this.data)
        this.data = this.convTime(ret.data)
      })
    },
    getValues () {
      getSensorDataTypes().then((ret) => {
        // console.log(ret)
        this.datatypes = ret.types
        this.locations = ret.measurements
        this.sensorIDs = ret.sensorIDs
      })
    },
    graph (payload) {
      // console.log(payload)
      postCustomData(payload).then((ret) => {
        // console.log(ret)
        this.data = this.convTime(ret.data)
      })
    },
    convTime (data) {
      var i
      for (i in data) {
        var arr = data[i].x
        // eslint-disable-next-line
        var dates = function (element, index, arr) {
          element = new Date(element)
          return element
        }
        const result = arr.map(dates)
        data[i].x = result
      }
      return data
    }
  },
  mounted () {
    this.loadedGraph()
    this.getValues()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b283;
}
</style>

<template>
  <div class='wrapper'>
    <div class='main-head'>
      <app-nav></app-nav>
    </div>
    <div class='side'>
      <div>
        <button v-for="item in sites" v-on:click="getValues(item)">Get values for this site: {{ item }}</button>
      </div>
      <!-- <select v-model="site">
        <option disabled value="">Select sites(s) to graph</option>
        <option v-for="item in values.sites" v-bind:key="item">{{ item }}</option>
      </select> -->
      <!-- <select v-model="graph_items" multiple>
        <option disabled value="">Select attribute(s) to graph</option>
        <option v-for="item in values.types" v-bind:key="item">{{ item }}</option>
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
      <button v-on:click="graph({'items':graph_items, 'range':range, 'period':period})">Make the graph</button> -->
    </div>
    <div class='content'>
      <vue-plotly :data="data" :layout="layout" :options="options"/>
      <!-- <vue-plotly :data="data[1]" :layout="layout" :options="options"/> -->
    </div>
  </div>
</template>

<script>
import { getSensorDataTypes, postCustomData, getSites } from '../../../utils/door-api'
import AppNav from '../AppNav'
import VuePlotly from '@statnett/vue-plotly'
// import Plotly from 'plotly.js/dist/plotly'
export default {
  name: 'graphs',
  data () {
    return {
      data: [],
      sites: [],
      // datatypes: [],
      // locations: [],
      // sensorIDs: [],
      values: [],
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
      layout: {
        'title': 'House data',
        'yaxis': {'title': 'Temperature'},
      },
      options: {},
      timeRes: '',
      firstdata: {'measurement': [{'site': 'marcus', 'sensors':[{'id': 'lounge', 'type': 'temp'}]}], 'range':'temp_7_days', 'period': 1}
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
    getValues (site) {
      getSensorDataTypes(site).then((ret) => {
        console.log(ret)
        // this.datatypes = ret.types
        // this.locations = ret.measurements
        // this.sensorIDs = ret.sensorIDs
        this.values = ret
      })
    },
    graph (payload) {
      // console.log(payload)
      postCustomData(payload).then((ret) => {
        // console.log(ret)
        this.data = this.convTime(ret.data)
        // console.log(this.data)
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
      console.log(data)
      return data
    },
    getSitesnow () {
      getSites().then((ret) => {
        console.log(ret)
        // this.datatypes = ret.types
        // this.locations = ret.measurements
        // this.sensorIDs = ret.sensorIDs
        this.sites = ret
      })
    }
  },
  mounted () {
    this.loadedGraph()
    this.getSitesnow()
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

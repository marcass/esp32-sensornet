<template>
  <div class='wrapper'>
    <div class='main-head'>
      <app-nav></app-nav>
    </div>
    <div class='content'>
      <div v-if="buttons">
        Please select the type of values you want to graph
        <button v-on:click="getSiteList()">Get values by site</button>
        <button v-on:click="getTypeList()">Get values by measurement type</button>
        <button v-on:click="getAllValues()">Get all values</button>
      </div>
      <div v-if="selection == 'sites'">
        Please select the site you want to graph from
        <select v-model="selsite" @change="getSiteValues(selsite)">
          <option disabled value="">Select sites to graph</option>
          <option v-for="(item, index) in sites" v-bind:key="index" >{{ item.sitename }}</option>
        </select>
      </div>
      <div v-if="disp == 'site'">
        <div>
          <select v-model="trace" multiple>
            <option disabled value="">Select sensor(s) to graph</option>
            <option v-for="(item, index) in sitevals" v-bind:key="index" >{{ item.type }}+{{ item.sensorID }}</option>
          </select>
          <select v-model="range">
            <option disabled value="">Select graph range</option>
            <option v-for="(item, index) in label" :value="val[index]" v-bind:key="item">{{ item }}</option>
          </select>
          <select v-model="period" v-if="range == '24_hours'">
            <option disabled value="">Select graph period in hours</option>
            <option v-for="n in 24" v-bind:key="n">{{ n }}</option>
          </select>
          <select v-model="period" v-else-if="range == '7_days'">
            <option disabled value="">Select graph period in days</option>
            <option v-for="n in 7" v-bind:key="n">{{ n }}</option>
          </select>
          <select v-model="period" v-else-if="range == '2_months'">
            <option disabled value="">Select graph period in days</option>
            <option v-for="n in 60" v-bind:key="n">{{ n }}</option>
          </select>
          <select v-model="period" v-else-if="range == '1_year'">
            <option disabled value="">Select graph period in Months</option>
            <option v-for="n in 12" v-bind:key="n">{{ n }}</option>
          </select>
          <select v-model="period" v-else-if="range == 'forever'">
            <option disabled value="">Select graph period in Years</option>
            <option v-for="n in 5" v-bind:key="n">{{ n }}</option>
          </select>
          <button v-on:click="graphCust({'traces':trace, 'range':range, 'period':period, 'site': site, 'measurement': measurement})">Make the graph</button>
        </div>
      </div>
      <div v-if="selection == 'types'">
        Please select the type of data you want to graph
        <select v-model="type" @change="getTypeValues(type)">
          <option disabled value="">Select type of sensors to graph</option>
          <option v-for="(item, index) in types" v-bind:key="index" >{{ item }}</option>
        </select>
        <div v-if="disp == 'type'">
          <div>
            <select v-model="trace" multiple>
              <option disabled value="">Select sensor(s) to graph</option>
              <option v-for="(item, index) in typevals" v-bind:key="index" >{{ item.site }}+{{ item.sensorID }}</option>
            </select>
            <select v-model="range">
              <option disabled value="a">Select graph range</option>
              <option v-for="(item, index) in label" :value="val[index]" v-bind:key="item">{{ item }}</option>
            </select>
            <select v-model="period" v-if="range == '24_hours'">
              <option disabled value="">Select graph period in hours</option>
              <option v-for="n in 24" v-bind:key="n">{{ n }}</option>
            </select>
            <select v-model="period" v-else-if="range == '7_days'">
              <option disabled value="">Select graph period in days</option>
              <option v-for="n in 7" v-bind:key="n">{{ n }}</option>
            </select>
            <select v-model="period" v-else-if="range == '2_months'">
              <option disabled value="">Select graph period in days</option>
              <option v-for="n in 60" v-bind:key="n">{{ n }}</option>
            </select>
            <select v-model="period" v-else-if="range == '1_year'">
              <option disabled value="">Select graph period in Months</option>
              <option v-for="n in 12" v-bind:key="n">{{ n }}</option>
            </select>
            <select v-model="period" v-else-if="range == 'forever'">
              <option disabled value="">Select graph period in Years</option>
              <option v-for="n in 5" v-bind:key="n">{{ n }}</option>
            </select>
            <button v-on:click="graphCust({'traces':trace, 'range':range, 'period':period, 'measurement': measurement, 'type': type})">Make the graph</button>
          </div>
        </div>
      </div>
      <!-- <div v-if="selection == 'all'"> -->
        <!-- <button v-on:click="getAllValues()">Get values</button> -->
      <div v-if="selection == 'all'">
        <div>
          Please select the data you want to graph
          <select v-model="trace" multiple>
            <option disabled value="">Select sensor(s) to graph</option>
            <option v-for="(item, index) in AllValues" v-bind:key="index" >{{ item.site }}+{{ item.type }}+{{ item.sensorID }}</option>
          </select>
          <select v-model="range">
            <option disabled value="a">Select graph range</option>
            <option v-for="(item, index) in label" :value="val[index]" v-bind:key="item">{{ item }}</option>
          </select>
          <select v-model="period" v-if="range == '24_hours'">
            <option disabled value="">Select graph period in hours</option>
            <option v-for="n in 24" v-bind:key="n">{{ n }}</option>
          </select>
          <select v-model="period" v-else-if="range == '7_days'">
            <option disabled value="">Select graph period in days</option>
            <option v-for="n in 7" v-bind:key="n">{{ n }}</option>
          </select>
          <select v-model="period" v-else-if="range == '2_months'">
            <option disabled value="">Select graph period in days</option>
            <option v-for="n in 60" v-bind:key="n">{{ n }}</option>
          </select>
          <select v-model="period" v-else-if="range == '1_year'">
            <option disabled value="">Select graph period in Months</option>
            <option v-for="n in 12" v-bind:key="n">{{ n }}</option>
          </select>
          <select v-model="period" v-else-if="range == 'forever'">
            <option disabled value="">Select graph period in Years</option>
            <option v-for="n in 5" v-bind:key="n">{{ n }}</option>
          </select>
          <button v-on:click="graphCust({'traces':trace, 'range':range, 'period':period, 'measurement': measurement})">Make the graph</button>
        </div>
      </div>

    </div>
    <div class='content'>
      <div v-if="graph">
        <vue-plotly :data="data" :layout="layout" :options="options"/>
        <button v-on:click="startAgain()">Make a new graph</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getSensorTypes, getSensorDataAll, getSensorDataTypes,
  postCustomData, getSites, getSensorDataSiteMeas } from '../../../utils/api'
import AppNav from '../AppNav'
import VuePlotly from '@statnett/vue-plotly'
// import Plotly from 'plotly.js/dist/plotly'
export default {
  name: 'graphs',
  data () {
    return {
      trace: [],
      data: [],
      site: '',
      type: '',
      sites: [],
      selsite: '',
      values: [],
      period: 1,
      range: '',
      val: ['24_hours', '7_days', '2_months', '1_year', 'forever'],
      label: ['Hours', 'Days', 'Months', 'Year', 'Years'],
      graph_items: [],
      layout: {},
      options: {},
      timeRes: '',
      firstdata: {'measurement': [{'site': 'marcus', 'sensors':[{'id': 'lounge', 'type': 'temp'}]}], 'range':'temp_7_days', 'period': 1},
      disp: '',
      selection: '',
      types: [],
      AllValues: [],
      sitevals: [],
      typevals: [],
      graph: false,
      buttons: true,
      measurement: ''
    }
  },
  components: {
    AppNav,
    VuePlotly
  },
  methods: {
    startAgain () {
      this.buttons = true
      this.disp = ''
      this.graph = false
      this.selection = ''

    },
    getSiteValues (site) {
      var ind
      for (var x in this.sites) {
        if (site == this.sites[x].sitename) {
          ind = x
        }
      }
      this.measurement = this.sites[ind].measurement
      getSensorDataSiteMeas(site, this.measurement).then((ret) => {
        this.sitevals = ret
        this.site = site
        this.disp = 'site'
      })
    },
    getTypeValues (type) {
      getSensorDataTypes(type).then((ret) => {
        this.typevals = ret
        this.disp = 'type'
      })
    },
    getAllValues () {
      getSensorDataAll().then((ret) => {
        // console.log(ret)
        this.AllValues = ret
        this.selection = 'all'
        this.disp = false
        this.buttons = false
      })
    },
    graphCust (payload) {
      postCustomData(payload).then((ret) => {
        // console.log(ret)
        this.layout = ret.data.layout
        this.data = this.convTime(ret.data.data)
        this.graph = true
        this.disp = ''
        this.selection = ''
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
      // console.log(data)
      return data
    },
    getSiteList () {
      getSites().then((ret) => {
        // this.datatypes = ret.types
        // this.locations = ret.measurements
        // this.sensorIDs = ret.sensorIDs
        this.selection = 'sites'
        // console.log(ret)
        this.sites = ret
        this.buttons = false
      })
    },
    getSiteStart () {
        getSites().then((ret) => {
        this.sites = ret
        if (this.sites.length < 2) {
          this.measurement = this.sites[0].measurement
          getSensorDataSiteMeas(this.sites[0].sitename, this.measurement).then((ret) => {
            this.sitevals = ret
            this.site = this.sites[0].sitename
            this.disp = 'site'
            this.buttons = false
          })
        }
      })
    },
    getTypeList() {
      getSensorTypes().then((ret) => {
        this.selection = 'types'
        this.types = ret
        this.buttons = false
      })
    }
  },
  mounted () {
    this.getSiteStart()
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

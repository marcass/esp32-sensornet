<template>
  <div class='wrapper'>
    <div class='main-head'>
      <app-nav></app-nav>
    </div>
    <div class='content'>
      <div v-if="disp == ''">
        Please select the site you want to graph from
        <select v-model="selsite" @change="getSiteValues(selsite)">
          <option disabled value="">Select sites to graph</option>
          <option v-for="(item, index) in sites" v-bind:key="index" >{{ item.sitename }}</option>
        </select>
      </div>
      <div v-if="disp == 'site'">
        <div v-for="(item, index) in sitevals" :key="index">
          <div class="trace">
            <drag class="drag" :class="{ [item]: true }" :transfer-data="{ item:item, key:index }">
              {{ item.type }}+{{ item.sensorID }}
            </drag>
          </div>
        </div>
        <div class="axis">
          <br>
          <div>
            How many y-axes do you want?
            <select name="axes" id="axes" v-model="axes" @change="buildAxes(axes)">
              <!-- <option disabled value="">How many y-axes do you want?</option> -->
              <option v-for="n in 3" v-bind:key="n">{{ n }}</option>
            </select>
            <br>
          </div>
          <div v-if="axes == 1">
            <drop class="drop list" @drop="handleDrop(y1.members, axis1, ...arguments)">
              Drag and drop items you want to graph in y-axis1 here<br>
              <div class="drag" v-for="item in axis1" v-bind:key="item">
                {{item}}
              </div>
              <br>
              <input v-model="y1.label" placeholder="Axis label (leave blank for None)">
            </drop>
          </div>
          <div v-if="axes == 2">
            <drop class="drop list" @drop="handleDrop(y1.members, axis1, ...arguments)">
              Drag and drop items you want to graph in y-axis1 here<br>
              <div class="drag" v-for="item in axis1" v-bind:key="item">
                {{item}}
              </div>
              <br>
              <input v-model="y1.label" placeholder="Axis label (leave blank for None)">
            </drop>
            <drop class="drop list" @drop="handleDrop(y2.members, axis2, ...arguments)">
              Drag and drop items you want to graph in y-axis2 here<br>
              <div class="drag" v-for="item in axis2" v-bind:key="item">
                {{item}}
              </div>
              <br>
              <input v-model="y2.label" placeholder="Axis label (leave blank for None)">
            </drop>
          </div>
          <div v-if="axes == 3">
            <drop class="drop list" @drop="handleDrop(y1.members, axis1, ...arguments)">
              Drag and drop items you want to graph in y-axis1 here<br>
              <div class="drag" v-for="item in axis1" v-bind:key="item">
                {{item}}
              </div>
              <br>
              <input v-model="y1.label" placeholder="Axis label (leave blank for None)">
            </drop>
            <drop class="drop list" @drop="handleDrop(y2.members, axis2, ...arguments)">
              Drag and drop items you want to graph in y-axis2 here<br>
              <div class="drag" v-for="item in axis2" v-bind:key="item">
                {{item}}
              </div>
              <br>
              <input v-model="y2.label" placeholder="Axis label (leave blank for None)">
            </drop>
            <drop class="drop list" @drop="handleDrop(y3.members, axis3, ...arguments)">
              Drag and drop items you want to graph in y-axis2 here<br>
              <div class="drag" v-for="item in axis3" v-bind:key="item">
                {{item}}
              </div>
              <br>
              <input v-model="y3.label" placeholder="Axis label (leave blank for None)">
            </drop>
          </div>
        </div>
        <br>
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
          <option disabled value="">Select graph period in months</option>
          <option v-for="n in 12" v-bind:key="n">{{ n }}</option>
        </select>
        <select v-model="period" v-else-if="range == 'forever'">
          <option disabled value="">Select graph period in Years</option>
          <option v-for="n in 5" v-bind:key="n">{{ n }}</option>
        </select>
        <button v-on:click="graphCust({'traces':traces, 'range':range, 'period':period, 'site': site, 'measurement': measurement})">Make the graph</button>
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
  postCustomAx, getSites, getSensorDataSiteMeas } from '../../../utils/api'
import AppNav from '../AppNav'
import VueDragDrop from 'vue-drag-drop'
import VuePlotly from '@statnett/vue-plotly'
import Vue from 'vue'
Vue.use(VueDragDrop)
// import Plotly from 'plotly.js/dist/plotly'
export default {
  name: 'graphs',
  data () {
    return {
      axes: 1,
      traces: [],
      y1: {'yaxis': 'y', 'label': '', 'members': []},
      y2: {'yaxis': 'y2', 'label': '', 'members': []},
      y3: {'yaxis': 'y3', 'label': '', 'members': []},
      l1: '',
      l2: '',
      l3: '',
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
      disp: '',
      selection: '',
      types: [],
      AllValues: [],
      sitevals: [],
      typevals: [],
      graph: false,
      buttons: true,
      axis1: [],
      axis2: [],
      axis3: [],
      measurement: ''
    }
  },
  components: {
    AppNav,
    VuePlotly,
    VueDragDrop
  },
  methods: {
    buildAxes (axes) {
      this.axes = axes
    },
    handleDrop (toList, dispList, data) {
			const fromList = this.sitevals;
			if (fromList) {
				toList.push(data.item)
        fromList.splice(data.key, 1)
        dispList.push(data.item.type+'+'+data.item.sensorID)
      }
    },
    startAgain () {
      this.buttons = true
      this.disp = ''
      this.graph = false
      this.selection = ''
      this.selsite = ''
      this.axes = 0
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
        this.AllValues = ret
        this.selection = 'all'
        this.disp = false
        this.buttons = false
      })
    },
    graphCust (payload) {
      payload.traces.push(this.y1)
      payload.traces.push(this.y2)
      payload.traces.push(this.y3)
      postCustomAx(payload).then((ret) => {
        this.layout = ret.data.layout
        this.data = this.convTime(ret.data.data)
        this.graph = true
        this.disp = ''
        this.selection = ''
        this.traces = []
        this.y1 = {'yaxis': 'y', 'label': '', 'members': []}
        this.y2 = {'yaxis': 'y2', 'label': '', 'members': []}
        this.y3 = {'yaxis': 'y3', 'label': '', 'members': []}
        this.axis1 = []
        this.axis2 = []
        this.axis3 = []
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
    },
    getSiteList () {
      getSites().then((ret) => {
        this.selection = 'sites'
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
    this.getSiteList()
    this.getSiteStart()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.drag,
.drop {
  font-family: sans-serif;
  display: inline-block;
  border-radius: 10px;
  background: #ccc;
  position: relative;
  padding: 30px;
  text-align: center;
  vertical-align: top;
}

.trace {
  float: left;
}

.axis {
  clear:both;
}

.drag {
  color: #fff;
  cursor: move;
  background: #777;
  border-right: 2px solid #555;
  border-bottom: 2px solid #555;
}

.drop {
  background: #eee;
  border-top: 2px solid #ccc;
  border-left: 2px solid #ccc;
}
</style>

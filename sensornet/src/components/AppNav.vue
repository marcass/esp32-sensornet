<template>
    <div class="menu">
      <span>
        <tree
          :data="authtreeData"
          class="tree--small"
          @node:selected="onNodeSelected"
        />
      </span>
    </div>
</template>

<script>
import Vue from 'vue'
import LiquorTree from 'liquor-tree'
// global registration
Vue.use(LiquorTree)
export default {
  name: 'app-nav',
  methods: {
    onNodeSelected (node) {
      this.$router.push({name: node.text})
    }
  },
  components: {
    // [tree-nav.name]: LiquorTree
  },
  data: () => ({
    authtreeData: [
      {text: 'GraphingTheThings',
        children: [
          {text: 'Logout'},
          {text: 'CustomGraph'},
          {text: 'UpdatePassword',
          }
        ]
      }
    ]
  })
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*.navbar-right { margin-right: 0px !important}

.log {
  margin: 5px 10px 0 0;
}*/
.menu {
  font-size: 200%;
}
</style>

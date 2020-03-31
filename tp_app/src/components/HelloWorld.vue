<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div id="app">
      <Chart />
    </div>
  <!-- <md-input v-model="name"></md-input>
  <md-button class="md-primary md-raised" v-on:click="addFloat(name)">Add to fleet</md-button> -->
    <h1>LED states</h1>
    <md-table>
      <md-table-row slot="md-table-row">
        <md-table-head md-label="Name">ESP</md-table-head>
        <md-table-head md-label="Actions">Action</md-table-head>
      </md-table-row>
      <md-table-row>
        <md-table-cell md-label="Name">B4:E6:2D:96:78:D9</md-table-cell>
      
        <md-table-cell md-label="Actions">
          <md-button class="md-primary md-raised" v-on:click="switchState('B4:E6:2D:96:78:D9')">PING</md-button>
        </md-table-cell>
      </md-table-row>
      <md-table-row>
        <md-table-cell md-label="Name">80:7D:3A:FD:E8:E8</md-table-cell>
        <md-table-cell md-label="Actions">
          <md-button class="md-primary md-raised" v-on:click="switchState('80:7D:3A:FD:E8:E8')">PING</md-button>
        </md-table-cell>
      </md-table-row>
      <md-table-row>
        <md-table-cell md-label="Name">30:AE:A4:86:CA:7C</md-table-cell>
        <md-table-cell md-label="Actions">
          <md-button class="md-primary md-raised" v-on:click="switchState('30:AE:A4:86:CA:7C')">PING</md-button>
        </md-table-cell>
      </md-table-row>
      <md-table-row>
        <md-table-cell md-label="Name">80:7D:3A:FD:DD:08</md-table-cell>
        <md-table-cell md-label="Actions">
          <md-button class="md-primary md-raised" v-on:click="switchState('80:7D:3A:FD:DD:08')">PING</md-button>
        </md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
//var Highcharts = require("highcharts");
import Chart from "./Chart";

//import highcharts from 'https://code.highcharts.com/highcharts.js'
export default {
  name: "HelloWorld",
  data() {
    return {
      states: [],
      node_url: "http://localhost:3000",
      which_esps: [
        "B4:E6:2D:96:78:D9",
        "80:7D:3A:FD:E8:E8",
        "30:AE:A4:86:CA:7C",
        "80:7D:3A:FD:DD:08"
      ],
      name: ''
    };
  },
  components: {
    Chart
  },
  props: {
    msg: String
  },
  mounted() {},

  methods: {
    start: function() {
      /*    var chart = this.$refs.highcharts.chart;
      chart.credits.update({
        style: {
          color: "#" + ((Math.random() * 0xffffff) | 0).toString(16)
        }
      }); */

      for (var i = 0; i < this.which_esps.length; i++) {
        this.getStates("/esp/led", [], this.which_esps[i]);
      }
    },
    getStates(path_on_node, serie, wh) {
      this.node_url = "http://localhost:3000";

      //https://openclassrooms.com/fr/courses/1567926-un-site-web-dynamique-avec-jquery/1569648-le-fonctionnement-de-ajax
      var liste = [];
      let url = this.node_url + path_on_node + "?who=" + wh;
      fetch(url)
        .then(responseJSON => {
          return responseJSON.json();
        })
        .then(responseJS => {
          this.items = responseJS;

          if (this.items) {
            this.items.forEach(function(element) {
              liste.push([Date.parse(element.date), element.value]);
            });
          }
          serie.data = liste;
        });
    },

    async switchState(wh) {
      var url = this.node_url + "/esp/led";
      var message = "on"
      var header = new Headers();
      header.append("Content-Type", "application/json");
      await fetch(url, {
        method: "POST",
        headers: header,
        body: JSON.stringify({
          message: message,
          who: wh
        })
      });
    },

    async addFlotte(wh){
      this.which_esps.append(wh);
      var url = this.node_url + "/flotte";
      var header = new Headers();
      header.append("Content-Type", "application/json");
      await fetch(url, {
        method: "POST",
        headers: header,
        body: JSON.stringify({
          who: wh
        })
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.md-table-head {
  text-align: center;
}
</style>

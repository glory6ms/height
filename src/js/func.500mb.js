import { ParseData } from './tool.parseData'
import { MB500Layer } from './ocean.weather.mb500'
import  ClipLand  from './tool.clipLand'
import { HeatmapOverlay } from './leafletHeatmap/leaflet-heatmap'
export class Func500mb {

    constructor(map,kind) {
      this._map = map;
      this._kind=kind;
    }

    start() {
      var kind =this._kind;
      this.contourData = [];
      this.hlData = [];
      var row , temp = [];
      // var url = './static/data/500mb.csv';
      var url;
      if(kind==1){
        url = './static/data/hstomap/test1.csv';
      }else if(kind==2){

        url = './static/data/hstomap/test2.csv';
      }else if(kind==3){

        url = './static/data/hstomap/test3.csv';
      }else if(kind==4){
         url = './static/data/hstomap/test4.csv';
      }else if(kind==5){
         url = './static/data/hstomap/test5.csv';
      }else if(kind==6){
         url = './static/data/hstomap/test6.csv';

      }else if(kind==7){

           url = './static/data/hstomap/test7.csv';
      }else if(kind==8){
         url = './static/data/hstomap/test9.csv';}
      ParseData(url, function(results, parser) {
        row = results.data[0];
        if (row.length === 1) {
          if (temp.length) this.contourData.push(temp);
          temp = [];
        } else if (row.length === 3) {
          if ( typeof row[0] !== 'string') temp.push(row);
        } else if (row.length === 4) {
          if ( typeof row[0] !== 'string') this.hlData.push(row);
        }
      },function (results) {
        this.getDataCallback();
      }, this);
    }

    stop　() {
      if (this._map.hasLayer(this._layer)) {
        this._layer.remove();
      }
      if(this._map.hasLayer(this._heatLayer)) {
        this._map.removeLayer(this._heatLayer);
      }
    }

    getDataCallback () {
      if (this._map.hasLayer(this._layer)) {
        this._layer.remove();
      }
      this._layer = new MB500Layer({}, {
        data: this.contourData,
        hlData: this.hlData
      }).addTo(this._map);
      
    }
}

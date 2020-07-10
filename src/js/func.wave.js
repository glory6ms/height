import { ParseData } from './tool.parseData'
import { HeatmapOverlay } from './leafletHeatmap/leaflet-heatmap'
import { WaveLayer } from './ocean.weather.wave'
import  ClipLand  from './tool.clipLand'


export class FuncWave {

  constructor(map,kind,polyline_group,flag) {
    this._map = map;
    this._kind=kind;
    this._polyline_group=polyline_group;
    this._flag=flag
  }

  start() {
    // var area = [[28, 116],[28, -116],[20, -116],[20, 116]];
    // var area1 = [[28, 116+360],[28, -116+360],[20, -116+360],[20, 116+360]];
    // var area2 = [[28, 116-360],[28, -116-360],[20, -116-360],[20, 116-360]];
    // L.polygon(area, {fillColor:'#f00'}).addTo(this._map);
    // L.polygon(area1, {fillColor:'#0f0'}).addTo(this._map);
    // L.polygon(area2, {fillColor:'#00f'}).addTo(this._map);

    // if(this._polyline_group){
    //     console("333")
    // 		// this._map.removeLayer(this._polyline_group);
    // 	}

    if(this._flag==0){
      this._flag=1;
      // this._map.removeLayer(this._polyline_group);
    }


    var kind =this._kind;
    var url,latlngs
    if(kind==1){
      latlngs =[[23.500000,119.000000],[23.000000,118.833333],[22.500000,118.666667],[22.333333,118.666667],[22.166667,118.666667],[22.000000,118.666667],[21.833333,118.666667]]
      url = './static/data/hstomap/hs1.csv';
    }else if(kind==2){
      latlngs =[[23.500000,119.000000],[23.000000,118.833333],[22.500000,118.666667],[22.333333,118.666667],[22.166667,118.666667],[22.000000,118.666667],[21.833333,118.666667],[21.666667,118.666667],
      [21.500000,118.666667],[21.333333,118.666667],[21.166667,118.666667],[20.666667,118.500000],[20.500000,118.500000],[20.333333,118.500000]]

      url = './static/data/hstomap/hs2.csv';
    }else if(kind==3){
      latlngs =[[23.500000,119.000000],[23.000000,118.833333],[22.500000,118.666667],[22.333333,118.666667],[22.166667,118.666667],[22.000000,118.666667],[21.833333,118.666667],[21.666667,118.666667],
      [21.500000,118.666667],[21.333333,118.666667],[21.166667,118.666667],[20.666667,118.500000],[20.500000,118.500000],[20.333333,118.500000],
      [20.166667,118.500000],[19.666667,118.500000],[19.166667,118.500000],[18.833333,118.500000]]

      url = './static/data/hstomap/hs3.csv';
    }
    // var latlngs =[[23.500000,119.000000],[23.000000,118.833333],[22.500000,118.666667],[22.333333,118.666667],[22.166667,118.666667],[22.000000,118.666667],[21.833333,118.666667]]
    this._polyline_group=new L.polyline(latlngs, {color: '#55aaff'}).addTo(this._map);
    this.heatMapData = [];
    this.contourData = [];
    this.hlData = [];
    var row , temp = [];
    // var url = './static/data/wave.csv';
    // var url = './static/data/hstomap/hs1.csv';
    ParseData(url, function(results, parser) {
      row = results.data[0];
      if (row.length === 1) {
        if (temp.length) this.contourData.push(temp);
        temp = [];
      } else if (row.length === 3) {
        if ( typeof row[0] !== 'string') {
          temp.push(row);
          this.heatMapData.push(row);
        }
      } else if (row.length === 2) {
        if ( typeof row[0] !== 'string') this.hlData.push(row);
      }
    },function (results) {
      this.getDataCallback();
    }, this);
  }

  stop　() {
    if(this._map.hasLayer(this._layer)) {
      this._map.removeLayer(this._layer);
    }
    if(this._map.hasLayer(this._heatLayer)) {
      this._map.removeLayer(this._heatLayer);
    }
  }

  getDataCallback () {
    // contour


    // this._layer = new WaveLayer({
    //     isclip:true
    // }, {
    //   data: this.contourData,
    //   hlData: this.hlData
    // }).addTo(this._map);


    // heatmap
    var datacfg = {
      // max: 20,
      max: 3,
      data: this.heatMapData
    };
    var cfg = {
      // radius should be small ONLY if scaleRadius is true (or small radius is intended)
      // if scaleRadius is false it will be the constant radius used in pixels
      "radius": 0.5,
      "blur": 0.99,
      "maxOpacity": .6,
      // scales the radius based on map zoom
      "scaleRadius": true,
      // if set to false the heatmap uses the global maximum for colorization
      // if activated: uses the data maximum within the current map boundaries
      //   (there will always be a red spot with useLocalExtremas true)
      "useLocalExtrema": false,
      // which field name in your data represents the latitude - default "lat"
      latField: '0',
      // which field name in your datsa represents the longitude - default "lng"
      lngField: '1',
      // which field name in your data represents the data value - default "value"
      valueField: '2'
    };
    var rheatmapLayer = this._heatLayer = new HeatmapOverlay(cfg);
    rheatmapLayer.setData(datacfg);
    this._map.addLayer(rheatmapLayer);
    this._layer.on('drawEnd', function () {
        ClipLand.clip(rheatmapLayer._heatmap._renderer.canvas, this._map);
    }, this);
    this._map.on('moveend zoomend', function () {
        ClipLand.clip(rheatmapLayer._heatmap._renderer.canvas, this._map);
    }, this);
  }
}

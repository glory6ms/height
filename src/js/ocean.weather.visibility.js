import { CanvasLayer } from './leaflet.canvasLayer'
import  ClipLand  from './tool.clipLand'

/**
 * 气象图层 - 能见度
 */
export var VisibilityLayer = CanvasLayer.extend({

  options:{
    isclip: false,
    isDrawLeftRight: false,
    showLevel: 5, // 文字的显示级别
    stroke: true,
    color:  '#EECB5F', //'#61A5E8',
    weight: 0.8,
    opacity: 0.55,
    lineCap: 'round',
    lineJoin: 'round',
    // fill: true,
    fillOpacity: 0.3,
    fillColor: '#E16757',
    fillRule: 'evenodd',
    fontSize: '12px',
    fontWeight: 600,
    fontFamily: 'Microsoft YaHei',
    fontColor: '#61A5E8',
    fontStrokeSize: 3,
    fontStrokeColor: '#fff'
  },

  initialize: function (options, config) {
    CanvasLayer.prototype.initialize.call(this, options);
    this.cfg = Object.assign({
      lat: '0',
      lng: '1',
      value: '2',
      data: []
    }, config);
    this._data = this.cfg.data;
  },

  setData: function (data) {
    // -- custom data set
    this._data = data;
    this.needRedraw(); // -- call to drawLayer
  },

  onLayerDidMount: function () {
    // -- prepare custom drawing
  },

  onLayerWillUnmount: function () {
    // -- custom cleanup
  },

  onDrawLayer: function (info) {
    // -- custom  draw
    var canvas = this._canvas = info.canvas;
    var ctx = this._ctx = info.canvas.getContext('2d');
    var map = this._map = info.layer._map;
    var zoom = map.getZoom();
    var data = this._data;
    var points , lpoints, rpoints, text;

    // 创建离屏canvas
    var offScreenCanvas = document.createElement('canvas');
    var offScreenContext = offScreenCanvas.getContext('2d');
    offScreenCanvas.width = canvas.width;
    offScreenCanvas.height = canvas.height;

    offScreenContext.clearRect(0, 0, offScreenCanvas.width, offScreenCanvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    console.time('visibility:render');
    for(let i = 0, len = data.length; i < len; i++) {
      points = this.getPoints(map, data[i]);
      text = data[i][0][this.cfg.value];
      this._drawArea(ctx, points);
      this._drawLine(offScreenContext, points);
      if (this.options.isDrawLeftRight){
        lpoints = this.getLeft360Points(map, data[i]);
        rpoints = this.getRight360Points(map, data[i]);
        this._drawArea(ctx, lpoints);
        this._drawArea(ctx, rpoints);
        this._drawLine(offScreenContext, lpoints);
        this._drawLine(offScreenContext, rpoints);
      }
      if (zoom >= this.options.showLevel) {
        this._drawText(offScreenContext, points[Math.floor(points.length / 2)] ,text);
        if (this.options.isDrawLeftRight){
          this._drawText(offScreenContext, lpoints[Math.floor(points.length / 2)] ,text);
          this._drawText(offScreenContext, rpoints[Math.floor(points.length / 2)] ,text);
        }
      }
    }
    ctx.drawImage(offScreenCanvas, 0, 0, offScreenCanvas.width, offScreenCanvas.height);
    console.timeEnd('visibility:render');

    // clip
    if (this.options.isclip){
      ClipLand.clip(canvas, map);
    }
  },

  getPoints (map, data) {
    var pts = [];
    var latlngs = [], latlng;
    for (let i = 0, len = data.length; i < len; i++){
      latlng = L.latLng(data[i][this.cfg.lat], data[i][this.cfg.lng]);
      latlngs.push(latlng);
    }
    // 跨180度合理化
    latlngs = this._legelLatLngs(latlngs);
    for (let i = 0, len = latlngs.length; i < len; i++){
      pts.push( map.latLngToContainerPoint(latlngs[i]));
    }
    return pts;
  },

  getLeft360Points (map, data) {
    var pts = [];
    var latlngs = [], latlng;
    for (let i = 0, len = data.length; i < len; i++){
      latlng = L.latLng(data[i][this.cfg.lat], Number(data[i][this.cfg.lng]) - 360);
      latlngs.push(latlng);
    }
    // 跨180度合理化
    latlngs = this._legelLatLngs(latlngs);
    for (let i = 0, len = latlngs.length; i < len; i++){
      pts.push( map.latLngToContainerPoint(latlngs[i]));
    }
    return pts;
  },

  getRight360Points (map, data) {
    var pts = [];
    var latlngs = [], latlng;
    for (let i = 0, len = data.length; i < len; i++){
      latlng = L.latLng(data[i][this.cfg.lat], Number(data[i][this.cfg.lng]) + 360);
      latlngs.push(latlng);
    }
    // 跨180度合理化
    latlngs = this._legelLatLngs(latlngs);
    for (let i = 0, len = latlngs.length; i < len; i++){
      pts.push( map.latLngToContainerPoint(latlngs[i]));
    }
    return pts;
  },

  _drawLine: function (ctx, points) {
    var p ;
    ctx.save();
    ctx.beginPath();
    for (let i = 0, len = points.length; i < len; i++){
      p = points[i];
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    this._fillStroke(ctx);
    ctx.restore();
  },

  _drawArea: function (ctx, points) {
    var p ;
    ctx.save();
    ctx.beginPath();
    for (let i = 0, len = points.length; i < len; i++){
      p = points[i];
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.globalAlpha = this.options.fillOpacity;
    ctx.fillStyle = this.options.fillColor || this.options.color;
    ctx.fill(this.options.fillRule || 'evenodd');
    // this._fillStroke(ctx);
    ctx.restore();
  },

  _drawText: function (ctx, pt, text){
    var nm = Number(text * 1000 / 1852).toFixed(1);
    ctx.save();
    ctx.textAlign = 'start';
    ctx.textBaseline = 'middle';
    ctx.font = 'normal ' + this.options.fontWeight + ' ' + this.options.fontSize + ' ' + this.options.fontFamily;
    ctx.fillStyle = this.options.fontColor;
    ctx.strokeStyle = this.options.fontStrokeColor;
    ctx.lineWidth = this.options.fontStrokeSize;
    ctx.strokeText(nm + 'nm', pt.x, pt.y);
    ctx.fillText(nm + 'nm', pt.x, pt.y);
    ctx.restore();
  },

  _fillStroke: function (ctx) {
		var options = this.options;

		if (options.fill) {
			ctx.globalAlpha = options.fillOpacity;
			ctx.fillStyle = options.fillColor || options.color;
			ctx.fill(options.fillRule || 'evenodd');
		}

		if (options.stroke && options.weight !== 0) {
			if (ctx.setLineDash) {
				ctx.setLineDash(this.options && this.options._dashArray || []);
			}
			ctx.globalAlpha = options.opacity;
			ctx.lineWidth = options.weight;
			ctx.strokeStyle = options.color;
			ctx.lineCap = options.lineCap;
			ctx.lineJoin = options.lineJoin;
			ctx.stroke();
		}
	},

 // 计算跨180度问题
  _caculateMeridian: function (latLngA, latLngB) {
    //  var is = this.isCrossMeridian(latLngA, latLngB);
    var is = true;
    if(is) {
      var p = this._map.project(latLngA),
        pb = latLngB,
        pb1 = latLngB.getAdd360LatLng(),
        pb2 = latLngB.getSubtract360LatLng(),
        disb = p.distanceTo(this._map.project(pb)),
        disb1 = p.distanceTo(this._map.project(pb1)),
        disb2 = p.distanceTo(this._map.project(pb2)),
        min = Math.min(disb, disb1, disb2);
      if(min === disb) {
        return pb;
      } else if(min === disb1) {
        return pb1;
      } else {
        return pb2;
      }
    } else {
      return latLngB;
    }
  },

  _legelLatLngs : function (latlngs) {
    var result = [],
      flat = latlngs[0] instanceof L.LatLng,
      len = latlngs.length,
      i;
    for(i = 0; i < len; i++) {
      if(flat) {
        var tempi = latlngs[i];
        if(i >= 1) {
          var tempibefore = result[i - 1];
          result[i] = this._caculateMeridian(tempibefore, tempi);
        } else {
          result[i] = tempi;
        }
      } else {
        result[i] = this._legelLatLngs(latlngs[i]);
      }
    }
    return result;
  }

});

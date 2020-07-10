<template>
  <div id="menu">
    <el-button-group>
      <el-button type="primary" v-for="item in items" :key="item" @click="btnClickEvt(item, $event)">{{item}}</el-button>
    </el-button-group>
  </div>
</template>

<script>
import { FuncWind } from '../js/func.wind'
import { FuncWind2 } from '../js/func.wind2'
import { FuncFlow } from '../js/func.flow'
import { FuncFlow2 } from '../js/func.flow2'
import { FuncPressure } from '../js/func.pressure'
import { FuncVisibility } from '../js/func.visibility'
import { FuncSurge } from '../js/func.surge'
import { Func500mb } from '../js/func.500mb'
import { FuncTemperature } from '../js/func.temperature'
import { FuncWave } from '../js/func.wave'
var polyline_group,flag=0;

export default {
  data() {
    return {
      // items: ['清空所有图层', '风', '风2', '洋流', '涌', '气压', '500mb', '海温', '能见度', '浪高']
      items: ['清空所有图层','波高1', '波高2', '波高3','波高4', '波高5', '波高6','波高7', '波高8']
    };
  },

  methods: {
    btnClickEvt(type, event) {
      var map = this.$parent.$data.map;

      this._funcWind && this._funcWind.stop();
      this._funcWind2 && this._funcWind2.stop();
      this._funcFlow && this._funcFlow.stop();
      this._funcFlow2 && this._funcFlow2.stop();
      this._funcPressure && this._funcPressure.stop();
      this._funcVisibility && this._funcVisibility.stop();
      this._funcSurge && this._funcSurge.stop();
      this._func500mb && 　this._func500mb.stop();
      this._funcTemperature && this._funcTemperature.stop();
      this._funcWave && this._funcWave.stop();
      if(type === '清空所有图层'){
        this._funcWind && this._funcWind.stop();
        this._funcWind2 && this._funcWind2.stop();
        this._funcFlow && this._funcFlow.stop();
        this._funcFlow2 && this._funcFlow2.stop();
        this._funcPressure && this._funcPressure.stop();
        this._funcVisibility && this._funcVisibility.stop();
        this._funcSurge && this._funcSurge.stop();
        this._func500mb && 　this._func500mb.stop();
        this._funcTemperature && this._funcTemperature.stop();
        this._funcWave && this._funcWave.stop();
      } else if(type === '风') {
        if(!this._funcWind) {
          this._funcWind = new FuncWind(map);
        }
        this._funcWind.start();
      } else if(type === '风2') {
        if(!this._funcWind2) {
          this._funcWind2 = new FuncWind2(map);
        }
        this._funcWind2.start();
      } else if(type === '洋流') {
        if(!this._funcFlow) {
          this._funcFlow = new FuncFlow(map);
        }
        this._funcFlow.start();
      } else if(type === '洋流2') {
        if(!this._funcFlow2) {
          this._funcFlow2 = new FuncFlow2(map);
        }
        this._funcFlow2.start();
      } else if(type === '涌') {
        if(!this._funcSurge) {
          this._funcSurge = new FuncSurge(map);
        }
        this._funcSurge.start();
      } else if(type === '气压') {
        if(!this._funcPressure) {
          this._funcPressure = new FuncPressure(map);
        }
        this._funcPressure.start();
      } else if(type === '500mb') {
        if(!this._func500mb) {
          this._func500mb = new Func500mb(map);
        }
        this._func500mb.start();
      } else if(type === '海温') {
        if(!this._funcTemperature) {
          this._funcTemperature = new FuncTemperature(map);
        }
        this._funcTemperature.start();
      } else if(type === '能见度') {
        if(!this._funcVisibility) {
          this._funcVisibility = new FuncVisibility(map);
        }
        this._funcVisibility.start();
      } else if(type === '波高1') {
        var kind = 1;
         this._func500mb && 　this._func500mb.stop();
       if(!this._func500mb) {
         this._func500mb = new Func500mb(map);
       }
       this._func500mb._kind=1;
       this._func500mb.start();

      }else if(type === '波高2') {
        var kind = 2;
         this._func500mb && 　this._func500mb.stop();
       if(!this._func500mb) {
         this._func500mb = new Func500mb(map);
       }
       this._func500mb._kind=2;
       this._func500mb.start();

      }
      else if(type === '波高3') {
        var kind = 3;
         this._func500mb && 　this._func500mb.stop();
        if(!this._func500mb) {
          this._func500mb = new Func500mb(map);
        }
        this._func500mb._kind=3;
        this._func500mb.start();

      }else if(type === '波高4') {
        var kind = 4;
         this._func500mb && 　this._func500mb.stop();
       if(!this._func500mb) {
         this._func500mb = new Func500mb(map);
       }
       this._func500mb._kind=4;
       this._func500mb.start();

      }else if(type === '波高5') {
        var kind = 5;
         this._func500mb && 　this._func500mb.stop();
       if(!this._func500mb) {
         this._func500mb = new Func500mb(map);
       }
       this._func500mb._kind=5;
       this._func500mb.start();

      }
      else if(type === '波高6') {
        var kind = 6;
         this._func500mb && 　this._func500mb.stop();
        if(!this._func500mb) {
          this._func500mb = new Func500mb(map);
        }
        this._func500mb._kind=6;
        this._func500mb.start();

      }else if(type === '波高7') {
        var kind = 7;
         this._func500mb && 　this._func500mb.stop();
       if(!this._func500mb) {
         this._func500mb = new Func500mb(map);
       }
       this._func500mb._kind=7;
       this._func500mb.start();

      }else if(type === '波高8') {
        var kind = 8;
         this._func500mb && 　this._func500mb.stop();
       if(!this._func500mb) {
         this._func500mb = new Func500mb(map);
       }
       this._func500mb._kind=8;
       this._func500mb.start();

      }

    }
  },

  mounted() {

  }
};

</script>

<style>
#menu {
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  z-index: 999;
  text-align: center;
}

</style>

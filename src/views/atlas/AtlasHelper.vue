<template>
  <bs-widgets header="Interaction Helper" class="helper" show-close @close="showHelper = false">
      <div class="helper-list"> 
        <p class="helper-list-sub">All Data Panels</p>
        <div class="helper-list-item">
          <div class="helper-list-item-handle"> 
            <img :src="MouseLeft"/>
          </div>
          <div class="helper-list-item-description">
            <div>
              Single click to select the brain region 
            </div>
            <div>
              Double click to toggle the visibility of brain region in 3D view
            </div>
          </div>
        </div>
        <div class="helper-list-item">
          <div class="helper-list-item-handle"> 
            <img :src="MouseRight"/>
          </div>
          <div class="helper-list-item-description">
            Move to mouse position
          </div>
        </div>
        <div class="helper-list-item">
          <div class="helper-list-item-handle"> 
            <img :src="Ctrl"/>
            <el-icon><Plus/></el-icon>
            <img :src="MouseWheel"/>
          </div>
          <div class="helper-list-item-description">
            Scroll the wheel to zoom in/out
          </div>
        </div>
        <div class="helper-list-item"> 
          <div class="helper-list-item-handle">
            <div class="keyboard">
              <el-icon><ArrowLeft/></el-icon>
            </div>
            <span>or</span>
            <div class="keyboard">
              <el-icon><ArrowRight/></el-icon>
            </div>
          </div>
          <div class="helper-list-item-description">
            Move along the X axis
          </div>
        </div>
        <div class="helper-list-item"> 
          <div class="helper-list-item-handle">
            <div class="keyboard">
              <el-icon><ArrowUp/></el-icon>
            </div>
            <span>or</span>
            <div class="keyboard">
              <el-icon><ArrowDown/></el-icon>
            </div>
          </div>
          <div class="helper-list-item-description">
            <div>
              Move along the Y axis
            </div>
            <div>
              Move along the Z axis when using anatomical coordination
            </div>
          </div>
        </div>
        <div class="helper-list-item"> 
          <div class="helper-list-item-handle">
            <img :src="Comma"/>
            <span>or</span>
            <img :src="Period"/>
          </div>
          <div class="helper-list-item-description">
            <div>Move along the Z axis</div>
            <div>Move along the Y axis when using anatomical coordination</div>
          </div>
        </div>
        <p class="helper-list-sub">2D Plane View</p>
        <div class="helper-list-item"> 
          <div class="helper-list-item-handle">
            <img :src="MouseLeft"/>
          </div>
          <div class="helper-list-item-description">
            Hold the left button to drag
          </div>
        </div>
        <div class="helper-list-item"> 
          <div class="helper-list-item-handle">
            <img :src="Shift"/>
            <el-icon><Plus/></el-icon>
            <img :src="MouseLeft"/>
          </div>
          <div class="helper-list-item-description">
            Rotate the panel via mouse drag
          </div>
        </div>
        <p class="helper-list-sub">3D View</p>
        <div class="helper-list-item"> 
          <div class="helper-list-item-handle">
            <img :src="MouseLeft"/>
          </div>
          <div class="helper-list-item-description">
            Rotate the panel via mouse drag
          </div>
        </div>
        <div class="helper-list-item"> 
          <div class="helper-list-item-handle">
            <img :src="Shift"/>
            <el-icon><Plus/></el-icon>
            <img :src="MouseLeft"/>
          </div>
          <div class="helper-list-item-description">
            Hold the left and shift button to drag
          </div>
        </div>
      </div>
  </bs-widgets>
</template>
<script setup>
import Ctrl from "@/assets/img/ctrl.png";
import MouseLeft from "@/assets/img/mouseleft.png";
import MouseRight from "@/assets/img/mouseright.png";
import MouseWheel from "@/assets/img/wheel.png";
import Comma from "@/assets/img/comma.png";
import Period from "@/assets/img/period.png";
import Shift from "@/assets/img/shiftwin.png";
import BsWidgets from "@/components/bsAtlas/BsWidgets.vue";

import { inject } from "vue";

const showHelper = inject('showHelper');


</script>

<style lang="scss" scoped>
.helper {
  height: 100%;
  padding: 4px 8px;
  h3:before {
    content: "";
    border-left: 5px solid #52c41a;
    margin-right: 8px;
  }
  &-list {
    margin-top: 4px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    &-sub {
      background: #1f1f1f;
      text-align: center;
      margin-top: 8px;
    }
    &-item {
      &-handle {
        display: flex;
        align-items: center;
        justify-items: start;
        gap: 8px;
        img {
          height: 24px;
          object-fit: contain;
        }
        .keyboard {
          width: 32px;
          height: 24px;
          border: 0.5px solid #1668dc;
          border-radius: 4px;
          padding: 2px;
          text-align: center;
          i {
            background: #1668dc;
            height: 17px;
            width: 26px;
            border-radius: 1px;
            top: 0px;
          }
        }
      }
      &-description {
        margin-top: 2px;
      }
    }
  }
}

</style>

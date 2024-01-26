<template>
  <bs-page-form 
    ref="visualDataFormRef"
    :header="$t('visualization.action.addData')"
    label-width="250px"
    :do-cancel="handleCancel"
    :do-form-reset="handleReset"
    :form-model="dataForm"
  >
    <el-form-item :label="$t('visualization.data.isRefer')" required> 
      <el-radio-group v-model="isRefer">
        <el-radio :label="true">{{ $t('label.yes') }}</el-radio>
        <el-radio :label="false">{{ $t('label.no') }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <template v-if="isRefer">
      <el-form-item :label="$t('visualization.data.referData')" required>
        <el-select 
          v-model="referData"
          style="width: 100%;"
          clearable
          filterable
        >  
          <el-option-group
            v-for="group in referDataList"
            :key="group.atlas"
            :label="group.atlas"
          >
            <el-option
              v-for="data in group.datas"
              :key="data.id"
              :label="data.label"
              :value="data.id"
            />
          </el-option-group>
        </el-select>
      </el-form-item>
    </template>
    <template v-else> 
      <el-form-item :label="$t('visualization.data.name')" prop="name" required> 
        <el-input clearable v-model="dataForm.name"/>
      </el-form-item>
      <el-form-item :label="$t('visualization.data.label')" prop="label" required> 
        <el-input clearable v-model="dataForm.label"/>
      </el-form-item>
      <el-form-item :label="$t('visualization.data.downloadable')" prop="downloadable" required> 
        <el-radio-group v-model="dataForm.downloadable">
          <el-radio :label="true">{{ $t('label.yes') }}</el-radio>
          <el-radio :label="false">{{ $t('label.no') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('visualization.data.dataFormat.label')" prop="datasourceType" class="is-required"> 
        <el-radio-group v-model="dataFormat">
          <el-radio :label="true">
            {{ $t('visualization.data.dataFormat.formatted') }}
            <el-link 
              href="https://github.com/google/neuroglancer#supported-data-sources" 
              icon="QuestionFilled"
              class="m-l-8"
              target="_blank"
            />
          </el-radio>
          <el-radio :label="false">{{ $t('visualization.data.dataFormat.unformatted') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="dataFormat" prop="url" required>
        <template #label> 
          <span class="icon-label">
            <el-tooltip :content="$t('visualization.data.tooltip.url')">
              <bs-icon-img icon="QuestionFilled"/>
            </el-tooltip>
            {{ `${$t('visualization.data.url')}${$t('colon')}` }}
          </span>
        </template>
        <el-input clearable v-model="dataForm.url"/>
      </el-form-item>
      <template v-if="dataFormat === false"> 
        <el-form-item :label="$t('visualization.data.renderingEffect')" class="is-required">
          <el-scrollbar> 
            <el-radio-group v-model="convertion" class="convert-type">
              <div style="display: flex">
                <el-radio v-for="c in convetionList" :key="c" :label="JSON.stringify(c)">
                  <div class="select-image">
                    <el-image :src="c.outputExampleImg" fit="fill"/>
                    <div class="select-image-tooltip">
                      <span> {{ c.description }}</span>
                      <bs-icon-img 
                        icon="ZoomIn" 
                        :size="20" 
                        class="zoom-in" 
                        @click.prevent="() => handleZoomIn(c.outputExampleImg)"/>
                    </div>
                  </div>
                </el-radio>
              </div>
            </el-radio-group>
          </el-scrollbar>
        </el-form-item>
        <template v-if="convertion"> 
          <el-form-item :label="$t('visualization.data.sourceFile')" class="is-required" >
            <el-timeline v-if="JSON.parse(convertion).childrenSteps?.length">
              <el-timeline-item 
                v-for="child in JSON.parse(convertion).childrenSteps" 
                :key="child.id" 
                :timestamp="child.name"
                placement="top"
                type="primary"
              >
                <visual-input-requirement :convertion="child"/>
              </el-timeline-item>
            </el-timeline>
            <visual-input-requirement :convertion="JSON.parse(convertion)" v-else />
          </el-form-item>
        </template>
      </template>
    </template>
  </bs-page-form>
  
</template>
<script setup>
import { reactive, ref } from "vue";
import { convetionList } from "../testData";
import { useRouter } from "vue-router";
import BsIconImg from "@/components/BsIconImg.vue";
import VisualInputRequirement from "./VisualInputRequirement.vue";

const props = defineProps({
  atlasId: String,
  subpageId: String
})

const visualDataFormRef = ref();

const dataForm = ref({
  name: "",
  label: "",
  downloadable: false,
  shader: "",
  options: "",
  url: "",
  regionRelated: false
})

const router = useRouter();

const dataFormat = ref();
const convertion = ref();
const isRefer = ref(false);
const referData = ref();

const referDataList = [{
  atlas: "Brainnetome",
  datas: [{
    id: 1,
    name: "regions",
    label: "Brain Regions",
    downloadable: false,
    shader: "",
    options: "",
    regionRelated: false,
    visible: false,
    type: "region",
    url: "",
    atlas: "Brainnetome"
  }, {
    id: 3,
    name: "bigBrain",
    label: "Big Brain",
    downloadable: true,
    shader: "",
    options: "",
    regionRelated: false,
    visible: false,
    type: "image",
    url: "",
    atlas: "Brainnetome"
  }]
}, {
  atlas: "Eeum",
  datas: [{
    id: 2,
    name: "template",
    label: "Template Image",
    type: "image",
    downloadable: true,
    shader: "xxxx",
    options: "{}",
    regionRelated: false,
    visible: true,
    url: "precomputed://xxx/xxx.com",
    atlas: "EEum"
  }]
}]

const handleZoomIn = (imgSrc) => {
  const imgE = document.createElement("img");
  imgE.src = imgSrc;
  imgE.addEventListener("fullscreenchange", (e) => {
    console.log('e', e)
    if(!document.fullscreenElement) {
      imgE.remove();
    }
  })
  document.body.appendChild(imgE);
  imgE.requestFullscreen();
}

const handleReset = () => {
  console.log('do form reset')
  dataFormat.value = undefined;
  convertion.value = undefined;
  isRefer.value = false;
  referData.value = undefined;
}

const handleCancel = () => {
  history.state.back ? 
    router.back() : 
    router.push(`http://127.0.0.1:5173/visualize/atlas/${props.atlasId}/detail`);
}

</script>
<style lang="scss" scoped>
:deep(.page-form) {
  width: 90%;
}
.convert-type {
  display: flex;
  //flex-wrap: wrap;
  :deep(.el-radio__input) {
    display: none;
  }
  :deep(.el-radio) {
    height: auto;
  }
  .el-radio.is-checked .select-image {
    border: 3px solid var(--el-color-primary);
  }
}

:deep(.el-timeline-item__timestamp) {
  color: var(--el-text-color-regular);
}

.select-image {
  width: 320px;
  height: 180px;
  margin-bottom: 8px;
  border-radius: 8px;
  overflow: hidden;
  .el-image {
    width: 100%;
    height: 100%;
  }
  &-tooltip {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    background: rgba(255,255,255,0.78);
    white-space: normal;
    font-size: 18px;
    color: #237804;
    padding: 8px 12px;
    opacity: 0;
    transition: all .3s ease;
    font-weight: bold;
    .zoom-in {
      position: absolute;
      bottom: 16px;
      left: calc(50% - 10px);
      color: var(--el-text-color-regular);
      &:hover {
        transform: scale(1.3);
        color: #237804;
      }
    }
    &:hover {
      opacity: 1;
    }
  }
  
}
</style>
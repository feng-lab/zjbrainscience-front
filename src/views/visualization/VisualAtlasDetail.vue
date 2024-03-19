<template> 
<el-card class="m-b-16">
  <template #header>
    <div class="between-flex"> 
      <span>{{ $t('label.basicInfo') }}</span>
      <div> 
        <el-button 
          type="primary"  
          class="m-r-8" 
          link 
          icon="View" 
          @click="goToPath(`/atlas/display/${atlas.id}`)">{{ $t('button.view') }}</el-button>
        <el-button type="primary"  class="m-r-8" link icon="Edit">{{ $t('button.edit') }}</el-button>
        <el-link 
          type="primary" 
          :href="`${atlas?.rootPath}/public`"
          target="_blank"
          icon="Download"
        > 
          {{ $t('visualization.action.download') }}
        </el-link>
      </div>
    </div>
  </template>
  <el-row :gutter="8"> 
    <el-col :span="20">
      <el-descriptions :column="3" >
        <el-descriptions-item :label="$t('visualization.properties.title')">
          {{ atlas?.title }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('visualization.properties.specy')">
          <el-tag class="el-tag--blue"> {{ atlas?.specy}} </el-tag>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('visualization.properties.name')">
          {{ atlas?.name}}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('visualization.properties.creator')">
          {{ atlas?.creator}}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('visualization.properties.createTime')">
          {{ atlas?.createTime}}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('visualization.properties.public')">
          <el-switch 
            v-model="atlas.isPublic"
            :active-text="$t('label.yes')"
            :inactive-text="$t('label.no')"
            style="--el-switch-off-color: #ff4d4f"
            inline-prompt
          />
        </el-descriptions-item>
        <el-descriptions-item :label="$t('visualization.properties.team')">
          {{ atlas?.team }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('visualization.properties.teamLeader')">
          {{ atlas?.teamLeader }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('visualization.properties.url')">
          {{ atlas?.url}}
        </el-descriptions-item>

      </el-descriptions>
    </el-col>
    <el-col :span="4">
      <el-image :src="`${atlas?.rootPath}/preview.png`" class="preview-image" fit="contain">
        <template #error> 
          <div class="preview-image-error center-flex"> 
            <el-tooltip :content="$t('visualization.tooltip.preview')"> 
              Preview
            </el-tooltip>
          </div>
        </template>
      </el-image>
    </el-col>

  </el-row>
</el-card>
<el-card :header="$t('visualization.module.subpage')">
  <div class="atlas-subpage-list"> 
    <bs-drop-item 
      class="atlas-subpage-item" 
      v-for="subpage in subpageList" 
      :key="subpage.name" 
      tag="subpage" 
      :carried-data="subpage.id" 
      @drop-done="handleMoveData"
    >
      <div class="atlas-subpage-item--title between-flex">
        <span class="icon-label">
          <bs-icon-img :icon="BsIconPage" :size="18"/>
          <span> {{ subpage.title }} </span>
        </span>
        <el-dropdown trigger="click"> 
          <bs-icon-img :icon="BsIconMore" :size="18" style="cursor: pointer"/>
          <template #dropdown> 
            <el-dropdown-menu> 
              <el-dropdown-item 
                @click="handleAddData(subpage.id)"
                icon="Plus" > {{ $t('visualization.action.addData') }} </el-dropdown-item>
              <el-dropdown-item 
                @click="handleShowSubpageForm(subpage.id)" 
                icon="Edit" divided > {{ $t('button.edit') }} </el-dropdown-item>
              <el-dropdown-item 
                @click="handleDeleteSubpage(subpage.id, subpage.title)"
                icon="Delete">{{ $t('button.delete') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="atlas-subpage-item--datas" v-if="subpage?.datas?.length || subpage?.referenceData?.length">
        <el-scrollbar height="446px">

        <el-tooltip 
          v-for="data in subpage.datas" 
          :key="data.name"
          :content="$t('visualization.data.tooltip.converting')" :disabled="data.visible">
          <bs-drag-item style="width: 100%;" :data="{ 'text/plain' : JSON.stringify(data)}"> 
            <div class="atlas-subpage-item--datas-item between-flex m-b-8" > 
              <div class="icon-label">
                  <bs-icon-img :icon="data.visible ? 'Checked': 'Failed'"/>
                <span class="title"> {{ data.title }} </span>
              </div>
              <div>
                <el-button :disabled="!data.visible" icon="Edit" circle size="small" type="primary" @click="handleShowUpdateDataForm(data.id)"/>
                <el-button :disabled="!data.visible" icon="Switch" circle size="small" class="el-button--blue" @click="handleDataConvert = true"/>
                <el-button :disabled="!data.visible" icon="Share" circle size="small" :type="data.downloadable ? 'warning': ''" @click="changeDataDownloadable(data)"/>
                <el-button :disabled="!data.visible" icon="Delete" circle size="small" type="danger" @click="handleDeleteData(data)"/>
              </div>
            </div>
          </bs-drag-item>
        </el-tooltip>
        <el-tooltip :content="$t('visualization.data.referData')" v-for="data in (subpage?.referenceData??[])" :key="data.id">
          <bs-drag-item style="width: 100%;" :data="{ 'text/plain' : JSON.stringify({...data, refer: true, srcSubpage: subpage.id})}"> 
            <div class="atlas-subpage-item--datas-item between-flex m-b-8" >
              <div class="icon-label">
                  <bs-icon-img :icon="BsIconRefer"/>
                <span class="title"> {{ data.title }} </span>
              </div>
              <el-button icon="Delete" circle size="small" type="danger" @click="handleDeleteData(data)"/>
            </div>
          </bs-drag-item>
        </el-tooltip>
        </el-scrollbar>
      </div>
    </bs-drop-item>
    <bs-new-item 
      width="500px" 
      height="300px" 
      v-if="subpageList[0]?.datas?.length" 
      :content="$t('visualization.action.newSubpage')"
      @click="handleShowSubpageForm()"/>
  </div>
</el-card>
<visual-subpage-form v-model="showSubpageForm" v-model:cu-id="subpageId"/>
<visual-update-data-form v-model="showUpdateDataForm" v-model:cu-id="updateDataId"/>
<bs-dialog-form
  v-model="handleDataConvert"
  :title="$t('visualization.action.convert')"
> 
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
</bs-dialog-form>

</template>
<script setup>
import { ref, h } from "vue";
import BsNewItem from "@/components/BsNewItem.vue";
import BsIconPage from "@/components/icons/BsIconPage.vue";
import BsIconImg from "@/components/BsIconImg.vue";
import BsIconMore from "@/components/icons/BsIconMore.vue";
import VisualSubpageForm from "./forms/VisualSubpageForm.vue";
import { useShowForm } from "@/compositions/useShowForm";
import { useUtils } from "@/compositions/useUtils";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import VisualUpdateDataForm from "./forms/VisualUpdateDataForm.vue";
import VisualInputRequirement from "./forms/VisualInputRequirement.vue";
import BsDialogForm from "@/components/form/BsDialogForm.vue";
import { convetionList } from "./testData";
import BsDragItem from "@/components/BsDragItem.vue";
import BsIconRefer from "@/components/icons/BsIconRefer.vue";
import BsDropItem from "@/components/BsDropItem.vue";
import { ElButton, ElMessageBox, ElRadio, ElRadioGroup } from "element-plus";

const props = defineProps({
  atlasId: String
})

const atlas = ref({
 id:1,
 name: "bn_atlas",
 title: "Brainnetome Human Atlas",
 specy: "human",
 url: "http://www.brainnetome.org",
 isPublic: true,
 owner: "system",
 rootPath: "http://10.11.140.35:2000/atlas_data/bn_atlas",
 creator: "root",
 creatorId: "root",
 createTime: "2022-12-22 00:00:00",
 visible: true,
 team: "Jiang Lab",
 teamLeader: "Jiang"
});

const handleDataConvert = ref(false);
const convertion = ref()
convertion.value = JSON.stringify(convetionList[0])

const { showForm:showSubpageForm, itemId: subpageId, handleShowForm: handleShowSubpageForm } = useShowForm();
const { showForm:showUpdateDataForm, itemId: updateDataId, handleShowForm: handleShowUpdateDataForm} = useShowForm();
const i18n = useI18n();
const { systemConfirm, goToPath } = useUtils();
const router = useRouter();

const subpageList = ref([{
  id: 1,
  name: "default",
  title: "Default",
  //datas: []
  datas: [{
    id: 1,
    name: "regions",
    title: "Brain Regions",
    visible: false,
    subpageId: 1
  }, {
    id: 2,
    name: "images",
    title: "Template Image",
    downloadable: true,
    subpageId: 1,
    visible: true
  }],
  referenceData:[{
    id: 3,
    name: "brain",
    title: "Sctructure",
    path: "xxx"
  }]
}, {
  id: 2,
  name: "test",
  title: "Test"
}])

const handleDeleteSubpage = (id, title) => {
  systemConfirm(
    i18n.t("visualization.subpage.deleteConfirm", {title}),
    async () => {
      console.log('delete subpage id', id)
      ElMessage.success(i18n.t("elmessage.deleteSuccess"));
    }
  )
}

const handleAddData = (subpageId) => {
  router.push(`/visualize/atlas/${props.atlasId}/subpage/${subpageId}/newData`)
}

const changeDataDownloadable = (data) => {
  const { downloadable, title: label } = data;
  const message = downloadable ? 
    i18n.t("visualization.data.confirm.closeDownloadable", { label }):
    i18n.t("visualization.data.confirm.openDownloadable", { label });
  systemConfirm(message, () => {
    console.log('change to', !downloadable);
  })
  console.log('data downloadable', downloadable)
}

const handleDeleteData = (data) => {
  const message = i18n.t("visualization.data.confirm.delete", {label: data.title});
  systemConfirm(message, () => {
    console.log('delete data', data.id)
  })
}

const MOVE_TYPE = {
  COPY_SELF_DATA : 0, 
  MOVE_SELF_DATA : 1, 
  COPY_REFERENCE_DATA : 2, 
  MOVE_REFERENCE_DATA : 3 
}

const moveHandler = {
  [MOVE_TYPE.COPY_SELF_DATA]: (data, target) => {
    console.log(`copy self data ${data.id} to target subpage ${target}`);
  },
  [MOVE_TYPE.MOVE_SELF_DATA]: (data, target) => {
    console.log(`move self data ${data.id} to target subpage ${target}`);
  },
  [MOVE_TYPE.COPY_REFERENCE_DATA]: (data, target) => {
    console.log(`copy refer data ${data.id} to target subpage ${target}`);
  },
  [MOVE_TYPE.MOVE_REFERENCE_DATA]: (data, target) => {
    console.log(`move refer data ${data.id} to target subpage ${target}`);
  },
}


const handleMoveData = (e, moveToId) => {
  const moveData = JSON.parse(e.dataTransfer.getData("text/plain")); 
  const { refer, srcSubpage, id:dataId, subpageId:fromId} = moveData;
  if(srcSubpage && srcSubpage === moveToId || fromId === moveToId) {
    return;
  }
  const action = ref(); 
  ElMessageBox({
    title: "Confirm",
    showCancelButton: true,
    callback: (a) => {
      if(a === "cancel") return;
      const handlerType = (Number(!!refer) << 1) | action.value;
      moveHandler[handlerType](moveData, moveToId);
    },
    message: () => 
     h("div", null, [
       h("div", null, i18n.t("visualization.data.confirm.copyOrMove", { subpage: moveToId })),
       h(ElRadioGroup, {
        modelValue: action.value,
        'onUpdate:modelValue': (val) => {
          action.value = val
        },
       }, () => [
        h(ElRadio, { label: 0}, () => i18n.t("button.copy")),
        h(ElRadio, { label: 1}, () => i18n.t("button.move")),
       ])
     ])
  })
}


</script>
<style lang="scss" scoped>
.preview-image {
  width: 200px;
  height: 120px;
  &-error {
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 30px;
  }
}

.atlas-subpage-list {
  display: flex;
  align-items: center;
  gap: 16px;
}
.atlas-subpage-item {
  width: 500px;
  height: 300px;
  box-sizing: border-box;
  box-shadow: 0 0 6px 0 rgba(0,0,0,0.3);
  border-radius: 4px;
  overflow: hidden;
  &--title {
    line-height: 40px;
    height: 40px;
    padding: 0 12px;
    font-size: 18px;
    color: var(--el-text-color-regular);
    font-weight: bold;
    border-bottom: 1px solid var(--el-fill-color);
  }
  //&--title {
  //  height: 40px;
  //  line-height: 40px;
  //  background: var(--el-color-primary);
  //  color: white;
  //  text-align: center;
  //  font-weight: bold;
  //  font-size: 1.5em
  //}
  &--datas {
    padding: 8px 12px;
    height: 160px;
    &-item {
      background: var(--el-fill-color);
      padding: 8px;
      border-radius: 8px;
      .title {
        color: var(--el-text-color-regular);
        font-weight: bold;
      }
    }

  }
}
</style>
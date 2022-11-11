<template>
  <el-card>
    <template #header>
      <div class="between-flex">
        <span>{{ $t("search.card.signal") }}</span>
        <span>
          <el-button type="primary" >{{ $t("button.upload") }}</el-button>
          <el-button type="primary" >{{ $t("button.online") }}</el-button>
          <el-button type="primary" >{{ $t("button.search") }}</el-button>
        </span>
      </div>
    </template>
    <div class="between-flex">
      <span>
        <span class="m-r-4 m-b-16">{{ $t("label.channel") }}</span>
        <el-select class="m-r-16"/>
        <span class="m-r-4">{{ $t("label.window") }}</span>
        <el-input-number class="length-input"/>
        <span class="m-r-8 m-l-8">-</span>
        <el-input-number class="length-input"/>
      </span>
      <span>
        <!--
        <span>当前第 {{ currPage }} 页</span>
        <el-button-group class="m-l-16">
          <el-button type="primary" icon="ArrowLeft">上一页</el-button>
          <el-button type="primary">
            下一页<el-icon class="m-l-8"><ArrowRight/></el-icon>
          </el-button>
        </el-button-group>
        -->
        <el-pagination
          layout="prev,pager,next,slot"
          :page-count="7"
          :pager-count="5"
        >
        </el-pagination>
      </span>
    </div>
  </el-card>
  <el-card :header="$t('search.card.result')" class="m-t-16">
  </el-card>
  
</template>

<script setup>
import { ref } from "vue";
const currPage = ref(0)
</script>

<style lang="scss" scoped>
.length-input {
  width: 15%;
  margin-top: 4px;
}
</style>
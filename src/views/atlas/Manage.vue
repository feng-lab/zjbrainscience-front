<template>
  <div class="dark manage">
    <h1 class="header m-b-24">New Brain Atlas Datasets</h1>
    <el-card>
      <bs-form
        ref="atlasFormRef"
        :form-model="atlasForm"
        :form-rules="rules"
        label-width="200px"
        :do-form-submit="handleSubmit"
        :do-cancel="handleCancel"
      >
        <el-form-item label="Atlas Name" prop="name">
          <el-input v-model="atlasForm.name"/>
        </el-form-item>
        <el-form-item label="Atlas Title" prop="title">
          <el-input v-model="atlasForm.title"/>
        </el-form-item>
        <el-form-item label="Atlas Url" prop="url">
          <el-input v-model="atlasForm.url"/>
        </el-form-item>
        <el-form-item label="Atlas Whole Segment Id" prop="whole_segment_id">
          <el-input v-model="atlasForm.whole_segment_id"/>
        </el-form-item>
      </bs-form>
    </el-card>
  </div>
  
</template>

<script setup>
import { createAtlas } from "@/api/atlas";
import BsForm from "../../components/form/BsForm.vue";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const atlasFormRef = ref();
const atlasForm = ref({
  name: "",
  url: "", 
  title: "",
  whole_segment_id: ""
})

const rules = reactive({
  name: [{
    required: true
  }],
  title: [{
    required: true
  }]
})

const handleSubmit = async () => {
  const id = await createAtlas(atlasForm.value);
  router.push("/atlas/index");
}

const handleCancel = () => {
  atlasFormRef.value.reset();
  router.push("/atlas/index");
}


</script>


<style lang="scss" scoped>
.manage {
  width: 50%;
  height: 50vh;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  .header {
    color: #1668dc;
    text-align: center;
  }

}
</style>
<template>
  <el-form 
    inline 
    :ref="(el) => params.formRef = el"
    :model="params.form" 
    :rules="rules"
    label-position="top"
    :label-suffix="$t('colon')"
  >
    <el-row class="fir-params" :gutter="16">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-form-item label="L_freq" prop="L_freq">
          <el-input v-model="params.form.L_freq"/>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-form-item label="H_freq" prop="H_freq">
          <el-input v-model="params.form.H_freq"/>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-form-item label="CH_picks" prop="CH_picks">
          <el-input v-model="params.form.CH_picks"/>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-form-item label="Methods" prop="Methods">
          <el-radio-group v-model="params.form.Methods">
            <el-radio label="IIR"/>
            <el-radio label="FIR" />
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row class="fir-params methods-params" :gutter="16"> 
      <el-col :xs="24" :sm="12" :lg="6" v-if="params.form.Methods === 'IIR'">
        <el-form-item label="Params" >
          <el-input v-model="params.form.Params"/>
        </el-form-item>
      </el-col>
      <template v-else> 
        <el-col :xs="24" :sm="12" :lg="8">
          <el-form-item label="I_trans_bnaswidth" >
            <el-input v-model="params.form.I_trans_bnaswidth"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="8">
          <el-form-item label="Design" >
            <el-select v-model="params.form.Design" style="width: 100%"> 
              <el-option value="firwin" label="firwin"/>
              <el-option value="firwin2" label="firwin2"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="8">
          <el-form-item label="Length">
            <el-input v-model="params.form.Length"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="8">
          <el-form-item label="I_trans_bnaswidth" >
            <el-input v-model="params.form.I_trans_bandwidth"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="8">
          <el-form-item label="Window" >
            <el-select v-model="params.form.Window" style="width: 100%"> 
              <el-option value="hanmming" label="hanmming"/>
              <el-option value="hann" label="hann"/>
              <el-option value="blackman" label="blackman"/>
            </el-select>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
  </el-form>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n"

const props = defineProps({
  params: Object
})


const i18n = useI18n();

const rules = computed(() => ({
  L_freq: [
    {required: true, message: i18n.t("valid.require", { field: "L_freq", action: i18n.t("action.input") }), trigger: "blur"}
  ],
  H_freq: [
    {required: true, message: i18n.t("valid.require", { field: "H_freq", action: i18n.t("action.input") }), trigger: "blur"}
  ],
  CH_picks: [
    {required: true, message: i18n.t("valid.require", { field: "CH_picks", action: i18n.t("action.input") }), trigger: "blur"}
  ],
  Methods: [
    {required: true, message: i18n.t("valid.require", { field: "Methods", action: i18n.t("action.select") }), trigger: "change"}
  ],
}))

</script>

<style lang="scss" scoped>
.fir-params {
  width: 100%;
  .el-form-item {
    margin-right: 0;
  }
}

.methods-params {
  padding: 12px 8px 0;
  background: var(--el-fill-color-light);

}
</style>
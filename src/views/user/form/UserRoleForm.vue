<template>
  <bs-dialog-form
    :title="$t('user.updateRole')"
    :form-rules="rules"
    :form-model="roleForm"
    :do-form-submit="handleSubmit"
    @open="handleOpened"
  >
    <el-form-item :label="$t('user.currentUser')">
      {{ roleForm.username }}
    </el-form-item>
    <el-form-item :label="$t('user.currentAl')">
      {{ $t(`auth.${prevAccessLevel}`) }}
    </el-form-item>
    <el-form-item :label="$t('user.accessLevel') " prop="access_level">
      <el-select v-model="roleForm.access_level">
        <el-option
          v-for="level in ACCESS_LEVEL"
          :key="level"
          :value="level"
          :disabled="level === prevAccessLevel"
          :label="$t(`auth.${level}`)"
        />
      </el-select>
    </el-form-item>
  </bs-dialog-form>
</template>

<script setup>
import { ACCESS_LEVEL } from '@/utils/common';
import { userInfoApi, updateUserRoleApi } from "@/api/user";
import { ref } from "vue";
import { useI18n } from 'vue-i18n';

const props = defineProps({
  id: Number 
})

const i18n = useI18n();

const prevAccessLevel = ref();
const roleForm = ref({
  access_level: null
})

const rules = computed(() => ({
  access_level: [{ 
    required: true, 
    message: i18n.t("valid.require", {action: i18n.t("action.select"), field: i18n.t("user.accessLevel")}), 
    trigger: "change"
  }],
}));

const handleOpened = async () => {
  roleForm.value = props.id && await userInfoApi(props.id);
  prevAccessLevel.value = roleForm.value?.access_level;
}

const handleSubmit = () => {
  const { access_level } = roleForm.value;
  return updateUserRoleApi({
    id: props.id,
    access_level: roleForm.value.access_level
  })
}

</script>
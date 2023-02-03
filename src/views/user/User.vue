<template> 
  <admin-table-page
    ref="tableRef"
    :columns="columns"
    :fetch-method="getUserApi"
    :action-column="actionColumn"
    :tool-buttons="toolButtons"
    :search-fields="searchFields"
    :hidden-search-fields="hiddenSearchFields"
    list-key="items"
    :locale="locale"
    row-key="id"
  >
    <template #access_level="{ row }">
      {{ $t(`auth.${row.access_level}`) }}
    </template>
  </admin-table-page>
  <user-form
    v-model="showUserForm"
    @submit-success="()=>tableRef.reload()"
  /> 
  <user-role-form
    v-model="showRoleForm"
    v-model:id="editUser"
    @submit-success="()=>tableRef.reload()"
  />

</template>

<script setup> 
import { AdminTablePage } from "admin-table-page";
import UserForm from "./form/UserForm.vue";
import UserRoleForm from "./form/UserRoleForm.vue";
import { computed, ref } from "vue";
import { useI18n } from 'vue-i18n';
import { getUserApi, deleteUserApi } from '@/api/user';
import { useUtils } from "@/compositions/useUtils";
import { ElMessage } from "element-plus";
import { ACCESS_LEVEL } from "@/utils/common";
import { storeToRefs } from "pinia";
import useGlobalStore from "@/stores/global";
import useUserStore from "@/stores/user";

const i18n = useI18n();
const { systemConfirm } = useUtils();

const showUserForm = ref(false);
const showRoleForm = ref(false);
const editUser = ref();
const tableRef = ref();
const { locale } = storeToRefs(useGlobalStore());
const { doLogout, user } = useUserStore();


const columns = computed(() => ([{
  prop: "username",
  label: i18n.t("user.username"),
}, {
  prop: "access_level",
  label: i18n.t("user.accessLevel")
}, {
  prop: "last_login_time",
  label: i18n.t("user.lastLogin")
}])) 

const actionColumn = computed(() => ([{
  text: i18n.t("button.edit"),
  onClick: (row) => {
    editUser.value = row.id;
    showRoleForm.value = true;
  }
}, {
  text: i18n.t("button.delete"),
  onClick: (row) => {
    systemConfirm(
      i18n.t("user.deleteConfirm", { user: row.username }),
      async () => {
        await deleteUserApi(row.id);
        ElMessage.success(i18n.t("button.delete")+i18n.t("status.success"))
        if(row.username === user.username) {
          doLogout(true);
        }
        tableRef.value.reload();
      }
    )
  }
}]))

const toolButtons = computed(() => [{
  text: i18n.t("button.newUser"),
  icon: "Plus",
  onClick: () => { 
    showUserForm.value = true;
  }
}])

const searchFields = computed(() =>[{
  name: "username",
  label: i18n.t("user.username"),
}, {
  name: "access_level",
  label: i18n.t("user.accessLevel"),
  searchType: "select",
  options: ACCESS_LEVEL.map(level => ({
    value: level,
    label: i18n.t(`auth.${level}`)
  }))
}])

const hiddenSearchFields = computed(() => ([{
  name: "staff_id",
  label: i18n.t("user.staff_id")
}]))

const onAddUserSuccess = () => {
  tableRef.value.reload();
}
</script>

<style lang="scss">
@use "admin-table-page/style/index.scss";
</style>
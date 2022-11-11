<template>
  <div class="header-content">
    <div class="header-content--left">
      <el-icon 
        @click="toggleCollapse" 
        class="header-icon hidden-md-and-down"
      >
        <component :is="isCollapse?'Expand':'Fold'"/>
      </el-icon>
      <el-icon 
        @click="toggleDrawer"
        class="header-icon hidden-md-and-up"
      >
        <IconMenu/>
      </el-icon>
    </div>
    <div class="header-content--right">
      <div class="action">
        <el-dropdown
          :hide-on-click="false"
          trigger="click"
        >
          <el-badge 
            :max="10" 
            :value="messageCnt"
            :hidden="!messageCnt"
            class="m-r-16 m-t-4 action-badge"
          >
            <el-icon><Message/></el-icon>
          </el-badge>
          <template #dropdown> 
              <div class="p-8 message-header">
                <span>{{ $t("label.notice") }}</span>
              </div>
              <el-empty v-if="nodata" class="message-nodata" :image-size="32"/>
              <template v-else>
                <TheNoticeMsg 
                  v-for="(message, index) in msgList"
                  @click="handleClickMsg(message.id, index, message.status)"
                  :key="message.id"
                  :message="message"
                />
              </template>
              <div class="message-button">
                <el-button link :disabled="nodata" @click="markAll">
                  <el-icon><IconClear/></el-icon>
                  {{ $t("button.read") }}
                </el-button>
                <el-divider direction="vertical"/>
                <el-button link :disabled="nodata">
                {{ $t("button.more") }}
                <el-icon><DArrowRight/></el-icon>
                </el-button>
              </div>
          </template>
        </el-dropdown>
      </div>
      <div class="action">
        <el-dropdown>
          <span class="avatar">
            <el-icon>
              <IconAvatar/>
            </el-icon>
            {{ user.name }} 
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item icon="switch-button" @click="doLogout">{{ $t('button.logout') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown> 
      </div>
      <div class="action">
        <TheLangChange
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import useGlobalStore from "@/stores/global";
import useUserStore from "@/stores/user";
import { storeToRefs } from "pinia";
import IconMenu from "@/components/icons/IconMenu.vue";
import TheLangChange from "@/components/TheLangChange.vue";
import IconAvatar from "@/components/icons/IconAvatar.vue";
import IconClear from "@/components/icons/IconClear.vue";
import jsCookie from "js-cookie";

import { unReadMsgApi, markMsgApi } from "@/api/common"; 

const router = useRouter();
const globalStore = useGlobalStore();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const { doLogout } = userStore;
const account = jsCookie.get("account");
if(!user.value.name) {
  user.value.name = account;
}
const { isCollapse } = storeToRefs(globalStore);
const { toggleCollapse, toggleDrawer } = globalStore;

const nodata = computed(() => msgList.value.length === 0)
let timer = null;

const msgList = ref([]);
onMounted(async () => {
  getUnReadMsg();
  timer = setInterval(getUnReadMsg, 60 * 5 * 1000)
})

onUnmounted(() => {
  clearInterval(timer);
})

const getUnReadMsg = async () => {
  msgList.value = await unReadMsgApi();
}

const messageCnt = computed(() => {
  return msgList.value.filter(msg => !msg.status).length
})

const handleClickMsg = async (id, index, status) => {
  if(!status) {
    await markMsgApi(account, id);
    msgList.value[index].status = 1;
  }
  router.push(`/task/${id}`);
}

const markAll = async () => {
  msgList.value.forEach(msg => msg.status = 1);
  await markMsgApi(account, "all")
}
</script>
<style scoped lang="scss">
.badge-icon {
  :deep(.el-badge__content) {
    zoom: 0.8;
  }
}
.header-content {
  >* {
    height: 100%;
  }
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 24px;
  height: 100%;
  box-shadow: 0 1px 4px  #b1b3b8;
  overflow: hidden;
  &--left {
    flex: 1 1 0%;
    display: flex;
    align-items: center;
    .header-icon {
      font-size: 20px;
      cursor: pointer;
    }
  }
  &--right {
    display: flex;
    float: right;
    overflow: hidden;
    margin-left: auto;
    align-items: center;
    gap:24px;
    .action {
      cursor: pointer;
      display: flex;
      align-items: center;
      height: var(--brain-header-height);
      font-size: 18px;
      .avatar {
        display: flex;
        align-items: center;
        font-size: 18px;
        gap: 4px;
        i {
          font-size: 24px;
        }
      }
    }
    .action-badge {
      font-size: 18px;
      :deep(.el-badge__content) {
        zoom: 0.8
      }
    }
  }
}

.message{
  &-nodata {
    border-top: 1px solid var(--el-border-color-lighter);
  }
  &-button {
    padding: 8px 16px;
    display: flex;
    align-items: center;
    white-space: nowrap;
    justify-content: space-around;
    border-top: 1px solid var(--el-border-color-lighter);
  }
}

</style>
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
        <bs-icon-menu/>
      </el-icon>
    </div>
    <div class="header-content--right">
      <div class="action">
        <el-dropdown
          :hide-on-click="false"
          trigger="click"
          @visible-change="handleVisibleNotify"
        >
          <el-badge 
            :max="100" 
            :value="unReadCount"
            :hidden="!unReadCount"
            class="m-r-16 m-t-4 action-badge"
          >
            <el-icon><Message/></el-icon>
          </el-badge>
          <template #dropdown> 
              <div class="p-8 message-header">
                <span>{{ $t("label.notice") }}</span>
              </div>
              <el-empty v-if="!msgList.length" class="message-nodata" :image-size="32"/>
              <template v-else>
                <bs-notice-msg
                  v-for="(message, index) in msgList"
                  @click="handleClickMsg(message, index)"
                  :key="message.id"
                  :message="message"
                />
              </template>
              <div class="message-button">
                <el-button link :disabled="!unReadCount" @click="markAll">
                  <el-icon class="m-r-4"><bs-icon-clear/></el-icon>
                  {{ $t("notify.action.allMark") }}
                </el-button>
                <el-divider direction="vertical"/>
                <el-button link @click="goToNotification">
                  {{ $t("button.more") }}
                <el-icon class="m-l-4"><DArrowRight/></el-icon>
                </el-button>
              </div>
          </template>
        </el-dropdown>
      </div>
      <div class="action">
        <el-dropdown>
          <span class="avatar">
            <el-icon>
              <bs-icon-avatar/>
            </el-icon>
            {{ user.username }} 
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item icon="lock" @click="goToPassword">{{ $t('menus.password') }}</el-dropdown-item>
              <el-dropdown-item icon="switch-button" @click="doLogout">{{ $t('button.logout') }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown> 
      </div>
      <div class="action">
        <bs-lang-change/>
      </div>
    </div>
  </div>
</template>
<script setup>
import BsIconMenu from "@/components/icons/BsIconMenu.vue";
import BsLangChange from "@/components/BsLangChange.vue";
import BsIconAvatar from "@/components/icons/BsIconAvatar.vue";
import BsIconClear from "@/components/icons/BsIconClear.vue";

import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import useGlobalStore from "@/stores/global";
import useUserStore from "@/stores/user";
import { storeToRefs } from "pinia";
import { unReadNotifyCountApi, unReadNotifyListApi } from "@/api/notification";
import { useNotification } from "@/compositions/useNotification";

const router = useRouter();
const globalStore = useGlobalStore();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const { doLogout, getUserInfo } = userStore;

//getUserInfo();

const { isCollapse } = storeToRefs(globalStore);
const { toggleCollapse, toggleDrawer } = globalStore;
const { handleViewNotify, handleMarkNotify } = useNotification();

let timer = null;

const msgList = ref([]);
const unReadCount = ref(0);

onMounted(async () => {
  getUnReadMsgCnt();
  timer = setInterval(getUnReadMsgCnt, 60 * 5 * 1000)
})

onUnmounted(() => {
  clearInterval(timer);
})

const getUnReadMsg = async () => {
  msgList.value = await unReadNotifyListApi(10);
}

const getUnReadMsgCnt = async () => {
  unReadCount.value = await unReadNotifyCountApi();
}


const handleClickMsg = async (message, index) => {
  unReadCount.value -= 1;
  const { id, type, status } = message;
  if(status === "unread") {
    await handleMarkNotify("mark", [id], false);
    msgList.value[index].status = "read";
  }
  handleViewNotify(message);
}

const markAll = async () => {
  unReadCount.value = 0;
  msgList.value.forEach(msg => msg.status = "read");
  handleMarkNotify("allMark", [], false);
}

const goToPassword = () => {
  router.push("/password");
}

const handleVisibleNotify = (visible) => {
  visible && getUnReadMsg();
}

const goToNotification = () => {
  router.push("/notification")
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
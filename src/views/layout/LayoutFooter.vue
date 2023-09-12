<template>
  <el-footer :class="['center-flex', 'footer', layoutType === 'common' ? 'common' : 'dark']">
    <div class="footer-title">Website Contact</div>
    <div class="column-center-flex" style="align-items: flex-start">
      <div class="lab-info center-flex"> 
        <span>Feng Lab</span>
      </div>
      <div class="contact"> 
        <div class="contact-item" v-for="user in contacts" :key="user.name">
          <span class="contact-item-name"> 
            <span>{{ user.name }}</span>
          </span>
        </div>
      </div>
    </div>
  </el-footer> 
</template>

<script setup>

defineProps(["layoutType"])

const contacts = [{
  name: "LinQing Feng"
}, {
  name: "Wen Wu"
}, {
  name: "Tao Cai"
}, {
  name: "Qiang Peng"
}]

</script>
<style lang="scss" scoped>

.common {
  --footer-fontColor: var(--el-text-color-regular);
  --footer-title-right-border-color: var(--el-text-color-secondary);
}

.dark {
  --footer-fontColor: rgba(255, 255, 255, 0.4) ;
  --footer-title-right-border-color: var(--bs-border-color);
}


.contact {
  display: flex;
  gap: 16px;
  &-item {
    display: flex;
    align-items: center;
    gap: 4px;
    @media only screen and (max-width: 1024px){
      flex-direction: column;
      align-items: flex-start;
    }
    &-name {
      display: flex;
      align-items: center;
      justify-items: center;
      gap: 2px;
      font-weight: 600;
    }
  }
}

.lab-info {
  align-items: flex-end;
  > span:not(:last-child) {
    &::after {
      content: "\2022";
      margin: 0 0.5em;
    }
  }
}

.footer {
  margin: 4px 0px;
  height: 40px;
  gap: 24px;
  font-size: 0.5rem;
  color: var(--footer-fontColor);
  &-title {
    height: 100%;
    vertical-align: middle;
    line-height: 36px;
    padding-right: 24px;
    border-right: 2px solid var(--footer-title-right-border-color);
    font-weight: bold;
    font-family: 'Courier New', Courier, monospace;
  }
}

</style>
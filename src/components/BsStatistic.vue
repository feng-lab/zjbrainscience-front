<template>
    <div class="the-statistic">
        <div class="the-statistic-title">
            {{ title }}
        </div>
        <div class="the-statistic-content">
            <div class="the-statistic-content--prefix m-r-4"><slot name="prefix"></slot></div>
            <div class="the-statistic-content--value"> {{ value }} </div>
            <div class="the-statistic-content--suffix"><slot name="suffix"></slot></div>
        </div>
    </div>
</template>
<script setup> 
defineProps({
    title: String,
    value: Number
})
</script>

<style lang="scss" scoped>
.the-statistic {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: #000000d9;
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    font-feature-settings: "tnum";
    &-title {
        margin-bottom: 4px;
        color: var(--el-text-color-placeholder);
    }
    &-content {
        display: inline-flex;
        align-items: center;
        font-size: 24px;
        color: var(--el-text-color-primary);
        > span {
            display: inline-block;
        }
        &--prefix {
            line-height: 24px;
        }
        &--value {
            direction: ltr;
        }
    }
}
</style>
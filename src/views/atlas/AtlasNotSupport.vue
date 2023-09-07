<template>
  <div class="not-support">
    <div class="not-support-sorry">Sorry!</div>
    <div class="not-support-content">
      <p>The atlas is only avaliable on screens larger than or equal to 1024px.</p>
      <p>And, the atlas only supports access in the following browsers: </p>
      <ul>
        <li>Chrome >= 51 </li>
        <li>Firefox >= 46 </li>
        <li>Safari >= 15.0 </li>
      </ul>
    </div>
  </div>
  
</template>

<style lang="scss" scoped>

.not-support {
  width: 80%;
  height: 60%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  font-family:'Times New Roman', Times, serif;
  font-size: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  &-sorry {
    color: var(--el-color-primary);
    font-weight: bold;
    font-family: fantasy;
    font-size: 3.5rem;
    letter-spacing: 4px;
  }
}

</style>
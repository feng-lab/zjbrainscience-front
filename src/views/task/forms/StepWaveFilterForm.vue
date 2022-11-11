<template>
  <el-form inline>
    <el-row>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-form-item label="L_freg" required>
          <el-input/>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-form-item label="H_freg" required>
          <el-input/>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-form-item label="CH_picks" required>
          <el-input/>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-form-item label="Methods" required>
          <el-radio-group>
            <el-radio label="IIR"/>
            <el-radio label="FIR" />
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
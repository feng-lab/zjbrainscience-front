<template>
  <div class="patient-info-container">
    <div class="steps-wrap">
      <div
        class="step"
        :class="{ 'step-one': step === 1, 'no-active': step === 2 }"
        @click="lastStep(1)"
      >
        1. 一般情况
      </div>
      <div
        class="step"
        :class="{ 'step-two': step === 2, 'no-active': step === 1 }"
        @click="nextStep(2)"
      >
        2. 初诊和治疗信息
      </div>
    </div>
    <el-scrollbar height="calc(100vh - 260px)">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="130px"
        class="demo-ruleForm"
        :size="formSize"
        status-icon
      >
        <!-------------------------------一般情况---------------------------------------------->
        <!-- <div class="group-title" v-if="step === 1">一般情况</div> -->
        <div class="group-content" v-if="step === 1">
          <el-form-item
            label="患者姓名："
            prop="base.patient_name"
            class="group-item-2"
          >
            <el-input
              v-model="ruleForm.base.patient_name"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
          <el-form-item label="性别：" prop="base.gender" class="group-item">
            <el-select
              v-model="ruleForm.base.gender"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in genderOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="出生日期："
            prop="base.date_birth"
            class="group-item"
          >
            <el-date-picker
              clearable
              :placeholder="
                $t('datasetManagement.placeholder.data_update_year')
              "
              type="date"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              v-model="ruleForm.base.date_birth"
            />
          </el-form-item>
          <el-form-item
            label="身份证："
            prop="base.identity_id"
            class="group-item"
            description="hahha"
          >
            <el-input
              v-model="ruleForm.base.identity_id"
              placeholder="请输入"
              clearable
            />
            <div class="item-notes">
              请输入15或18位身份信息，最后一位如果是X须大写
            </div>
          </el-form-item>
          <el-form-item
            label="家庭住址县区："
            prop="base.family_address_city"
            class="group-item"
          >
            <!-- <el-input
              v-model="ruleForm.base.family_address_city"
              placeholder="请输入"
              clearable
            /> -->
            <el-cascader
              :options="cityOptions"
              clearable
              v-model="ruleForm.base.family_address_city"
              style="width: 100%"
              :props="{
                label: 'name',
                value: 'name',
              }"
            />
          </el-form-item>
          <el-form-item
            label="详细地址："
            prop="base.family_address"
            class="group-item"
          >
            <el-input
              v-model="ruleForm.base.family_address"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="联系电话："
            prop="base.phone_number"
            class="group-item"
          >
            <el-input
              v-model="ruleForm.base.phone_number"
              placeholder="请输入"
              clearable
            />
            <div class="item-notes">请输入10-12位电话或手机号码</div>
          </el-form-item>
          <el-form-item label="医院：" prop="base.hospital" class="group-item">
            <!-- <el-select
              v-model="ruleForm.base.hospital"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in hospitalOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select> -->
            <el-input
              v-model="ruleForm.base.hospital"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="医生："
            prop="base.doctor_name"
            class="group-item"
          >
            <el-input
              v-model="ruleForm.base.doctor_name"
              placeholder="请输入"
              clearable
            />
            <!-- <el-select v-model="ruleForm.base.doctor_name" placeholder="请选择">
              <el-option
                v-for="item in sexOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select> -->
          </el-form-item>
          <el-form-item
            label="住院号："
            prop="base.inhospital_id"
            class="group-item"
          >
            <el-input
              v-model="ruleForm.base.inhospital_id"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
        </div>
        <!-------------------------------初诊信息---------------------------------------------->
        <div class="group-title" v-if="step === 2">初诊信息</div>
        <div class="group-content" v-if="step === 2">
          <el-form-item
            label="确诊时间："
            prop="other.timing_of_diagnosis"
            class="group-item-2"
          >
            <el-date-picker
              clearable
              :placeholder="
                $t('datasetManagement.placeholder.data_update_year')
              "
              type="date"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              v-model="ruleForm.other.timing_of_diagnosis"
            />
          </el-form-item>
          <el-form-item
            label="大分型："
            prop="other.large_classification"
            class="group-item"
          >
            <!-- <el-select
              v-model="ruleForm.other.large_classification"
              placeholder="请选择"
            >
              <el-option
                v-for="item in classOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select> -->
            <el-input
              v-model="ruleForm.other.large_classification"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="小分型："
            prop="other.small_classification"
            class="group-item"
          >
            <!-- <el-select
              v-model="ruleForm.other.small_classification"
              placeholder="请选择"
            >
              <el-option
                v-for="item in classOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select> -->
            <el-input
              v-model="ruleForm.other.small_classification"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
          <el-form-item label="诊断：" prop="other.diagnose" class="group-item">
            <el-select v-model="ruleForm.other.diagnose" placeholder="请选择">
              <el-option
                v-for="item in diagnoseOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="入院时WBC：" prop="other.wcb" class="group-item">
            <el-input v-model="ruleForm.other.wcb" placeholder="请输入"
              ><template #append>x10E9/L</template>
            </el-input>
            <div class="item-notes">请输入数值</div>
          </el-form-item>
          <el-form-item label="Hb：" prop="other.hb" class="group-item">
            <el-input v-model="ruleForm.other.hb" placeholder="请输入"
              ><template #append>g/L</template>
            </el-input>
            <div class="item-notes">请输入数值</div>
          </el-form-item>
          <el-form-item label="PLT：" prop="other.plt" class="group-item">
            <el-input v-model="ruleForm.other.plt" placeholder="请输入"
              ><template #append>x10E9/L</template>
            </el-input>
            <div class="item-notes">请输入数值</div>
          </el-form-item>
          <el-form-item
            label="骨髓形态："
            prop="other.bone_marrow_morphology"
            class="group-item"
          >
            <el-input
              v-model="ruleForm.other.bone_marrow_morphology"
              placeholder="请输入"
              ><template #append>%</template>
            </el-input>
            <div class="item-notes">请输入数值</div>
          </el-form-item>
          <el-form-item label="FCM：" prop="other.fcm" class="group-item-1">
            <el-input
              v-model="ruleForm.other.fcm"
              placeholder="请输入"
              clearable
            >
              <!-- <template #append>%</template> -->
            </el-input>
          </el-form-item>
          <el-form-item
            label="融合基因："
            prop="other.fusion"
            class="group-item-2"
          >
            <el-select v-model="ruleForm.other.fusion" placeholder="请选择">
              <el-option
                v-for="item in fusionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="详细说明："
            prop="other.fusion_detail"
            class="group-item-2"
            v-if="ruleForm.other.fusion === 2 || ruleForm.other.fusion === 3"
          >
            <el-input
              v-model="ruleForm.other.fusion_detail"
              placeholder="请输入融合基因详情"
              type="textarea"
              :rows="3"
            />
          </el-form-item>
          <el-form-item
            label="基因突变："
            prop="other.mutation"
            class="group-item-2"
          >
            <el-select v-model="ruleForm.other.mutation" placeholder="请选择">
              <el-option
                v-for="item in mutationOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="详细说明："
            prop="other.mutation_detail"
            class="group-item-2"
            v-if="
              ruleForm.other.mutation === 2 || ruleForm.other.mutation === 3
            "
          >
            <el-input
              v-model="ruleForm.other.mutation_detail"
              placeholder="请输入基因突变详情"
              type="textarea"
              :rows="3"
            />
          </el-form-item>
          <el-form-item
            label="染色体："
            prop="other.chromosome"
            class="group-item-2"
          >
            <el-select v-model="ruleForm.other.chromosome" placeholder="请选择">
              <el-option
                v-for="item in chromosomeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="详细说明："
            prop="other.chromosome_detail"
            class="group-item-2"
            v-if="ruleForm.other.chromosome === 3"
          >
            <el-input
              v-model="ruleForm.other.chromosome_detail"
              placeholder="请输入染色体具体结果"
              type="textarea"
              :rows="2"
            />
          </el-form-item>

          <el-form-item label="是否治疗：" prop="other.is_therapy">
            <el-radio-group v-model="ruleForm.other.is_therapy">
              <el-radio :label="false">否</el-radio>
              <el-radio :label="true">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <!-------------------------------治疗详情---------------------------------------------->
        <div class="group-title" v-if="step === 2 && ruleForm.other.is_therapy">
          治疗详情
        </div>
        <div
          class="group-content"
          v-if="step === 2 && ruleForm.other.is_therapy"
        >
          <el-form-item
            label="治疗疗程："
            prop="other.effectsData"
            class="group-item-2"
          >
            <el-button type="primary" plain @click="addEffects">添加</el-button>
            <el-button type="primary" @click="saveEffects" v-show="editId"
              >保存</el-button
            >
          </el-form-item>
          <el-form-item
            label=""
            class="group-item-3"
            v-if="
              ruleForm.other.effectsData && ruleForm.other.effectsData.length
            "
          >
            <el-table :data="ruleForm.other.effectsData" style="width: 100%">
              <el-table-column prop="c_index" label="疗程" width="60">
                <template #default="scope">
                  C{{ scope.$index + 1 || scope.c_index }}
                </template>
              </el-table-column>
              <el-table-column prop="c_date" label="治疗日期" width="170">
                <template #default="scope">
                  <el-date-picker
                    clearable
                    :placeholder="
                      $t('datasetManagement.placeholder.data_update_year')
                    "
                    type="date"
                    style="width: 100%"
                    value-format="YYYY-MM-DD"
                    v-model="scope.row.c_date"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="c_detail" label="治疗方案">
                <template #default="scope">
                  <el-input
                    placeholder="请输入"
                    v-model="scope.row.c_detail"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="c_effects" label="疗效评估">
                <template #default="scope">
                  <el-select v-model="scope.row.c_effects" placeholder="请选择">
                    <el-option
                      v-for="item in chemotherapyOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="c_mrd" label="MRD">
                <template #default="scope">
                  <el-input v-model="scope.row.c_mrd" placeholder="请输入">
                    <!-- <template #append>%</template> -->
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template #default="scope">
                  <el-button
                    type="danger"
                    plain
                    @click="delEffects(scope.$index)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <!-- <el-form-item
            label="C1治疗日期："
            prop="C1_date"
            class="group-item-2"
          >
            <el-date-picker
              clearable
              :placeholder="
                $t('datasetManagement.placeholder.data_update_year')
              "
              type="date"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              v-model="ruleForm.C1_date"
            />
          </el-form-item>
          <el-form-item
            label="C1治疗方案："
            prop="C1_detail"
            class="group-item"
            v-if="ruleForm.C1_date"
          >
            <el-input v-model="ruleForm.C1_detail" placeholder="请输入" />
          </el-form-item>
          <el-form-item
            label="C1疗效评估："
            prop="C1_effects"
            class="group-item"
            v-if="ruleForm.C1_date"
          >
            <el-select v-model="ruleForm.C1_effects" placeholder="请选择">
              <el-option
                v-for="item in sexOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="ruleForm.C1_date"
            label="MRD："
            prop="C1_MRD"
            class="group-item"
          >
            <el-input v-model="ruleForm.C1_MRD" placeholder="请输入"
              ><template #append>%</template>
            </el-input>
          </el-form-item>
          <el-form-item
            label="C2治疗日期："
            prop="C2_date"
            class="group-item-2"
          >
            <el-date-picker
              clearable
              :placeholder="
                $t('datasetManagement.placeholder.data_update_year')
              "
              type="date"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              v-model="ruleForm.C2_date"
            />
          </el-form-item>
          <el-form-item
            label="C2治疗方案："
            prop="C2_detail"
            class="group-item"
            v-if="ruleForm.C2_date"
          >
            <el-input v-model="ruleForm.C2_detail" placeholder="请输入" />
          </el-form-item>
          <el-form-item
            label="C2疗效评估："
            prop="C2_effects"
            class="group-item"
            v-if="ruleForm.C2_date"
          >
            <el-select v-model="ruleForm.C2_effects" placeholder="请选择">
              <el-option
                v-for="item in sexOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="ruleForm.C2_date"
            label="MRD："
            prop="C2_MRD"
            class="group-item"
          >
            <el-input v-model="ruleForm.C2_MRD" placeholder="请输入"
              ><template #append>%</template>
            </el-input>
          </el-form-item> -->
          <el-form-item
            label="总化疗疗程数："
            prop="other.chemotherapy_counts"
            class="group-item"
          >
            <el-input-number
              v-model="ruleForm.other.chemotherapy_counts"
              :min="0"
              :max="100"
              controls-position="right"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item
            label="末次化疗日期："
            prop="other.last_chemotherapy_date"
            class="group-item"
          >
            <el-date-picker
              clearable
              :placeholder="
                $t('datasetManagement.placeholder.data_update_year')
              "
              type="date"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              v-model="ruleForm.other.last_chemotherapy_date"
            />
          </el-form-item>
          <el-form-item
            label="疾病状态："
            prop="other.status_after_last_chemotherapy"
            class="group-item"
          >
            <el-select
              v-model="ruleForm.other.status_after_last_chemotherapy"
              placeholder="请选择"
            >
              <el-option
                v-for="item in chemotherapyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="是否复发："
            prop="other.is_relapse"
            class="group-item-2"
          >
            <el-radio-group v-model="ruleForm.other.is_relapse">
              <el-radio :label="false">否</el-radio>
              <el-radio :label="true">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="CR1时间："
            prop="other.cr1_date"
            class="group-item"
            v-if="ruleForm.other.is_relapse"
          >
            <el-date-picker
              clearable
              :placeholder="
                $t('datasetManagement.placeholder.data_update_year')
              "
              type="date"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              v-model="ruleForm.other.cr1_date"
            />
          </el-form-item>
          <el-form-item
            v-if="ruleForm.other.is_relapse"
            label="第1次复发时间："
            prop="other.frist_relapse_date"
            class="group-item-1"
          >
            <el-date-picker
              clearable
              :placeholder="
                $t('datasetManagement.placeholder.data_update_year')
              "
              type="date"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              v-model="ruleForm.other.frist_relapse_date"
            />
          </el-form-item>
          <el-form-item
            label="CR2时间："
            prop="other.cr2_date"
            class="group-item"
            v-if="ruleForm.other.is_relapse"
          >
            <el-date-picker
              clearable
              :placeholder="
                $t('datasetManagement.placeholder.data_update_year')
              "
              type="date"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              v-model="ruleForm.other.cr2_date"
            />
          </el-form-item>
          <el-form-item
            v-if="ruleForm.other.is_relapse"
            label="第2次复发时间："
            prop="other.second_relapse_date"
            class="group-item-1"
          >
            <el-date-picker
              clearable
              :placeholder="
                $t('datasetManagement.placeholder.data_update_year')
              "
              type="date"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              v-model="ruleForm.other.second_relapse_date"
            />
          </el-form-item>
          <el-form-item
            label="CR3时间："
            prop="other.cr3_date"
            class="group-item-2"
            v-if="ruleForm.other.is_relapse"
          >
            <el-date-picker
              clearable
              :placeholder="
                $t('datasetManagement.placeholder.data_update_year')
              "
              type="date"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              v-model="ruleForm.other.cr3_date"
            />
          </el-form-item>
          <el-form-item
            label="是否骨髓移植："
            prop="other.is_transplant"
            class="group-item-2"
          >
            <el-radio-group v-model="ruleForm.other.is_transplant">
              <el-radio :label="false">否</el-radio>
              <el-radio :label="true">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="移植时间："
            prop="other.transplant_date"
            class="group-item-2"
            v-if="ruleForm.other.is_transplant"
          >
            <el-date-picker
              clearable
              :placeholder="
                $t('datasetManagement.placeholder.data_update_year')
              "
              type="date"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              v-model="ruleForm.other.transplant_date"
            />
          </el-form-item>
          <el-form-item
            label="是否死亡："
            prop="other.is_death"
            class="group-item-2"
          >
            <el-radio-group v-model="ruleForm.other.is_death">
              <el-radio :label="false">否</el-radio>
              <el-radio :label="true">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="死亡时间："
            prop="other.date_of_death"
            class="group-item-2"
            v-if="ruleForm.other.is_death"
          >
            <el-date-picker
              clearable
              :placeholder="
                $t('datasetManagement.placeholder.data_update_year')
              "
              type="date"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              v-model="ruleForm.other.date_of_death"
            />
          </el-form-item>
          <el-form-item
            label="末次随访日期："
            prop="other.last_followup_date"
            class="group-item-2"
          >
            <el-date-picker
              clearable
              :placeholder="
                $t('datasetManagement.placeholder.data_update_year')
              "
              type="date"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              v-model="ruleForm.other.last_followup_date"
            />
          </el-form-item>
          <el-form-item label="备注：" prop="other.note" class="group-item-2">
            <el-button type="primary" plain @click="addNotes">添加</el-button>
            <el-button type="primary" @click="saveNotes" v-show="editId"
              >保存</el-button
            >
          </el-form-item>
          <el-form-item
            label=""
            class="group-item-3"
            v-if="ruleForm.other.noteData && ruleForm.other.noteData.length"
          >
            <el-table :data="ruleForm.other.noteData" style="width: 100%">
              <el-table-column prop="gmt_modified" label="日期" width="200">
                <template #default="scope">
                  <el-date-picker
                    clearable
                    :placeholder="
                      $t('datasetManagement.placeholder.data_update_year')
                    "
                    type="date"
                    style="width: 100%"
                    value-format="YYYY-MM-DD"
                    v-model="scope.row.gmt_modified"
                    disabled
                  />
                </template>
              </el-table-column>
              <el-table-column prop="memo" label="内容">
                <template #default="scope">
                  <el-input
                    placeholder="请输入"
                    v-model="scope.row.memo"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120">
                <template #default="scope">
                  <el-button type="danger" plain @click="delNotes(scope.$index)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <!-- <el-form-item label="附件：" prop="other.fileList">
            <el-upload
              v-model:file-list="ruleForm.other.fileList"
              action="/api/uploadCohortPatientFile"
              list-type="picture-card"
              :data="{
                cohort_patient_id: editId,
                directory: '/',
              }"
              :headers="{
                Authorization: `${token_type} ${access_token}`,
              }"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :show-file-list="true"
            >
              <el-icon><Plus /></el-icon>
              <div style="color: #8c8c8c">点击上传</div>
            </el-upload>
          </el-form-item> -->
        </div>
      </el-form>
    </el-scrollbar>
    <div class="btn-wrap">
      <el-button @click="goBack">取消</el-button>
      <el-button @click="nextStep(null)" v-if="step < 2" type="primary"
        >保存并下一步</el-button
      >
      <el-button @click="lastStep(null)" v-else>上一步</el-button>
      <el-button type="primary" @click="submitForm" v-if="step === 2"
        >提交</el-button
      >
    </div>
    <el-dialog v-model="dialogVisible" title="文件预览">
      <div style="display: flex; justify-content: center">
        <img
          w-full
          :src="dialogImageUrl"
          alt="Preview Image"
          style="width: 100%"
        />
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import moment from 'moment'
import { ref, computed, watch, reactive, onMounted, toRefs } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  numValid,
  identityValid,
  phoneValid,
  floatValid,
} from '@/utils/validate.js'
import {
  createCohortPatientApi,
  getCohortPatientInfoApi,
  updateCohortPatientApi,
  createPatientFormDataApi,
  updatePatientFormDataApi,
  getPatientFormDataInfoApi,
  getPatientFormDataApi,
  createPatientCTherapyDetailApi,
  updatePatientCTherapyDetailApi,
  getPatientCTherapyDetailByPageApi,
  createPatientMemoApi,
  updatePatientMemoApi,
  getPatientMemoByPageApi,
  listCohortPatientFilesApi,
  downloadCohortPatientFileApi,
  getProvinceCityApi,
} from '@/api/patient.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import jsCookie from 'js-cookie'
import {
  diagnoseOptions,
  fusionOptions,
  mutationOptions,
  chromosomeOptions,
  chemotherapyOptions,
} from './dict.js'
import useUserStore from '@/stores/user.js'

const access_token = jsCookie.get('access_token')
const token_type = jsCookie.get('token_type')
const router = useRouter()
const route = useRoute()
const step = ref(1)
const userLevel = useUserStore().user.access_level

const dialogImageUrl = ref(null)
const dialogVisible = ref(false)
const editId = ref(null)
const createId = ref(null)
const defaultValue = '******'
const baseInfoInit = ref(null)

const ruleFormRef = ref()
const ruleForm = reactive({
  base: {
    patient_name: null,
    gender: null,
    date_birth: null,
    identity_id: null,
    family_address_city: null,
    family_address: null,
    phone_number: null,
    hospital: null,
    doctor_name: null,
    inhospital_id: null,
  },
  other: {
    timing_of_diagnosis: null,
    large_classification: '无',
    small_classification: '无',
    diagnose: null,
    wcb: null,
    hb: null,
    plt: null,
    bone_marrow_morphology: null,
    fcm: null,
    fusion: null,
    fusion_detail: null,
    mutation: null,
    mutation_detail: null,
    chromosome: null,
    chromosome_detail: null,
    is_therapy: false,

    effectsData: [
      {
        c_date: moment(new Date()).format('YYYY-MM-DD'),
        c_detail: null,
        c_effects: null,
        c_mrd: null,
      },
    ],
    chemotherapy_counts: 0,
    last_chemotherapy_date: null,
    status_after_last_chemotherapy: null,
    is_relapse: false,
    cr1_date: null,
    frist_relapse_date: null,
    cr2_date: null,
    second_relapse_date: null,
    cr3_date: null,
    is_transplant: false,
    transplant_date: null,
    is_death: false,
    date_of_death: null,
    last_followup_date: null,
    noteData: [
      {
        gmt_modified: moment(new Date()).format('YYYY-MM-DD'),
        memo: null,
      },
    ],
    fileList: [
      // {
      //   name: 'food.jpeg',
      //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
      // },
    ],
  },
})

const requiredReg = { required: true, trigger: 'blur', message: '该项为必填项' }
const requiredRegChange = {
  required: true,
  trigger: 'change',
  message: '该项为必填项',
}
const phoneReg = { validator: phoneValid, trigger: 'blur' }
const idReg = { validator: identityValid, trigger: 'blur' }
const numReg = { validator: numValid, trigger: 'blur' }
const floatReg = { validator: floatValid, trigger: 'blur' }

const rules = reactive({
  base: {
    patient_name: [requiredReg],
    gender: [requiredRegChange],
    date_birth: [requiredRegChange],
    identity_id: [requiredReg, idReg],
    family_address_city: [requiredReg],
    family_address: [requiredReg],
    phone_number: [requiredReg, phoneReg],
    hospital: [requiredReg],
    doctor_name: [requiredReg],
    inhospital_id: [requiredReg, numReg],
  },
  other: {
    timing_of_diagnosis: [requiredReg],
    large_classification: [requiredReg],
    small_classification: [requiredReg],
    diagnose: [requiredReg],
    wcb: [requiredReg, floatReg],
    hb: [requiredReg, floatReg],
    plt: [requiredReg, floatReg],
    bone_marrow_morphology: [requiredReg, floatReg],
    fcm: [requiredReg],
    fusion: [requiredReg],
    mutation: [requiredReg],
    chromosome: [requiredReg],
    is_therapy: [requiredReg],
    is_relapse: [requiredReg],
    is_transplant: [requiredReg],
    is_death: [requiredReg],
    last_followup_date: [requiredReg],
  },
})

const genderOptions = ref([
  { label: '男', value: 'male' },
  { label: '女', value: 'female' },
])

// const hospitalOptions = ref([
//   { label: '浙一医院', value: 1 },
//   { label: '浙二医院', value: 2 },
// ])

const cityOptions = ref([])
const classOptions = [{ label: 'string', value: 'string' }]

const getProvinceCity = async () => {
  try {
    const data = await getProvinceCityApi()
    console.log('data--->', data)
    cityOptions.value = data || []
  } catch (err) {
    console.log(err)
  }
}
// -----------------基本信息接口---------------------------
// 新增病人基本信息
const createCohortPatient = async () => {
  try {
    createId.value = await createCohortPatientApi({
      domain_id: 1,
      ...ruleForm.base,
      family_address_city: ruleForm.base.family_address_city.length
        ? ruleForm.base.family_address_city.join('/')
        : null,
    })
    ElMessage.success('添加成功')
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}
// 编辑更新病人基本信息
const updateCohortPatient = async () => {
  try {
    const params = {
      domain_id: 1,
      id: editId.value,
      ...ruleForm.base,
      identity_id:
        ruleForm.base.identity_id === defaultValue
          ? null
          : ruleForm.base.identity_id,
      phone_number:
        ruleForm.base.phone_number === defaultValue
          ? null
          : ruleForm.base.phone_number,
      family_address:
        ruleForm.base.family_address === defaultValue
          ? null
          : ruleForm.base.family_address,
      family_address_city: ruleForm.base.family_address_city.length
        ? ruleForm.base.family_address_city.join('/')
        : null,
    }
    await updateCohortPatientApi(params)
    ElMessage.success('编辑成功')
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}
// 获取病人基本信息
const getCohortPatientInfo = async () => {
  try {
    const data = await getCohortPatientInfoApi({
      cohort_patient_id: editId.value,
    })
    const isRoot = userLevel === 1000
    Object.assign(ruleForm.base, {
      ...data,
      identity_id: isRoot ? data.identity_id : defaultValue,
      phone_number: isRoot ? data.phone_number : defaultValue,
      family_address: isRoot ? data.family_address : defaultValue,
      family_address_city: data.family_address_city
        ? data.family_address_city.split('/')
        : null,
    })
    baseInfoInit.value = JSON.stringify(ruleForm.base)
  } catch (err) {
    console.log(err)
    return false
  }
}
// ----------------------初诊信息接口----------------------------
// 创建初诊信息
const createPatientFormData = async () => {
  try {
    await createPatientFormDataApi({
      patient_id: createId.value || editId.value,
      ...ruleForm.other,
    })
    ElMessage.success('提交成功')
    router.back()
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}
// 编辑更新初诊信息
const updatePatientFormData = async () => {
  try {
    const params = {
      patient_id: editId.value || createId.value,
      ...ruleForm.other,
    }
    await updatePatientFormDataApi(params)
    ElMessage.success('编辑成功')
    goBack()
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}
// 获取初诊信息
const getPatientFormDataInfo = async () => {
  try {
    const data = await getPatientFormDataInfoApi({
      patient_id: editId.value,
    })
    Object.assign(ruleForm.other, data)
  } catch (err) {
    console.log(err)
    return false
  }
}

// ----------------------治疗疗程接口----------------------------
// 创建治疗疗程
const createPatientCTherapyDetail = async (params) => {
  try {
    await createPatientCTherapyDetailApi({
      patient_id: createId.value || editId.value,
      ...params,
    })
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}
// 编辑更新治疗疗程
const updatePatientCTherapyDetail = async () => {
  try {
    const params = {
      patient_id: editId.value || createId.value,
    }
    const data = ruleForm.other.effectsData.map((item, index) => ({
      ...item,
      c_index: index + 1,
    }))
    await updatePatientCTherapyDetailApi(params, data)
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}
// 获取疗程信息
const getPatientCTherapyDetailByPage = async () => {
  try {
    const data = await getPatientCTherapyDetailByPageApi({
      patient_id: editId.value,
      offset: 0,
      limit: 1000,
      include_deleted: false,
    })
    ruleForm.other.effectsData = data.items || []
  } catch (err) {
    console.log(err)
    return false
  }
}

// ----------------------备注接口----------------------------
// 创建备注
const createPatientMemo = async (params) => {
  try {
    await createPatientMemoApi({
      patient_id: createId.value || editId.value,
      memo: params.memo || '',
    })
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}
// 编辑更新备注
const updatePatientMemo = async () => {
  try {
    const params = {
      patient_id: editId.value || createId.value,
    }
    const data = ruleForm.other.noteData.map((item) => item.memo)
    await updatePatientMemoApi(params, data)
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}
// 获取备注信息
const getPatientMemoByPage = async () => {
  try {
    const data = await getPatientMemoByPageApi({
      patient_id: editId.value,
      offset: 0,
      limit: 1000,
      include_deleted: false,
    })
    ruleForm.other.noteData = data.items || []
  } catch (err) {
    console.log(err)
    return false
  }
}

// 获取病人文件列表
const listCohortPatientFiles = async () => {
  try {
    const data = await listCohortPatientFilesApi({
      cohort_patient_id: editId.value,
      directory: '/',
    })
    let result = data
      ? data[1].map(async (item) => {
          let url = await downloadCohortPatientFile(item)
          // let url = `/api/downloadCohortPatientFile?cohort_patient_id=${editId.value}&path=/${item.name}`
          return {
            ...item,
            url: url,
          }
        })
      : []

    setTimeout(() => {
      ruleForm.other.fileList = result
    }, 2000)
    console.log('ruleForm.other.fileList', ruleForm.other.fileList)
  } catch (err) {
    console.log(err)
    return false
  }
}

// 下载文件进行预览
const downloadCohortPatientFile = async (item) => {
  try {
    const file = await downloadCohortPatientFileApi({
      cohort_patient_id: editId.value,
      path: '/' + item.name,
    })
    console.log('url--->blob', file)
    const blob = new Blob([file.data], {
      type: file.headers['Content-Type'],
    })
    let url = window.URL.createObjectURL(blob)
    return url
  } catch (err) {
    console.log(err)
  }
}

const submitForm = async () => {
  const valid = await validFrom(ruleFormRef.value)
  if (valid) {
    if (editId.value) {
      updatePatientCTherapyDetail()
      updatePatientMemo()
      updatePatientFormData()
    } else {
      ruleForm.other.effectsData.forEach((item, index) => {
        const params = { ...item, c_index: index + 1 }
        createPatientCTherapyDetail(params)
      })
      ruleForm.other.noteData.forEach((item) => {
        createPatientMemo(item)
      })
      createPatientFormData()
    }
  }
}

onMounted(() => {
  getProvinceCity()
  const { query } = route
  editId.value = query.id || null
  if (editId.value) {
    getCohortPatientInfo()
  }
  if (query.step) {
    step.value = +query.step
    ruleForm.other.is_therapy = Boolean(query.is_therapy)
    getPatientFormDataInfo()
    getPatientCTherapyDetailByPage()
    getPatientMemoByPage()
  }
})

const nextStep = async (val) => {
  // 编辑私密信息时修改校验规则
  if (editId.value) {
    if (
      ruleForm.base.identity_id === defaultValue &&
      ruleForm.base.phone_number === defaultValue
    ) {
      rules.base.identity_id.splice(1, 1)
      rules.base.phone_number.splice(1, 1)
    } else {
      if (rules.base.identity_id.length <= 1) rules.base.identity_id.push(idReg)
      if (rules.base.phone_number.length <= 1)
        rules.base.phone_number.push(phoneReg)
    }
  }
  const valid = await validFrom(ruleFormRef.value)
  if (valid) {
    if (editId.value) {
      // 如果基础信息没有修改不进行保存直接跳到下一页
      if (baseInfoInit.value !== JSON.stringify(ruleForm.base)) {
        const res = await updateCohortPatient()
        if (!res) return
      }
      getPatientFormDataInfo()
      getPatientCTherapyDetailByPage()
      getPatientMemoByPage()
      // listCohortPatientFiles()
    } else {
      const res = await createCohortPatient()
      if (!res) return
    }
    if (val) {
      step.value = val
      return
    }
    step.value += 1
  }
}

const lastStep = (val) => {
  if (val) {
    step.value = val
    return
  }
  step.value -= 1
}

const addNotes = () => {
  ruleForm.other.noteData.unshift({
    gmt_modified: moment(new Date()).format('YYYY-MM-DD'),
    memo: null,
  })
}

const delNotes = (index) => {
  ruleForm.other.noteData.splice(index, 1)
}

const saveNotes = async () => {
  await updatePatientMemo()
  ElMessage.success('备注保存成功')
}

const addEffects = () => {
  ruleForm.other.effectsData.push({
    c_date: null,
    c_detail: null,
    c_effects: null,
    c_mrd: null,
  })
}

const delEffects = (index) => {
  ruleForm.other.effectsData.splice(index, 1)
}

const saveEffects = async () => {
  await updatePatientCTherapyDetail()
  ElMessage.success('治疗疗程保存成功')
}

const handlePictureCardPreview = (uploadFile) => {
  // console.log('uploadFile---->', uploadFile)/
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}

const validFrom = async (formEl) => {
  if (!formEl) return
  let reg = false
  await formEl.validate((valid, fields) => {
    reg = valid
  })
  return reg
}

const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}

const goBack = () => {
  const { page } = route.query
  router.push({ path: 'myqueue', query: { page } })
}

const handleSuccess = (response, uploadFile) => {
  console.log('handleSuccess--->', response, uploadFile)
  ElMessage.success('上传成功')
}
</script>

<style lang="scss" scoped>
.patient-info-container {
  margin: 6px;
  padding: 16px;
  background-color: #ffffff;
  position: relative;
  .steps-wrap {
    display: flex;
    height: 48px;
    line-height: 48px;
    margin-top: 16px;
    .step {
      width: 50%;
      text-align: center;
      background: #f0f9ea;
      font-size: 16px;
      color: #49b24e;
      cursor: pointer;
    }
    .step-one {
      background-color: #49b24e;
      color: #fff;
      &::after {
        content: '';
        position: absolute;
        right: -32px;
        z-index: 10;
        width: 0;
        height: 0;
        border-left: 16px solid #49b24e;
        border-right: 16px solid #49b24e;
        border-top: 24px solid #49b24e;
        border-bottom: 24px solid #49b24e;
        border-color: transparent transparent transparent #49b24e;
      }
      &.no-active {
        background-color: #f0f9ea;
        &::after {
          content: '';
          position: absolute;
          right: -32px;
          z-index: 10;
          width: 0;
          height: 0;
          border-left: 16px solid #f0f9ea;
          border-right: 16px solid #f0f9ea;
          border-top: 24px solid #f0f9ea;
          border-bottom: 24px solid #f0f9ea;
          border-color: transparent transparent transparent #f0f9ea;
        }
      }
    }
    .step-two {
      background-color: #49b24e;
      color: #fff;
      &::before {
        content: '';
        position: absolute;
        left: 0px;
        z-index: 8;
        width: 0;
        height: 0;
        border-left: 16px solid #f0f9ea;
        border-right: 16px solid #f0f9ea;
        border-top: 24px solid #f0f9ea;
        border-bottom: 24px solid #f0f9ea;
        border-color: transparent transparent transparent #f0f9ea;
      }
      &.no-active {
        background-color: #f0f9ea;
        &::before {
          content: '';
          position: absolute;
          left: 0px;
          z-index: 10;
          width: 0;
          height: 0;
          border-left: 16px solid #f0f9ea;
          border-right: 16px solid #f0f9ea;
          border-top: 24px solid #f0f9ea;
          border-bottom: 24px solid #f0f9ea;
          border-color: transparent transparent transparent #f0f9ea;
        }
      }
    }
  }
  .group-title {
    font-family: PingFang SC;
    font-size: 16px;
    font-weight: 600;
    line-height: 50px;
    border-bottom: 1px solid #ebedf0;
  }
  :deep(.el-form-item__content) {
    align-items: flex-start;
  }
  :deep(.el-form-item__error) {
    top: 38px;
  }
  .group-content {
    display: flex;
    flex-wrap: wrap;
    padding: 24px 40px;
    .item-notes {
      color: #b2b2b2;
      margin-top: 5px;
    }
    .group-item {
      width: 33%;
      margin: 0 0 24px 0;
    }
    .group-item-1 {
      width: 33%;
      margin: 0 33% 24px 0;
    }
    .group-item-2 {
      width: 33%;
      margin: 0 66% 24px 0;
    }
    .group-item-3 {
      width: 99%;
      margin: 0 0 30px 0;
    }
    :deep(.el-input-number .el-input__inner) {
      text-align: left;
    }
    :deep(.el-upload--picture-card) {
      flex-direction: column;
    }
  }
  .btn-wrap {
    position: absolute;
    bottom: -56px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: inset 0px 1px 0px 0px #ebebeb;
    height: 56px;
    margin-bottom: 40px;
    background-color: #ffffff;
    z-index: 10;
  }
}
</style>

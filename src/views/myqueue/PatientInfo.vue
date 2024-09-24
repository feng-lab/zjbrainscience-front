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
    <el-scrollbar height="calc(100vh - 220px)">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :size="formSize"
        status-icon
      >
        <!-------------------------------一般情况---------------------------------------------->
        <!-- <div class="group-title" v-if="step === 1">一般情况</div> -->
        <div class="group-content" v-show="step === 1">
          <el-form-item
            label="患者姓名："
            prop="patient_name"
            class="group-item-2"
          >
            <el-input
              v-model="ruleForm.patient_name"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
          <el-form-item label="性别：" prop="gender" class="group-item">
            <el-select v-model="ruleForm.gender" placeholder="请选择">
              <el-option
                v-for="item in genderOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="出生日期：" prop="date_birth" class="group-item">
            <el-date-picker
              clearable
              :placeholder="
                $t('datasetManagement.placeholder.data_update_year')
              "
              type="date"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              v-model="ruleForm.date_birth"
            />
          </el-form-item>
          <el-form-item label="身份证：" prop="identity_id" class="group-item">
            <el-input
              v-model="ruleForm.identity_id"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="家庭住址县区："
            prop="family_address_city"
            class="group-item"
          >
            <el-cascader
              :options="options"
              clearable
              v-model="ruleForm.family_address_city"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item
            label="详细地址："
            prop="family_address"
            class="group-item"
          >
            <el-input
              v-model="ruleForm.family_address"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="联系电话："
            prop="phone_number"
            class="group-item"
          >
            <el-input
              v-model="ruleForm.phone_number"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
          <el-form-item label="医院：" prop="hospital" class="group-item">
            <el-select
              v-model="ruleForm.hospital"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in hospitalOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="医生：" prop="doctor_name" class="group-item">
            <el-input
              v-model="ruleForm.doctor_name"
              placeholder="请输入"
              clearable
            />
            <!-- <el-select v-model="ruleForm.doctor_name" placeholder="请选择">
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
            prop="inhospital_id"
            class="group-item"
          >
            <el-input
              v-model="ruleForm.inhospital_id"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
        </div>
        <!-------------------------------初诊信息---------------------------------------------->
        <div class="group-title" v-show="step === 2">初诊信息</div>
        <div class="group-content" v-show="step === 2">
          <el-form-item
            label="确诊时间："
            prop="time_of_diagnosis"
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
              v-model="ruleForm.time_of_diagnosis"
            />
          </el-form-item>
          <el-form-item
            label="大分型："
            prop="large_classification"
            class="group-item"
          >
            <el-select
              v-model="ruleForm.large_classification"
              placeholder="请选择"
            >
              <el-option
                v-for="item in sexOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="小分型："
            prop="small_classification"
            class="group-item"
          >
            <el-select
              v-model="ruleForm.small_classification"
              placeholder="请选择"
            >
              <el-option
                v-for="item in sexOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="诊断：" prop="diagnose" class="group-item">
            <el-select v-model="ruleForm.diagnose" placeholder="请选择">
              <el-option
                v-for="item in diagnoseOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="入院时WBC：" prop="wcb" class="group-item">
            <el-input v-model="ruleForm.wcb" placeholder="请输入"
              ><template #append>x10E9/L</template>
            </el-input>
          </el-form-item>
          <el-form-item label="Hb：" prop="hb" class="group-item">
            <el-input v-model="ruleForm.hb" placeholder="请输入"
              ><template #append>g/L</template>
            </el-input>
          </el-form-item>
          <el-form-item label="PLT：" prop="plt" class="group-item">
            <el-input v-model="ruleForm.plt" placeholder="请输入"
              ><template #append>x10E9/L</template>
            </el-input>
          </el-form-item>
          <el-form-item
            label="骨髓形态："
            prop="bone_marrow_morphology"
            class="group-item"
          >
            <el-input
              v-model="ruleForm.bone_marrow_morphology"
              placeholder="请输入"
              ><template #append>%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="FCM：" prop="fcm" class="group-item-1">
            <el-input v-model="ruleForm.fcm" placeholder="请输入"
              ><template #append>%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="融合基因：" prop="fusion" class="group-item-2">
            <el-select v-model="ruleForm.fusion" placeholder="请选择">
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
            prop="fusion_detail"
            class="group-item-2"
            v-if="ruleForm.fusion === 2 || ruleForm.fusion === 3"
          >
            <el-input
              v-model="ruleForm.fusion_detail"
              placeholder="请输入融合基因详情"
              type="textarea"
              :rows="3"
            />
          </el-form-item>
          <el-form-item label="基因突变：" prop="mutation" class="group-item-2">
            <el-select v-model="ruleForm.mutation" placeholder="请选择">
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
            prop="mutation_detail"
            class="group-item-2"
            v-if="ruleForm.mutation === 2 || ruleForm.mutation === 3"
          >
            <el-input
              v-model="ruleForm.mutation_detail"
              placeholder="请输入基因突变详情"
              type="textarea"
              :rows="3"
            />
          </el-form-item>
          <el-form-item label="染色体：" prop="chromosome" class="group-item-2">
            <el-select v-model="ruleForm.chromosome" placeholder="请选择">
              <el-option
                v-for="item in chromosomeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="具体结果："
            prop="chromosome_detail"
            class="group-item-2"
            v-if="ruleForm.chromosome === 3"
          >
            <el-input
              v-model="ruleForm.chromosome_detail"
              placeholder="请输入染色体具体结果"
              type="textarea"
              :rows="2"
            />
          </el-form-item>

          <el-form-item label="是否治疗：" prop="is_therapy">
            <el-radio-group v-model="ruleForm.is_therapy">
              <el-radio label="1">否</el-radio>
              <el-radio label="2">是</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <!-------------------------------治疗详情---------------------------------------------->
        <div
          class="group-title"
          v-show="step === 2 && ruleForm.is_therapy === '2'"
        >
          治疗详情
        </div>
        <div
          class="group-content"
          v-show="step === 2 && ruleForm.is_therapy === '2'"
        >
          <el-form-item
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
          </el-form-item>
          <el-form-item
            label="总化疗疗程数："
            prop="Chemotherapy_counts"
            class="group-item"
          >
            <el-input-number
              v-model="ruleForm.Chemotherapy_counts"
              :min="1"
              :max="100"
              controls-position="right"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item
            label="末次化疗日期："
            prop="Last_Chemotherapy_date"
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
              v-model="ruleForm.Last_Chemotherapy_date"
            />
          </el-form-item>
          <el-form-item
            label="疾病状态："
            prop="status_after_last_chemotherapy"
            class="group-item"
          >
            <el-select
              v-model="ruleForm.status_after_last_chemotherapy"
              placeholder="请选择"
            >
              <el-option
                v-for="item in sexOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="是否复发："
            prop="is_relapse"
            class="group-item-2"
          >
            <el-radio-group v-model="ruleForm.is_relapse">
              <el-radio label="1">否</el-radio>
              <el-radio label="2">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="CR1时间："
            prop="CR1_date"
            class="group-item"
            v-if="ruleForm.is_relapse === '2'"
          >
            <el-date-picker
              clearable
              :placeholder="
                $t('datasetManagement.placeholder.data_update_year')
              "
              type="date"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              v-model="ruleForm.CR1_date"
            />
          </el-form-item>
          <el-form-item
            v-if="ruleForm.is_relapse === '2'"
            label="第1次复发时间："
            prop="frist_relapse_date"
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
              v-model="ruleForm.frist_relapse_date"
            />
          </el-form-item>
          <el-form-item
            label="CR2时间："
            prop="CR2_date"
            class="group-item"
            v-if="ruleForm.is_relapse === '2'"
          >
            <el-date-picker
              clearable
              :placeholder="
                $t('datasetManagement.placeholder.data_update_year')
              "
              type="date"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              v-model="ruleForm.CR2_date"
            />
          </el-form-item>
          <el-form-item
            v-if="ruleForm.is_relapse === '2'"
            label="第2次复发时间："
            prop="second_relapse_date"
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
              v-model="ruleForm.second_relapse_date"
            />
          </el-form-item>
          <el-form-item
            label="CR3时间："
            prop="CR3_date"
            class="group-item-2"
            v-if="ruleForm.is_relapse === '2'"
          >
            <el-date-picker
              clearable
              :placeholder="
                $t('datasetManagement.placeholder.data_update_year')
              "
              type="date"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              v-model="ruleForm.CR3_date"
            />
          </el-form-item>
          <el-form-item
            label="是否骨髓移植："
            prop="is_transplant"
            class="group-item-2"
          >
            <el-radio-group v-model="ruleForm.is_transplant">
              <el-radio label="1">否</el-radio>
              <el-radio label="2">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="移植时间："
            prop="transplant_date"
            class="group-item-2"
            v-if="ruleForm.is_transplant === '2'"
          >
            <el-date-picker
              clearable
              :placeholder="
                $t('datasetManagement.placeholder.data_update_year')
              "
              type="date"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              v-model="ruleForm.transplant_date"
            />
          </el-form-item>
          <el-form-item label="是否死亡：" prop="is_death" class="group-item-2">
            <el-radio-group v-model="ruleForm.is_death">
              <el-radio label="1">否</el-radio>
              <el-radio label="2">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="死亡时间："
            prop="date_of_death"
            class="group-item-2"
            v-if="ruleForm.is_death === '2'"
          >
            <el-date-picker
              clearable
              :placeholder="
                $t('datasetManagement.placeholder.data_update_year')
              "
              type="date"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              v-model="ruleForm.date_of_death"
            />
          </el-form-item>
          <el-form-item
            label="末次随访日期："
            prop="last_followup_date"
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
              v-model="ruleForm.last_followup_date"
            />
          </el-form-item>
          <el-form-item label="备注：" prop="note" class="group-item-2">
            <el-button type="primary" plain @click="addNotes">添加</el-button>
          </el-form-item>
          <el-form-item
            label=""
            class="group-item-3"
            v-if="ruleForm.noteData && ruleForm.noteData.length"
          >
            <el-table :data="ruleForm.noteData" style="width: 100%">
              <el-table-column prop="date" label="日期" width="250">
                <template #default="scope">
                  <el-date-picker
                    clearable
                    :placeholder="
                      $t('datasetManagement.placeholder.data_update_year')
                    "
                    type="date"
                    style="width: 100%"
                    value-format="YYYY-MM-DD"
                    v-model="scope.row.date"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="content" label="内容">
                <template #default="scope">
                  <el-input
                    placeholder="请输入"
                    v-model="scope.row.content"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template #default="scope">
                  <el-button type="danger" plain @click="delNotes(scope.$index)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="附件：" prop="fileList">
            <el-upload
              v-model:file-list="ruleForm.fileList"
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
            >
              <el-icon><Plus /></el-icon>
              <div style="color: #8c8c8c">点击上传</div>
            </el-upload>
          </el-form-item>
        </div>
      </el-form>
    </el-scrollbar>
    <div class="btn-wrap">
      <el-button @click="goBack">取消</el-button>
      <el-button @click="nextStep(null)" v-if="step < 2" type="primary"
        >下一步</el-button
      >
      <el-button @click="lastStep(null)" v-else>上一步</el-button>
      <el-button
        type="primary"
        @click="submitForm(ruleFormRef)"
        v-if="step === 2"
        >提交</el-button
      >
    </div>
    <el-dialog v-model="dialogVisible" title="文件预览">
      <div style="display: flex; justify-content: center">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import moment from 'moment'
import { ref, computed, watch, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const step = ref(1)
const ruleFormRef = ref()
const ruleForm = reactive({
  patient_name: 'Hello',
  gender: '',
  date_birth: '',
  identity_id: '',
  family_address_city: '',
  family_address: '',
  phone_number: '',
  hospital: '',
  doctor_name: '',
  inhospital_id: '',

  time_of_diagnosis: '',
  large_classification: '',
  small_classification: '',
  diagnose: '',
  wcb: '',
  hb: '',
  plt: '',
  bone_marrow_morphology: '',
  fcm: '',
  fusion: '',
  fusion_detail: '',
  mutation: '',
  mutation_detail: '',
  chromosome: '',
  chromosome_detail: '',
  is_therapy: '1',

  C1_date: '',
  C1_detail: '',
  C1_effects: '',
  C1_MRD: '',
  C2_date: '',
  C2_detail: '',
  C2_effects: '',
  C2_MRD: '',
  Chemotherapy_counts: 0,
  Last_Chemotherapy_date: '',
  status_after_last_chemotherapy: '',
  is_relapse: '1',
  CR1_date: '',
  frist_relapse_date: '',
  CR2_date: '',
  second_relapse_date: '',
  CR3_date: '',
  is_transplant: '1',
  transplant_date: '',
  is_death: '1',
  date_of_death: '',
  last_followup_date: '',
  noteData: [
    {
      date: moment(new Date()).format('YYYY-MM-DD'),
      content: '',
    },
  ],
  fileList: [
    {
      name: 'food.jpeg',
      url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
    },
  ],
})

const requiredReg = { required: true, trigger: 'blur', message: '该项为必填项' }
const rules = reactive({
  patient_name: [requiredReg],
  gender: [requiredReg],
  date_birth: [requiredReg],
  identity_id: [requiredReg],
  family_address_city: [requiredReg],
  family_address: [requiredReg],
  phone_number: [requiredReg],
  hospital: [requiredReg],
  doctor_name: [requiredReg],
  inhospital_id: [requiredReg],
  time_of_diagnosis: [requiredReg],
  large_classification: [requiredReg],
  small_classification: [requiredReg],
  diagnose: [requiredReg],
  wcb: [requiredReg],
  hb: [requiredReg],
  plt: [requiredReg],
  bone_marrow_morphology: [requiredReg],
  fcm: [requiredReg],
  fusion: [requiredReg],
  mutation: [requiredReg],
  chromosome: [requiredReg],
  is_therapy: [requiredReg],
  is_relapse: [requiredReg],
  is_transplant: [requiredReg],
  is_death: [requiredReg],
  last_followup_date: [requiredReg],
})

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const genderOptions = ref([
  { label: '男', value: 1 },
  { label: '女', value: 2 },
])

const hospitalOptions = ref([
  { label: '浙一医院', value: 1 },
  { label: '浙二医院', value: 2 },
])

const diagnoseOptions = ref([
  { label: 'deno AML', value: 1 },
  { label: 'sAML', value: 2 },
  { label: 'Ph+ALL（PH+ 融合基因）', value: 3 },
  { label: 'Ph-B-ALL（PH-融合基因）', value: 4 },
  { label: 'T-ALL', value: 5 },
  { label: 'ETP-ALL', value: 6 },
  { label: 'Ph+MPAL', value: 7 },
  { label: 'MLL+MPAL', value: 8 },
  { label: 'B-Myeloid MPAL', value: 9 },
  { label: 'T-Myeloid MPAL', value: 10 },
  { label: 'BPDCN', value: 11 },
])

const fusionOptions = ref([
  { label: '未测', value: 1 },
  { label: '测了部分', value: 2 },
  { label: '融合基因套餐', value: 3 },
])

const mutationOptions = ref([
  { label: '未测', value: 1 },
  { label: '测了部分', value: 2 },
  { label: 'NGS', value: 3 },
])

const chromosomeOptions = ref([
  { label: '未测', value: 1 },
  { label: '未见分裂相', value: 2 },
  { label: '具体结果', value: 3 },
])

const options = [
  {
    value: 'guide',
    label: '浙江省',
    // disabled: true,
    children: [
      {
        value: 'disciplines',
        label: '杭州市',
        children: [
          {
            value: 'consistency',
            label: '余杭区',
          },
          {
            value: 'feedback',
            label: '滨江区',
          },
          {
            value: 'efficiency',
            label: '西湖区',
          },
          {
            value: 'controllability',
            label: '上城区',
          },
        ],
      },
      {
        value: 'navigation',
        label: '宁波市',
        children: [
          {
            value: 'side nav',
            label: '鄞州区',
          },
          {
            value: 'top nav',
            label: '北仑区',
          },
        ],
      },
    ],
  },
  {
    value: 'component',
    label: '广东省',
    children: [
      {
        value: 'basic',
        label: '广州市',
        children: [
          {
            value: 'layout',
            label: '番禺区',
          },
          {
            value: 'color',
            label: '白云区',
          },
          {
            value: 'typography',
            label: '越秀区',
          },
          {
            value: 'icon',
            label: '天河区',
          },
          {
            value: 'button',
            label: '海珠区',
          },
        ],
      },
    ],
  },
]

onMounted(() => {
  const { query } = route
  if (query.step) {
    step.value = +query.step
    ruleForm.is_therapy = query.is_therapy
  }
})

const nextStep = (val) => {
  if (val) {
    step.value = val
    return
  }
  step.value += 1
}

const lastStep = (val) => {
  if (val) {
    step.value = val
    return
  }
  step.value -= 1
}

const addNotes = () => {
  ruleForm.noteData.unshift({
    date: '',
    content: '',
  })
}

const delNotes = (index) => {
  ruleForm.noteData.splice(index, 1)
}

const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}

const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}

const goBack = () => {
  router.back()
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
  .group-content {
    display: flex;
    flex-wrap: wrap;
    padding: 24px 66px;
    .group-item {
      width: 30%;
      margin: 0 3% 24px 0;
    }
    .group-item-1 {
      width: 30%;
      margin: 0 30% 24px 0;
    }
    .group-item-2 {
      width: 30%;
      margin: 0 60% 24px 0;
    }
    .group-item-3 {
      width: 90%;
      margin: 0 0 24px 0;
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

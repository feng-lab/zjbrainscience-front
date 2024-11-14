export const diagnoseOptions = [
  { label: 'de_no_AML', value: 1 },
  { label: 'sAML', value: 2 },
  { label: 'Ph+ALL（PH+ 融合基因）', value: 3 },
  { label: 'Ph-B-ALL（PH-融合基因）', value: 4 },
  { label: 'T-ALL', value: 5 },
  { label: 'ETP-ALL', value: 6 },
  { label: 'Ph+MPAL', value: 7 },
  { label: 'MLL+MPAL', value: 8 },
  { label: 'B-Myeloid_MPAL', value: 9 },
  { label: 'T-Myeloid_MPAL', value: 10 },
  { label: 'BPDCN', value: 11 },
]

export const fusionOptions = [
  { label: '未测', value: 1 },
  { label: '部分检测', value: 2 },
  { label: '融合基因套餐', value: 3 },
]

export const mutationOptions = [
  { label: '未测', value: 1 },
  { label: '部分检测', value: 2 },
  { label: 'NGS', value: 3 },
]

export const chromosomeOptions = [
  { label: '未测', value: 1 },
  { label: '未见分裂相', value: 2 },
  { label: '具体结果', value: 3 },
]

export const chemotherapyOptions = [
  { label: 'CR/CRi', value: 1 },
  { label: 'PR', value: 2 },
  { label: 'NR', value: 3 },
]

export const commonInfoInit = [
  { label: '性别', value: '', key: 'gender' },
  { label: '出生日期', value: '', key: 'date_birth' },
  {
    label: '身份证',
    value: '',
    key: 'identity_id',
    style: '-width-100',
  },
  {
    label: '联系电话',
    value: '',
    key: 'phone_number',
    style: '-width-100',
  },
  {
    label: '家庭住址',
    value: '',
    key: 'family_address_city',
    style: '-width-100',
  },
  { label: '医院', value: '', key: 'hospital' },
  { label: '医生', value: '', key: 'doctor_name' },
  {
    label: '住院号',
    value: '',
    key: 'inhospital_id',
    style: '-width-100',
  },
]

export const visitInfoInit = [
  { label: '确诊时间', value: '', key: 'timing_of_diagnosis' },
  { label: '诊断', value: '', key: 'diagnose' },
  { label: '大分型', value: '', key: 'large_classification' },
  { label: '小分型', value: '', key: 'small_classification' },
  { label: 'WBC', value: '', key: 'wcb' },
  { label: 'Hb', value: '', key: 'hb' },
  { label: 'PLT', value: '', key: 'plt' },
  { label: '骨髓形态', value: '', key: 'bone_marrow_morphology' },
  { label: 'FCM', value: '', key: 'fcm', style: '-width-100' },
  { label: '融合基因', value: '', key: 'fusion' },
  { label: '融合基因详情', value: '', key: 'fusion_detail' },
  { label: '基因突变', value: '', key: 'mutation' },
  { label: '基因突变详情', value: '', key: 'mutation_detail' },
  { label: '染色体', value: '', key: 'chromosome' },
  { label: '染色体详情', value: '', key: 'chromosome_detail' },
]

export const healInfoInit = [
  { label: '总疗程数', value: '', key: 'chemotherapy_counts' },
  { label: '末次化疗', value: '', key: 'last_chemotherapy_date' },
  {
    label: '末次化疗疾病状态',
    value: '',
    key: 'status_after_last_chemotherapy',
    style: '-width-100',
  },
]

export const otherInfoInit = [
  { label: '是否复发', value: '', key: 'is_relapse', style: '-width-100' },
  { label: 'CR1时间', value: '', key: 'cr1_date' },
  { label: '第一次复发', value: '', key: 'frist_relapse_date' },
  { label: 'CR2时间', value: '', key: 'cr2_date' },
  { label: '第二次复发', value: '', key: 'second_relapse_date' },
  {
    label: 'CR3时间',
    value: '',
    key: 'cr3_date',
    style: '-width-100',
  },
  { label: '是否骨髓移植', value: '', key: 'is_transplant' },
  { label: '移植时间', value: '', key: 'transplant_date' },
  { label: '是否死亡', value: '', key: 'is_death' },
  { label: '死亡时间', value: '', key: 'date_of_death' },
  {
    label: '末次随访日期',
    value: '',
    key: 'last_followup_date',
    style: '-width-100',
  },
]

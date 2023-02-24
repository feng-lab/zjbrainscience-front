<template>
  <experiments-associate
    ref="equipmentRef"
    :columns="columns"
    i18n-prefix="equipment"
    :add-button-text="$t('button.newEquipment')"
    :search-fields="searchFields"
    :list-api="equipmentsApi"
    :delete-api="deleteEquipmentApi"
    :disassociate-api="disassociateEquipmentApi"
    :associate-api="associateEquipmentApi"
    list-path="/experiments/equipment"
    @show-new-form="handleNew"
    @view-detail="handleShowForm"
  >
    <equipment-form
      v-model="showForm" 
      v-model:cu-id="itemId" 
      @submit-success="handleSubmitSuccess"
    />
  </experiments-associate>
  
</template>
<script setup>
import EquipmentForm from "./EquipmentForm.vue";
import ExperimentsAssociate from "../experiments/ExperimentsAssociate.vue";

import { computed, inject } from "vue";
import { 
  equipmentsApi,
  deleteEquipmentApi,
  associateEquipmentApi,
  disassociateEquipmentApi
} from "@/api/equipment";
import { useI18n } from "vue-i18n";
import { useShowForm } from "@/compositions/useShowForm";
import { useAssociateToExperiment } from "@/compositions/useAssociateToExperiment";

const i18n = useI18n();
const experiment_id = inject("exid", null);

const { 
  showForm, 
  itemId, 
  handleShowForm 
} = useShowForm();
const { 
  associateRef: equipmentRef, 
  handleNew, 
  handleSubmitSuccess 
} = useAssociateToExperiment(showForm);


const basic_columns = ["id", "name", "brand", "purpose"];
const columns = experiment_id ? [...basic_columns, "index"] : basic_columns;

const searchFields = computed(() =>  
  ["name", "brand"].map(name => ({
    name,
    label: i18n.t(`equipment.${name}`)
  }))
)

</script>
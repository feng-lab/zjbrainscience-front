import { ref } from "vue";

export function useAssociateToExperiment(showNewForm, idKey="id") {
  const associateRef = ref();
  let isAssociateAfterNew = false;

  const handleNew = ({ showForm, isAssociate }) => {
    showNewForm.value = showForm;
    isAssociateAfterNew = isAssociate; 
  }

  const handleSubmitSuccess = async (res) => {
    await associateRef.value.reloadTable();
    if(res) {
      const id = res[idKey] ?? res;
      if(isAssociateAfterNew) {
        await associateRef.value.handleAssociate(true, id);
      }
    }
  }

  return {
    associateRef,
    handleNew,
    handleSubmitSuccess
  }
}
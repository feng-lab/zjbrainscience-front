import { ref } from "vue";

export function useShowForm(newMethod, updateMethod) {
  const showForm = ref(false);
  const itemId = ref();

  const handleShowForm = (id) => {
    console.log('id', id)
    showForm.value = true;
    itemId.value = id;
  }

  return {
    showForm,
    itemId,
    handleShowForm
  }
}
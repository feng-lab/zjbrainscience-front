export function submitForm(formRef, url, callback) {}

export function resetForm(formRef) {
  if(!formRef) return;
  formRef.resetFields();
}
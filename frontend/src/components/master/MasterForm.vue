<script setup>
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import DatePicker from 'primevue/datepicker'
import Textarea from 'primevue/textarea'
defineProps({
  visible:Boolean,
  title:String,
  form:Object,
  fields:Array
})

const emit =
defineEmits([
  'save',
  'update:visible'
])

</script>

<template>

<Dialog
  :visible="visible"
  modal
  :header="title"
  style="width:600px"
  @update:visible="
    emit('update:visible',$event)
  "
>

  <div
    v-for="field in fields"
    :key="field.name"
    class="mb-3"
  >

    <label>
      {{ field.label }}
    </label>

    <InputText
      v-if="field.type === 'text' || !field.type"
      v-model="form[field.name]"
      class="w-full"
    />
    <!-- DROPDOWN -->
    <Dropdown
        v-else-if="field.type === 'dropdown'"
        v-model="form[field.name]"
        :options="field.options"
        optionLabel="label"
        optionValue="value"
        class="w-full"
        placeholder="Pilih..."
      />
    
    <!-- NUMBER -->
    <InputNumber
      v-else-if="field.type === 'number'"
      v-model="form[field.name]"
      class="w-full"
    />
    <!-- DATE -->
    <DatePicker 
      v-else-if="field.type === 'date'"
      v-model="form[field.name]"
      class="w-full"
    />
    <Textarea
      v-else-if="field.type === 'textarea'"
      v-model="form[field.name]"
      class="w-full"
      rows="3"
      />
  </div>

  <template #footer>

    <Button
      label="Simpan"
      icon="pi pi-save"
      @click="emit('save')"
    />

  </template>

</Dialog>

</template>
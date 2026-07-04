
<template>
  <div class="surface-ground flex align-items-center justify-content-center min-h-screen">
    <Card class="w-full md:w-30rem shadow-4 border-round-2xl">
      <template #title>
        <div class="text-center mt-3">
          <h1 class="text-3xl font-bold mb-2">
            Create Account
          </h1>
          <p class="text-color-secondary">
            Daftar untuk melanjutkan ke aplikasi
          </p>
        </div>
      </template>

      <template #content>
        <form
          @submit.prevent="handleRegister"
          class="flex flex-column gap-4 mt-4"
        >
          <div class="flex flex-column gap-2">
            <label>Nama Lengkap</label>
            <InputText
              v-model="form.name"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          <div class="flex flex-column gap-2">
            <label>Email</label>
            <InputText
              v-model="form.email"
              type="email"
              placeholder="Masukkan email"
            />
          </div>

          <div class="flex flex-column gap-2">
            <label>Password</label>
            <Password
              v-model="form.password"
              toggleMask
              :feedback="false"
              fluid
              placeholder="Masukkan password"
            />
          </div>

          <Button
            type="submit"
            label="Register"
            icon="pi pi-user-plus"
            severity="contrast"
            class="w-full"
          />
        </form>

        <Message
          v-if="message"
          severity="info"
          class="mt-4"
        >
          {{ message }}
        </Message>

        <div class="text-center mt-5">
          Sudah punya akun?
          <router-link
            to="/"
            class="font-bold no-underline ml-2"
          >
            Login
          </router-link>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'

import { registerUser } from '../services/authService'

const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  password: '',
})

const message = ref('')

const handleRegister = async () => {
  try {
    const response = await registerUser(form)

    message.value = 'Register berhasil'
    console.log(response.data)

    router.push('/')
  } catch (error) {
    message.value =
      error?.response?.data?.metadata?.message ||
      'Terjadi kesalahan'
  }
}
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 20px;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.auth-header h1 {
  margin: 0;
  font-size: 32px;
  color: #222;
}

.auth-header p {
  color: #666;
  margin-top: 10px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 8px;
  font-weight: 600;
  color: #444;
}

.form-group input {
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #ddd;
  font-size: 15px;
  transition: 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15);
}

.btn-primary {
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: #667eea;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.btn-primary:hover {
  background: #5568d8;
}

.message {
  margin-top: 20px;
  text-align: center;
  color: #444;
}

.auth-footer {
  margin-top: 25px;
  text-align: center;
  color: #666;
}

.auth-footer a {
  color: #667eea;
  font-weight: bold;
  text-decoration: none;
}
</style>


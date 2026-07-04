
<template>
  <div class="surface-ground flex align-items-center justify-content-center min-h-screen px-3">
    <Card class="w-full md:w-30rem shadow-5 border-round-2xl">
      <template #title>
        <div class="text-center mt-3">
          <div class="mb-3">
            <i class="pi pi-shield text-5xl text-primary"></i>
          </div>

          <h1 class="text-3xl font-bold mb-2">
            Welcome Back
          </h1>

          <p class="text-color-secondary">
            Login untuk mengakses dashboard
          </p>
        </div>
      </template>

      <template #content>
        <form
          @submit.prevent="handleLogin"
          class="flex flex-column gap-4 mt-4"
        >
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
            label="Login"
            icon="pi pi-sign-in"
            severity="primary"
            class="w-full"
          />
        </form>

        <Message
          v-if="message"
          severity="error"
          class="mt-4"
        >
          {{ message }}
        </Message>

        <div class="text-center mt-5">
          Belum punya akun?
          <router-link
            to="/register"
            class="font-bold no-underline ml-2"
          >
            Register
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
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Message from 'primevue/message'

import { loginUser } from '../services/authService'

const router = useRouter()

const form = reactive({
  email: '',
  password: '',
})

const message = ref('')

const handleLogin = async () => {
  try {
    const response = await loginUser(form)

    console.clear()
    console.log(response.data)

    const token = response?.data?.response?.token

    if (!token) {
      message.value = 'Token tidak ditemukan'
      console.error('Token missing')
      return
    }

    localStorage.setItem('token', token)

    console.log(
      'Saved token:',
      localStorage.getItem('token')
    )

    message.value = 'Login berhasil'

    router.push('/dashboard')
  } catch (error) {
    console.error(error)

    message.value =
      error?.response?.data?.metadata?.message ||
      'Terjadi kesalahan'
  }
}
</script>


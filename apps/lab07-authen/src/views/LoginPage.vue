<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <h2>Login Email</h2>

      <ion-item>
        <ion-input v-model="email" placeholder="Email"></ion-input>
      </ion-item>

      <ion-item>
        <ion-input v-model="password" type="password" placeholder="Password"></ion-input>
      </ion-item>

      <ion-button expand="block" @click="loginEmail">
        Login Email/Password
      </ion-button>

      <h2>Login Google</h2>

      <ion-button expand="block" color="danger" @click="loginGoogle">
        Login Google
      </ion-button>

      <h2>Login Phone</h2>

      <ion-item>
        <ion-input v-model="phone" placeholder="+668xxxxxxxx"></ion-input>
      </ion-item>

      <ion-button expand="block" color="success" @click="loginPhone">
        Login by Phone
      </ion-button>

      <div id="recaptcha-container"></div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton } from '@ionic/vue';
import { authService } from '@/auth/auth-service';

const router = useRouter();

const email = ref('');
const password = ref('');
const phone = ref('');

const loginEmail = async () => {
  await authService.loginWithEmailPassword({
    email: email.value,
    password: password.value
  });
  router.push('/tabs/tab1');
};

const loginGoogle = async () => {
  await authService.loginWithGoogle();
  router.push('/tabs/tab1');
};

const loginPhone = async () => {
  const r = await authService.startPhoneLogin({
    phoneNumberE164: phone.value
  });

  const code = prompt("Enter OTP");
  await authService.confirmPhoneCode({
    verificationId: r.verificationId,
    verificationCode: code!
  });

  router.push('/tabs/tab1');
};
</script>
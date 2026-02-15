<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>User Profile</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <div v-if="user">
        <h2>ข้อมูลผู้ใช้</h2>

        <p><strong>UID:</strong> {{ user.uid }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Phone:</strong> {{ user.phoneNumber }}</p>
        <p><strong>Name:</strong> {{ user.displayName }}</p>

        <ion-button expand="block" color="danger" @click="logout">
          Logout
        </ion-button>
      </div>

      <div v-else>
        <p>กำลังโหลดข้อมูลผู้ใช้...</p>
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
import { authService } from '@/auth/auth-service';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = ref<any>(null);

onMounted(async () => {
  user.value = await authService.getCurrentUser();
});

const logout = async () => {
  await authService.logout();
  router.push('/login');
};
</script>
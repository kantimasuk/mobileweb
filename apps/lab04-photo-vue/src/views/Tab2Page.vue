<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Photo Gallery</ion-title>
        <ion-text class="ion-padding" color="dark">
          โดย กานติมา สุคำภา รหัส 673380204-8
        </ion-text>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">

      <ion-grid>
        <ion-row>
          <ion-col
            size="6"
            v-for="photo in photos"
            :key="photo.filepath"
          >
            <ion-img :src="photo.webviewPath" />
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>

    <!-- ปุ่มถ่ายรูป -->
    <ion-fab vertical="bottom" horizontal="center" slot="fixed">
      <ion-fab-button @click="takePhoto">
        <ion-icon :icon="camera"></ion-icon>
      </ion-fab-button>
    </ion-fab>
  </ion-page>
</template>

<script setup lang="ts">
import { camera } from 'ionicons/icons';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonText,
  IonFab,
  IonFabButton,
  IonIcon,
  IonImg,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/vue';

import { usePhotoGallery } from '@/composables/usePhotoGallery';

const { photos, takePhoto } = usePhotoGallery();
</script>
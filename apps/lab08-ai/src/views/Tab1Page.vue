<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="toolbar">
        <ion-title>Lab08: Gemini Vision โดย กานติมา</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="page">

      <div class="container">

        <!-- Upload Card -->
        <div class="upload-card">
          <input ref="fileEl" type="file" accept="image/*" hidden @change="onFileChange" />

          <ion-button expand="block" class="btn-upload" @click="fileEl?.click()">
            เลือกไฟล์ภาพ
          </ion-button>

          <ion-button expand="block" class="btn-camera" @click="onTakePhoto">
            ถ่ายภาพจากกล้อง
          </ion-button>
        </div>

        <!-- Preview -->
        <div v-if="previewUrl" class="preview-wrapper">
          <ion-img :src="previewUrl" />
        </div>

        <!-- Analyze -->
        <ion-button
          expand="block"
          size="large"
          class="btn-analyze"
          :disabled="!img || loading"
          @click="onAnalyze"
        >
          วิเคราะห์ภาพด้วย AI
        </ion-button>

        <div class="center">
          <ion-spinner v-if="loading" />
        </div>

        <!-- Result -->
        <div v-if="result" class="result-card">

          <div class="section">
            <h3>คำอธิบายภาพ</h3>
            <p class="caption">{{ result.caption }}</p>
          </div>

          <div class="section">
            <h3>คำสำคัญ</h3>
            <div class="tag-container">
              <span class="tag" v-for="t in result.tags" :key="t">
                {{ t }}
              </span>
            </div>
          </div>

          <div v-if="result.objects" class="section">
            <h3>วัตถุที่ตรวจพบ</h3>
            <ul>
              <li v-for="o in result.objects" :key="o.name">
                {{ o.name }}
                <span v-if="o.confidence">
                  ({{ (o.confidence * 100).toFixed(0) }}%)
                </span>
              </li>
            </ul>
          </div>

          <div v-if="result.safety" class="section">
            <h3>ความปลอดภัย</h3>
            <p :class="result.safety.isSensitive ? 'danger' : 'safe'">
              {{ result.safety.isSensitive ? "อาจมีเนื้อหาอ่อนไหว" : "ภาพปลอดภัย" }}
            </p>
          </div>

        </div>

      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonImg,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar
} from "@ionic/vue";

import { PhotoService } from "../core/photo.service";
import { GeminiVisionService } from "../core/gemini.service";
import type { Base64Image } from "../core/ai.interface";
import type { ImageAnalysisResult } from "../core/ai.interface";

const fileEl = ref<HTMLInputElement | null>(null);
const img = ref<Base64Image | null>(null);
const previewUrl = ref("");
const result = ref<ImageAnalysisResult | null>(null);
const loading = ref(false);

async function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  img.value = await PhotoService.fromFile(file);
  previewUrl.value = URL.createObjectURL(file);
  result.value = null;
}

async function onTakePhoto() {
  loading.value = true;

  const b64 = await PhotoService.fromCamera();

  if (b64) {
    img.value = b64;
    previewUrl.value = `data:${b64.mimeType};base64,${b64.base64}`;
    result.value = null;
  }

  loading.value = false;
}

async function onAnalyze() {
  if (!img.value) return;
  loading.value = true;
  try {
    result.value = await GeminiVisionService.analyze(img.value);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.page {
  --background: #f7f8fa;
}

.toolbar {
  --background: #ffffff;
  --color: #111;
  border-bottom: 1px solid #eee;
  font-weight: 600;
}

.container {
  padding: 20px;
}

/* Upload Card */
.upload-card {
  background: white;
  border-radius: 18px;
  padding: 20px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.05);
  margin-bottom: 24px;
}

/* Buttons */
.btn-upload {
  --color: #ffffff;
  --background: linear-gradient(135deg, #667eea, #764ba2);
  --border-radius: 14px;
  font-weight: 600;
  margin-bottom: 12px;
}

.btn-camera {
  --background: #ffffff;
  --color: #333;
  --border-radius: 14px;
  font-weight: 500;
}

.btn-analyze {
  --color: #ffffff;
  --background: linear-gradient(135deg, #667eea, #764ba2);
  --border-radius: 18px;
  --box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  margin-top: 16px;
}

/* Preview */
.preview-wrapper {
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.12);
}

/* Result */
.result-card {
  color: #444;
  background: white;
  border-radius: 22px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}

.section {
  margin-bottom: 20px;
}

.caption {
  font-size: 16px;
  line-height: 1.6;
  color: #444;
}

.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: #eef3ff;
  color: #3f51b5;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.center {
  text-align: center;
  margin: 16px 0;
}

.safe {
  color: #2e7d32;
  font-weight: 600;
}

.danger {
  color: #c62828;
  font-weight: 600;
}
</style>
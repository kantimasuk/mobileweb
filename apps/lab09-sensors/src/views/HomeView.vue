<template>
  <ion-page>

    <!-- HEADER -->
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title class="title-center">
          Arm Workout App
        </ion-title>
      </ion-toolbar>
      <ion-toolbar color="light">
        <div class="sub-header">
          673380204-8 นางสาวกานติมา สุคำภา
        </div>
      </ion-toolbar>
    </ion-header>

    <!-- CONTENT -->
    <ion-content class="ion-padding">

      <!-- Counter ใหญ่กลางจอ -->
      <div class="counter-container">
        <h1 class="counter">{{ state?.repDisplay ?? 0 }}</h1>
        <p class="status">{{ state?.status }}</p>
      </div>

      <!-- Stats Card -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>สถิติการออกกำลังกาย</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p>รอบทั้งหมด: {{ state?.stats.repsTotal ?? 0 }}</p>
          <p>รอบถูก: {{ state?.stats.repsOk ?? 0 }}</p>
          <p>รอบผิด: {{ state?.stats.repsBad ?? 0 }}</p>
          <p>คะแนน: {{ state?.stats.score ?? 0 }}</p>
          <p>Tempo เฉลี่ย: {{ state?.stats.avgRepMs ?? 0 }} ms</p>
          <p>เปอร์เซ็นต์ถูก: {{ state?.stats.percentOk ?? 0 }}%</p>
          <p class="message">{{ state?.stats.lastMessage ?? '-' }}</p>
        </ion-card-content>
      </ion-card>

      <!-- Buttons -->
      <div class="btn-group">
        <ion-button
          expand="block"
          color="success"
          :disabled="isRunning"
          @click="start"
        >
          เริ่ม (Start)
        </ion-button>

        <ion-button
          expand="block"
          color="danger"
          :disabled="!isRunning"
          @click="stop"
        >
          หยุด (Stop)
        </ion-button>
      </div>

    </ion-content>

  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { MotionService } from "../core/MotionService";
import { TtsService } from "../core/TtsService";
import { HapticsService } from "../core/HapticsService";
import { ArmWorkoutEngine } from "../core/ArmWorkoutEngine";
import type { WorkoutState } from "../core/types";

const state = ref<WorkoutState | null>(null);

const engine = new ArmWorkoutEngine();
const motion = new MotionService();
const tts = new TtsService();
const haptics = new HapticsService();

const isRunning = computed(() => state.value?.status === "RUNNING");

onMounted(() => {
  engine.onChange((s) => {
    state.value = s;

    // ถ้ารอบถูก ให้สั่น + พูดเลข
    if (s.stats.lastMessage === "ดีมาก") {
      haptics.success();
      tts.speak(String(s.repDisplay));
    }

    // ถ้ารอบผิด ให้สั่นเตือน + พูดข้อความ
    if (
      s.stats.lastMessage &&
      s.stats.lastMessage !== "ดีมาก"
    ) {
      haptics.warning();
      tts.speak(s.stats.lastMessage);
    }
  });
});

async function start() {
  if (isRunning.value) return;

  await tts.speak("เริ่มกายบริหารแขน ยกขึ้นจนสุด แล้วลดลง");

  engine.start();
  await motion.start((s) => engine.process(s));
}

async function stop() {
  if (!isRunning.value) return;

  await motion.stop();
  engine.stop();
  await tts.speak("หยุดการออกกำลังกาย");
}
</script>

<style scoped>

.title-center {
  text-align: center;
}

.sub-header {
  text-align: center;
  font-size: 14px;
  padding: 6px;
  font-weight: 500;
}

.counter-container {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.counter {
  font-size: 72px;
  font-weight: bold;
  margin: 0;
}

.status {
  font-size: 16px;
  color: gray;
}

.btn-group {
  margin-top: 20px;
}

.message {
  font-weight: bold;
  color: #d32f2f;
}

</style>
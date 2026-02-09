<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="success">
        <ion-title>เพิ่มรายการ</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <ion-card>
        <ion-card-content>

          <ion-input
            label="ชื่อรายการ"
            placeholder="เช่น ค่าข้าว"
            v-model="title">
          </ion-input>

          <ion-input
            label="จำนวนเงิน"
            type="number"
            v-model="amount">
          </ion-input>

          <ion-select label="ประเภทรายการ" v-model="type">
            <ion-select-option value="income">รายรับ</ion-select-option>
            <ion-select-option value="expense">รายจ่าย</ion-select-option>
          </ion-select>

          <ion-input
            label="หมวดหมู่"
            placeholder="อาหาร / เดินทาง"
            v-model="category">
          </ion-input>

          <ion-textarea
            label="หมายเหตุ"
            v-model="note">
          </ion-textarea>

          <ion-button expand="block" size="large" @click="saveExpense">
            บันทึกข้อมูล
          </ion-button>

        </ion-card-content>
      </ion-card>

    </ion-content>
  </ion-page>
</template>

<script setup>
import {
 IonPage,
 IonHeader,
 IonToolbar,
 IonTitle,
 IonContent,
 IonCard,
 IonCardContent,
 IonInput,
 IonSelect,
 IonSelectOption,
 IonTextarea,
 IonButton
} from "@ionic/vue";

import { ref } from "vue";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";

const title = ref("");
const amount = ref(0);
const type = ref("expense");
const category = ref("");
const note = ref("");

const saveExpense = async () => {
 try {

  if(!title.value || amount.value<=0){
    alert("กรอกข้อมูลก่อน");
    return;
  }

  await addDoc(collection(db,"expenses"),{
    title:title.value,
    amount:Number(amount.value),
    type:type.value,
    category:category.value,
    note:note.value,
    createdAt:new Date()
  });

  alert("บันทึกสำเร็จ");

  title.value="";
  amount.value=0;
  category.value="";
  note.value="";

 }catch(e){
  console.error("FIREBASE ERROR:",e);
  alert("firebase error ดู console");
 }
};
</script>
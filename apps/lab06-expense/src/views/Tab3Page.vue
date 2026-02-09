<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="warning">
        <ion-title>แก้ไขรายการ</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <div v-if="loaded">

        <ion-input label="ชื่อรายการ" v-model="title"></ion-input>
        <ion-input label="จำนวนเงิน" type="number" v-model="amount"></ion-input>

        <ion-select label="ประเภท" v-model="type">
          <ion-select-option value="income">รายรับ</ion-select-option>
          <ion-select-option value="expense">รายจ่าย</ion-select-option>
        </ion-select>

        <ion-input label="หมวดหมู่" v-model="category"></ion-input>
        <ion-textarea label="หมายเหตุ" v-model="note"></ion-textarea>

        <ion-button expand="block" color="success" @click="updateExpense">
          บันทึกการแก้ไข
        </ion-button>

        <ion-button expand="block" color="danger" @click="deleteExpense">
          ลบรายการ
        </ion-button>

      </div>

      <div v-else style="text-align:center;margin-top:40px;">
        กำลังโหลดข้อมูล...
      </div>

    </ion-content>
  </ion-page>
</template>

<script setup>
import {
 IonPage,IonHeader,IonToolbar,IonTitle,
 IonContent,IonInput,IonSelect,IonSelectOption,
 IonTextarea,IonButton
} from "@ionic/vue";

import { ref,onMounted } from "vue";
import { doc,getDoc,updateDoc,deleteDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRoute } from "vue-router";

const route = useRoute();
const id = route.params.id; // ⭐ สำคัญ

const title=ref("");
const amount=ref(0);
const type=ref("expense");
const category=ref("");
const note=ref("");
const loaded=ref(false);

onMounted(async()=>{
 if(!id){
   alert("ไม่พบ id");
   return;
 }

 const snap=await getDoc(doc(db,"expenses",id));
 if(!snap.exists()){
   alert("ไม่พบข้อมูล");
   return;
 }

 const d=snap.data();

 title.value=d.title;
 amount.value=d.amount;
 type.value=d.type;
 category.value=d.category;
 note.value=d.note;

 loaded.value=true;
});

const updateExpense=async()=>{
 await updateDoc(doc(db,"expenses",id),{
  title:title.value,
  amount:Number(amount.value),
  type:type.value,
  category:category.value,
  note:note.value
 });

 alert("แก้ไขสำเร็จ");
 window.location.href="/tabs/tab1";
};

const deleteExpense=async()=>{
 if(confirm("ยืนยันการลบ?")){
  await deleteDoc(doc(db,"expenses",id));
  alert("ลบสำเร็จ");
  window.location.href="/tabs/tab1";
 }
};
</script>
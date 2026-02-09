<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>บัญชีรายรับ–รายจ่าย</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding bg">

      <!-- สรุปยอด -->
      <ion-grid>
        <ion-row>
          <ion-col size="6">
            <div class="card income">
              <p>รายรับทั้งหมด</p>
              <h1>{{ totalIncome }} บาท</h1>
            </div>
          </ion-col>

          <ion-col size="6">
            <div class="card expense">
              <p>รายจ่ายทั้งหมด</p>
              <h1>{{ totalExpense }} บาท</h1>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- รายการ -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>รายการทั้งหมด</ion-card-title>
        </ion-card-header>

        <ion-list>
          <ion-item 
            v-for="item in expenses" 
            :key="item.id"
            @click="goEdit(item)"
          >
            <ion-label>
              <h2>{{ item.title }}</h2>
              <p>{{ item.category }}</p>
            </ion-label>

            <ion-badge :color="item.type==='income'?'success':'danger'">
              {{ item.amount }} บาท
            </ion-badge>
          </ion-item>
        </ion-list>
      </ion-card>

    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref,onMounted,computed } from "vue";
import { collection,onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "vue-router";

const router = useRouter();
const expenses = ref([]);

onMounted(()=>{
 onSnapshot(collection(db,"expenses"),(snapshot)=>{
  expenses.value = snapshot.docs.map(doc=>({
    id:doc.id,
    ...doc.data()
  }));
 });
});

const totalIncome = computed(()=>{
 return expenses.value.filter(e=>e.type==="income")
 .reduce((s,e)=>s+e.amount,0);
});

const totalExpense = computed(()=>{
 return expenses.value.filter(e=>e.type==="expense")
 .reduce((s,e)=>s+e.amount,0);
});

const goEdit=(item)=>{
  router.push('/tabs/tab3/'+item.id);
};
</script>

<style>
.bg{background:#f6f7fb;}

.card{
 padding:18px;
 border-radius:18px;
 color:white;
 text-align:center;
 font-weight:600;
}

.income{background:#22c55e;}
.expense{background:#ef4444;}

h1{margin:6px 0;font-size:22px;}
</style>
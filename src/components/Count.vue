<template>
    <div class="count">
        <h2 class="card-title current">当前求和：{{ sum }}</h2>
        <div class="readings">
            <span>十倍 <b>{{ toBigSum }}</b></span>
            <span>校名 <b>{{ upperSchool }}</b></span>
        </div>
        <select v-model.number="choose" aria-label="选择步长">
            <option value="1">+1</option>
            <option value="2">+2</option>
            <option value="3">+3</option>
        </select>
        <div class="actions">
            <button class="btn btn-up" @click="add">加一档</button>
            <button class="btn btn-down" @click="sub">减一档</button>
        </div>
    </div>
</template>

<script setup lang="ts" name="Count">
    import {watch} from 'vue'
    import {storeToRefs} from 'pinia'
    import {useCountStore} from '@/store/Count'

    const countStore = useCountStore()

    const {sum, choose, toBigSum, upperSchool} = storeToRefs(countStore)

    function add() {
        countStore.increment(choose.value)
    }

    function sub() {
        countStore.increment(-choose.value)
    }

    // 兜底防越界：任何写入都会夹回 1~3，与 UI 双保险
    watch(
        () => countStore.choose,
        (val) => {
            const clamped = Math.max(1, Math.min(3, val))
            if (clamped !== val) {
                countStore.choose = clamped
            }
        }
    )
</script>
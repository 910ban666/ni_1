<template>
    <div class="talk">
        <h2 class="card-title">今日一言</h2>
        <button class="btn btn-quote" :disabled="likeTookStore.isLoading" @click="getLoveTalk">
        {{ likeTookStore.isLoading ? '正在采撷…' : '采撷一句名言' }}
    </button>
    <p v-if="likeTookStore.errorMsg" class="error">{{ likeTookStore.errorMsg }}</p>
    <ul>
            <li v-for="item in likeTookStore.likeList" :key="item.id">{{ item.title }}</li>
            <li v-if="likeTookStore.likeList.length === 0" class="empty">还没有名言，点上面的按钮摘一句吧 ✦</li>
        </ul>
    </div>
</template>

<script setup lang="ts" name="LikeTook">
    import {useLikeTook, LIKE_KEY} from '@/store/LikeTook'

    const likeTookStore = useLikeTook()

    // 每次 state 变化都写回，键名与 store 初始化读取保持一致
    likeTookStore.$subscribe((mutation, state) => {
        localStorage.setItem(LIKE_KEY, JSON.stringify(state.likeList))
    })

    function getLoveTalk() {
        likeTookStore.getATalk()
    }
</script>
<template>
    <div class="talk">
        <h2 class="card-title">今日一言</h2>

        <button class="btn btn-quote" :disabled="likeTookStore.isLoading" @click="getLoveTalk">
        {{ likeTookStore.isLoading ? '正在采撷…' : '采撷一句名言' }}
    </button>
    <p v-if="likeTookStore.errorMsg" class="error">{{ likeTookStore.errorMsg }}</p>

    <div class="talk-bar">
        <div class="talk-tabs">
            <button class="tab" :class="{on: filter === 'all'}" @click="filter = 'all'">全部</button>
            <button class="tab" :class="{on: filter === 'fav'}" @click="filter = 'fav'">收藏 <b v-if="favCount">{{ favCount }}</b></button>
        </div>
        <div class="talk-meta">
            <span class="count-note">{{ displayed.length }} 条</span>
            <button class="link-btn" v-if="likeTookStore.likeList.length" @click="onClear">清空</button>
        </div>
    </div>

    <div class="talk-scroll">
    <ul>
            <li v-for="item in displayed" :key="item.id">
                <div class="row-top">
                <p class="talk-text">{{ item.title }}</p>
                <button class="fav-btn" :class="{on: item.fav}" :title="item.fav ? '取消收藏' : '收藏'" @click="likeTookStore.toggleFav(item.id)">♥</button>
                </div>
                <div class="row-bottom">
                <p class="talk-author">{{ item.author }}</p>
                <div class="row-actions">
                    <button class="link-btn" @click="copy(item)">复制</button>
                    <button class="link-btn danger" @click="likeTookStore.removeOne(item.id)">删除</button>
                </div>
                </div>
            </li>
            <li v-if="displayed.length === 0" class="empty">
                {{ filter === 'all' ? '还没有名言，点上面的按钮摘一句吧 ✦' : '还没有收藏 ✦' }}
            </li>
        </ul>
    </div>
    </div>
</template>

<script setup lang="ts" name="LikeTook">
    import {computed, ref} from 'vue'
    import {useLikeTook, LIKE_KEY, type TalkItem} from '@/store/LikeTook'

    const likeTookStore = useLikeTook()

    // tab 筛选：全部 / 仅收藏
    const filter = ref<'all' | 'fav'>('all')
    const displayed = computed(() =>
        filter.value === 'fav' ? likeTookStore.likeList.filter(i => i.fav) : likeTookStore.likeList
    )
    const favCount = computed(() => likeTookStore.likeList.filter(i => i.fav).length)

    // 每次 state 变化都写回，键名与 store 初始化读取保持一致
    likeTookStore.$subscribe((mutation, state) => {
        localStorage.setItem(LIKE_KEY, JSON.stringify(state.likeList))
    })

    function getLoveTalk() {
        likeTookStore.getATalk()
    }

    async function copy(item: TalkItem) {
        try {
            await navigator.clipboard.writeText(item.title + ' —— ' + item.author)
            // 极简反馈：可换 toast，此处用按钮文字闪一下
        } catch {
            /* 忽略剪贴板权限异常 */
        }
    }

    function onClear() {
        if (confirm('确定清空全部名言吗？')) likeTookStore.clearAll()
    }
</script>
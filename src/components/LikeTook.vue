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
                <button class="fav-btn" :class="{on: item.fav}" :title="item.fav ? '取消收藏' : '收藏'" @click="onFav(item)">♥</button>
                </div>
                <div class="row-bottom">
                <p class="talk-author">{{ item.author }}</p>
                <div class="row-actions">
                    <button class="link-btn" @click="copy(item)">复制</button>
                    <button class="link-btn danger" @click="onRemove(item)">删除</button>
                </div>
                </div>
            </li>
            <li v-if="displayed.length === 0" class="empty">
                {{ filter === 'all' ? '还没有名言，点上面的按钮摘一句吧 ✦' : '还没有收藏 ✦' }}
            </li>
        </ul>
    </div>
    </div>

    <!-- 定制复古风格确认弹窗 -->
    <div v-if="showClearModal" class="modal-mask" @click.self="showClearModal = false">
        <div class="modal-card">
            <p class="modal-mark" aria-hidden="true">◇ 清 ◆ 空 ◇</p>
            <h3 class="modal-title">当真挥毫作罢？</h3>
            <p class="modal-desc">将把全部 <b>{{ likeTookStore.likeList.length }}</b> 条名言一并抹去，不复留存。</p>
            <div class="modal-actions">
                <button class="modal-btn ghost" @click="showClearModal = false">留住</button>
                <button class="modal-btn solid" @click="doClear">清空</button>
            </div>
        </div>
    </div>

    <!-- 轻量提示 toast -->
    <Transition name="toast">
        <div v-if="toast" class="toast">{{ toast }}</div>
    </Transition>
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

    // 轻量 toast 提示
    const toast = ref('')
    let toastTimer: ReturnType<typeof setTimeout> | null = null
    function showToast(msg: string) {
        toast.value = msg
        if (toastTimer) clearTimeout(toastTimer)
        toastTimer = setTimeout(() => (toast.value = ''), 1800)
    }

    function getLoveTalk() {
        likeTookStore.getATalk()
        if (likeTookStore.errorMsg === '') showToast('已采撷一句')
    }

    function onFav(item: TalkItem) {
        likeTookStore.toggleFav(item.id)
        showToast(item.fav ? '已收藏 ♥' : '已取消收藏')
    }

    function onRemove(item: TalkItem) {
        likeTookStore.removeOne(item.id)
        showToast('已删除')
    }

    async function copy(item: TalkItem) {
        try {
            await navigator.clipboard.writeText(item.title + ' —— ' + item.author)
            showToast('已复制')
        } catch {
            showToast('复制失败')
        }
    }

    // 定制确认弹窗
    const showClearModal = ref(false)
    function onClear() {
        showClearModal.value = true
    }
    function doClear() {
        likeTookStore.clearAll()
        showClearModal.value = false
        showToast('已清空')
    }
</script>
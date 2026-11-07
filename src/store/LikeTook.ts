import {reactive, ref} from 'vue'
import {defineStore} from 'pinia'
import axios from 'axios'
import {nanoid} from 'nanoid'

// 统一持久化键名，保证 读 与 写 一致
export const LIKE_KEY = 'likeTalkList'

export interface TalkItem {
    id: string
    title: string
    author: string // 作者/出处
    fav: boolean // 是否收藏
}

// 启动时安全地从 localStorage 读取，损坏或非法时回退空数组
function loadTalkList(): TalkItem[] {
    try {
        const raw = localStorage.getItem(LIKE_KEY)
        if (!raw) return []
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed)
            ? parsed.map((it: Partial<TalkItem>) => ({
                id: String(it.id ?? ''),
                title: String(it.title ?? ''),
                author: String(it.author ?? '') || '佚名',
                fav: Boolean(it.fav),
            }))
            : []
    } catch {
        return []
    }
}

export const useLikeTook = defineStore('talk', () => {

    const likeList = reactive<TalkItem[]>(loadTalkList())
    const isLoading = ref(false)
    const errorMsg = ref('')

    async function getATalk() {
        if (isLoading.value) return
        isLoading.value = true
        errorMsg.value = ''
        let id = nanoid()
        try {
            const {data} = await axios.get('https://v1.hitokoto.cn/?encode=json&charset=utf-8')
            const title = data?.hitokoto?.trim()
            if (!title) throw new Error('没有获取到内容')
            // 组合作者/出处：优先 from_who，其次 from
            const author = [data?.from_who, data?.from].filter(Boolean).join(' · ') || '佚名'
            likeList.unshift({id, title, author, fav: false})
        } catch (error: any) {
            console.warn('获取失败', error)
            errorMsg.value = '获取失败：' + (error?.message || '未知错误') + '，请稍后再试'
        } finally {
            isLoading.value = false
        }
    }

    // 切换收藏状态
    function toggleFav(id: string) {
        const item = likeList.find(i => i.id === id)
        if (item) item.fav = !item.fav
    }

    // 删除单条
    function removeOne(id: string) {
        const idx = likeList.findIndex(i => i.id === id)
        if (idx !== -1) likeList.splice(idx, 1)
    }

    // 一键清空
    function clearAll() {
        likeList.splice(0)
    }

    return {likeList, getATalk, isLoading, errorMsg, toggleFav, removeOne, clearAll}

})
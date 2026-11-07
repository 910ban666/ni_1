import {reactive, ref} from 'vue'
import {defineStore} from 'pinia'
import axios from 'axios'
import {nanoid} from 'nanoid'

// 统一持久化键名，保证 读 与 写 一致
export const LIKE_KEY = 'likeTalkList'

interface TalkItem {
    id: string
    title: string
}

// 启动时安全地从 localStorage 读取，损坏或非法时回退空数组
function loadTalkList(): TalkItem[] {
    try {
        const raw = localStorage.getItem(LIKE_KEY)
        if (!raw) return []
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed : []
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
            likeList.unshift({id, title})
        } catch (error: any) {
            console.warn('获取失败', error)
            errorMsg.value = '获取失败：' + (error?.message || '未知错误') + '，请稍后再试'
        } finally {
            isLoading.value = false
        }
    }

    return {likeList, getATalk, isLoading, errorMsg}

})
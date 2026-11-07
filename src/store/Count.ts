import { defineStore } from 'pinia'


export const useCountStore = defineStore('Count', {
    // 动作方法，用于响应组件中的‘动作’
    actions: {
        increment(value: number) {
            this.sum += value
        }
    },
    state() {
        return {
            sum: 1,
            choose: 1,
            school: '贵州省·歪比巴布·二中',
            address: '中国'
        }
    },
    getters: {
        toBigSum(state) {
            return state.sum * 100
        },

        upperSchool(state): string {
            return state.school.toUpperCase()
        }
    }
})
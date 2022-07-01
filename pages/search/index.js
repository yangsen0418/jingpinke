import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import History from "@/p_search/History"
import Suggest from '@/p_search/Suggest'
import Result from '@/p_search/Result'
import Input from "@/p_search/Input"
import { getSearchResult, getSearchSuggest, getHotWord } from 'core/api'

//history
//suggest
//result
const TYPES = {
    HISTORY: 'history',
    SUGGEST: 'suggest',
    RESULT: 'result',
}

export default function Search({ kw }) {
    const router = useRouter()
    //内容类型
    const [contType, setContType] = useState(kw ? TYPES.RESULT : TYPES.HISTORY)
    const [inputVal, setInputVal] = useState(kw || '')
    const [suggestList, setSuggestList] = useState([]) // 推荐数据

    //切换到搜索结果
    const submitSearch = (keyword = '') => {
        //切换为结果类型
        setContType(TYPES.RESULT)
        //替换路由参数
        router.replace({
            pathname:'/search',
            query:{
                kw:keyword,
            },
        })
    }

    //搜索建议
    const fetchSuggest = async (kw = '') => {
        try {
            //切换内容类型为搜索建议
            if (contType !== TYPES.SUGGEST) setContType(TYPES.SUGGEST)
            //请求数据
            const res = await getSearchSuggest(kw)
            setSuggestList(res)
        } catch (error) {
            console.error('error', error)
        }

        //更新State
    }

    const showHistory = () => setContType(TYPES.HISTORY)

    //渲染内容
    const renderContent = () => {
        switch (contType) {
            case TYPES.HISTORY:
                return <History submitSearch={submitSearch}/>
            case TYPES.SUGGEST:
                return <Suggest data={suggestList}  submitSearch={submitSearch}/>
            case TYPES.RESULT:
                return <Result />
        }
    }


    return (
        <div >
            {/* 搜索框 */}
            <Input
                inputVal={inputVal}
                setInputVal={setInputVal}
                fetchSuggest={fetchSuggest}
                showHistory={showHistory}
                submitSearch={submitSearch}
            />
            {/* 内容区 */}
            {renderContent()}
        </div>

    )
}

export async function getServerSideProps(context) {
    const { query } = context
    const { kw = '' } = query
    let hotWord = []
    let result = []
    if (kw && kw.trim()) {
        // 热门词汇 & 搜索结果
        const [resultRes, hotWordRes] = await Promise.allSettled([
            getSearchResult(kw.trim()),
            getHotWord(),
        ])
        hotWord = hotWordRes.value
        result = resultRes.value
    } else {
        // 热门词汇
        hotWord = await getHotWord()
    }

    return {
        props: {
            hotWord: hotWord || [],// 热门词汇
            result: result || [],//搜索结果
            kw, // 搜索关键字
        }
    }
}
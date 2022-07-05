import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/router"
import throttle from "lodash.throttle"
import History from "@/p_search/History"
import Suggest from '@/p_search/Suggest'
import Result from '@/p_search/Result'
import Input from "@/p_search/Input"
import useLSState from 'core/hooks/useLSState'
import { getSearchResult, getSearchSuggest, getHotWord } from 'core/api'
import s from './search.module.css'


//history
//suggest
//result
const TYPES = {
    HISTORY: 'history',
    SUGGEST: 'suggest',
    RESULT: 'result',
}

export default function Search({ kw, hotWord, result }) {
    const router = useRouter()
    //内容类型
    const [contType, setContType] = useState(kw ? TYPES.RESULT : TYPES.HISTORY)
    const [loading, setLoading] = useState(false) // 加载中
    const [inputVal, setInputVal] = useState(kw || '')
    const [suggestList, setSuggestList] = useState([]) // 推荐数据
    const [history, setHistory] = useLSState('searchHistory', kw ? [kw] : [])


    //切换到搜索结果
    const submitSearch = (kw = '') => {
        // 保存去重搜索记录, 最长保持6条，最近优先
        history.unshift(kw)
        setHistory([...new Set(history.slice(0, 6))])
        //切换为结果类型
        setContType(TYPES.RESULT)
        // 加载中
        setLoading(true)
        //替换路由参数
        setInputVal(kw)
        router.replace({
            path: '/search',
            query: {
                kw,
            },
        })
    }

    //搜索建议
    const fetchSuggest = useMemo(
        () =>
            throttle(async (kw = '') => {
                try {
                    console.log('suggest', kw);
                    //切换内容类型为搜索建议
                    if (contType !== TYPES.SUGGEST) setContType(TYPES.SUGGEST)
                    //请求数据
                    const res = await getSearchSuggest(kw)
                    setSuggestList(res)
                } catch (error) {
                    console.error('error', error)
                }
                //更新State
            }, 300),
        [contType, setContType, setSuggestList],
    )

    const showHistory = () => setContType(TYPES.HISTORY)

    //渲染内容
    const renderContent = () => {
        if (loading) return <div className={s.loading}>加载中......</div>
        switch (contType) {
            case TYPES.HISTORY:
                return <History submitSearch={submitSearch} hotWord={hotWord} history={history} deleteHistory={() => setHistory([])} />
            case TYPES.SUGGEST:
                return <Suggest data={suggestList} submitSearch={submitSearch} />
            case TYPES.RESULT:
                return <Result data={result} kw={kw} />
            default:
                break
        }
    }


    // result数据加载结束清空loading状态
    useEffect(() => {
        setLoading(false)
    }, [result])


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
            <div className={s.content}>{renderContent()}</div>
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
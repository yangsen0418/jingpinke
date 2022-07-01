import { useRef } from "react"

export default function Input({ inputVal, setInputVal, fetchSuggest, showHistory, submitSearch }) {
    const inputEL = useRef(null)
    //键盘  输入框回车确认搜索(不触发onchange)
    const handleKeyUp = (e) => {
        if (e.keyCode !== 13 || !inputEL?.current) return
        const filteredVal = inputEL.current.value.trim()
        if (!filteredVal) {
            setInputVal('')
            return
        }
        //回车提交
        submitSearch(filteredVal)
        //收起键盘
        inputEL.current.blur()
    }
    //值改变
    const handleChange = (e) => {
        const SearchVal = e.target.value
        const trimVal = SearchVal.trim()
        setInputVal(e.target.value)
        if (!trimVal) {
            //字符为空展示历史
            showHistory()
            //切换搜索历史
            return
        }
        //字符非空搜索建议
        if (trimVal !== inputVal) {
            fetchSuggest(trimVal)
        }
    }
    return <input ref={inputEL} value={inputVal} onChange={handleChange} onKeyUp={handleKeyUp} />
}
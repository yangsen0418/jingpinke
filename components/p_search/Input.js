import { useRef } from "react"
import s from './Input.module.css'

export default function Input({
    inputVal,
    setInputVal,
    fetchSuggest,
    showHistory,
    submitSearch
}) {
    const inputEL = useRef(null)
    //键盘  输入框回车确认搜索(不触发onchange)
    const handleKeyUp = (e) => {
        if (e.keyCode !== 13 || !inputEL?.current) return
        const event = e || window.event
        event.preventDefault()
        fetchSuggest.cancel() // 取消等待的搜索建议请求
        const filteredVal = inputEL.current.value.trim()
        if (!filteredVal) {
            setInputVal('')
            return false
        }
        //回车提交
        submitSearch(filteredVal)
        //收起键盘
        inputEL.current.blur()
        return false // 禁止按回车表单自动提交
    }
    //值改变
    const handleChange = (e) => {
        const SearchVal = e.target.value
        setInputVal(SearchVal)
        const trimVal = SearchVal.trim()
        if (!trimVal) {
            fetchSuggest.cancel() // 取消等待的搜索建议请求
            //字符为空展示历史
            showHistory()
            //切换搜索历史
            return false
        }
        //字符非空搜索建议
        if (trimVal !== inputVal) {
            fetchSuggest(trimVal)
        }
    }

    const clearInput = () => {
        fetchSuggest.cancel() // 取消等待的搜索建议请求
        showHistory()
        setInputVal('')
        inputEL.current.focus()
    }

    return (
        <div className={s.container}>
            <div className={`${s.formCont} border-b-1px ${inputVal ? '' : s.empty}`}>
                {/* 让软键盘显示搜索按钮 */}
                <form action="" >
                    <input
                        ref={inputEL}
                        type="search"
                        className={s.search}
                        placeholder={' 输入搜索内容'}
                        value={inputVal}
                        onChange={handleChange}
                        onKeyUp={handleKeyUp}
                        onClick={() => {
                            inputEL.current.focus()
                        }}
                    />
                    {/* 禁止按回车表单自动提交：如果表单中含有多个单行输入框，按Enter键时不会自动提交 */}
                    <input type="text" name="notautosubmit" style={{ display: 'none' }} />
                </form >
                {/* 当输入框不为空的时候展示自定义清空按钮*/}
                {inputVal ? <button onClick={clearInput} className={s.clean} /> : null}
            </div>
        </div>
    )
}
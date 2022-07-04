import Link from "next/link"
import s from './History.module.css'

export default function History({ hotWord = [], submitSearch, history = [], deleteHistory }) {
    const renderHotItem = (item, idx) => {
        const text = item.title.slice(0, 6)
        if (item.type === 2) {
            return (
                <Link
                    key={`hot-item-${idx}`}
                    href="/course/detail/[id]"
                    as={`/course/detail/${item.id}`}>
                    <a className={s.item}>{text}</a>
                </Link>
            )
        }
        return (
            <span key={`hot-item-${idx}`} className={s.item} onClick={() => submitSearch(text)} >
                {text}
            </span >
        )
    }
    return (
        <>
            {/* 热门搜索 */}
            {hotWord && hotWord.length ? (
                <section className={s.container}>
                    <div className={s.hotHead}>热门搜索</div>
                    <div className={s.content}>{hotWord.slice(0, 6).map(renderHotItem)}</div>
                </section>
            ) : null}
            {/* 搜索历史 */}
            <section className={s.container}>
                <div className={`${s.historyHead}  border-b-1px`}>
                    <span>搜索历史</span>
                    <button
                        className={s.del}
                        onClick={() => {
                            document.activeElement.blur() // 想收起虚拟键盘吗？
                            if (history.length) {
                                deleteHistory()
                            }
                        }}>
                        <img className={s.clean} src="/img/clean.png" alt="" />
                    </button></div>
                <div className={s.content}>
                    {history
                        ? history.map((item, idx) => (
                            <div
                                className={`${s.list} border-b-1px`}
                                key={`history-item-${idx}`}
                                onClick={() => submitSearch(item)}>
                                {item}
                            </div>
                        ))
                        : null}
                </div>
            </section>
        </>
    )
}
import { useState, useEffect,useCallback } from "react"
//推荐课程list
import SectionHeader from "./SectionHeader"
import CourseCard from "@/Common/CourseCard"
import { getRecommend } from "core/api"
import s from './Recommend.module.css'
import LoadMore from "@/Common/LoadMore"

//每页数量
const OFFSET = 10

export default function Recommend() {
    const [recommend, setRecommend] = useState({
        list: [],
        pageStart: 0,
        hasMore: true,
    })

    const fetchRecommend = useCallback(async () => {
        try {
            const list = await getRecommend({
                start: recommend.pageStart,
                offset: OFFSET,
            })
            //保存数据
            setRecommend({
                list: recommend.list.concat(list),
                pageStart: recommend.pageStart + 1,
                hasMore: list.length === OFFSET,
            })
        } catch (error) {
            console.log('fetchRecommend Error', error)
        }
    }, [recommend])

    useEffect(() => {
        fetchRecommend()
    }, [])

    return (
        <section>
            <SectionHeader title="课程精选" subTitle="Course selection" />
            <div className={s.list}>
                {recommend.list.map((item) => (
                    <CourseCard key={item.id} data={item} />
                ))}
            </div>
            <LoadMore onReachBottom={fetchRecommend} hasMore={recommend.hasMore} />
        </section>
    )
}
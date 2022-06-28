import Link from 'next/link'
import ReactSlick from 'react-slick'
import s from './Nav.module.css'

const Nav = ({ data = [] }) => {
    const settings = {
        dots: true,
        rows:2,
        infinite: false,
        speed: 100,
        slidesToShow: 4,
        slidesToScroll: 3,
        initialSlide: 0,
    };

    return (
        <div className={s.nav}>
            <section className={s.wrap}>
                <ReactSlick {...settings}>
                    {data.map((item, index) => (
                        <div key={`${index}-${item.id}`}>
                            {/* 跳转链接 */}
                            <Link href="/course/detail/[id]" as={`course/detail/${item.id}`}>
                                {/* banner图片 */}
                                <img src={item.img} key={index} alt={item.title} className={s.slide} />
                            </Link>
                            <Link href="/course/detail/[id]" as={`course/detail/${item.id}`}>
                                <a className={s.fon}>{item.title}</a>
                            </Link>
                            
                        </div>
                    ))}
                </ReactSlick>
            </section>
        </div>
    )
}

export default Nav

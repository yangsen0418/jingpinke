export default function SectionHeader({ title = '', subTitle = '' }) {
    return (
        <header>
            <div>
                <h4>{title}</h4>
                <h5>{subTitle}</h5>
            </div>
            <a></a>
        </header>
    )
}
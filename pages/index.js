import Head from 'next/head'
import HomeHead from '@/p_home/HomeHead'
import Talk from '@/p_home/Talk'
import Recommend from '@/p_home/Recommend'
import { getHome } from 'core/api'

export default function Home({ home }) {
  const { banner ,fixedEntries } = home || {}
  return (
    <div>
      <Head>
        <title>精品课首页</title>
      </Head>
      <main>
        <HomeHead banner={banner} fixedEntries={fixedEntries}/>
        <Recommend />
        <Talk />
      </main>
    </div>
  )
}

export async function getServerSideProps() {
  //try catch
  const data = await getHome()
  return { props: { home: data } }
}
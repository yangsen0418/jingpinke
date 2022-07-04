import 'normalize.css'
import '../styles/globals.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Meta from '@/Common/Meta'

function MyApp({ Component, pageProps }) {
  <Meta />
  return <Component {...pageProps} />
}

export default MyApp

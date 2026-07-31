import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import BackToTop from '../components/common/BackToTop'

const MainLayout = () => {
  const location = useLocation()
  const hideFooter = ['/login', '/register'].includes(location.pathname)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
      <BackToTop />
    </div>
  )
}

export default MainLayout

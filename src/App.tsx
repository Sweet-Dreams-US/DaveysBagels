import { Outlet, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import ItemCustomizer from './components/ItemCustomizer'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Admin from './pages/Admin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOrders from './pages/admin/AdminOrders'
import AdminMenu from './pages/admin/AdminMenu'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminAccounting from './pages/admin/AdminAccounting'
import AdminEvents from './pages/admin/AdminEvents'
import AdminCustomers from './pages/admin/AdminCustomers'
import AdminSettings from './pages/admin/AdminSettings'

/**
 * Two layout routes:
 *   - StorefrontLayout: Nav + Footer + CartDrawer + ItemCustomizer (customer pages)
 *   - Admin: its own sidebar layout, no storefront chrome (back-office pages)
 */
export default function App() {
  return (
    <Routes>
      <Route element={<StorefrontLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
      </Route>

      <Route path="/admin" element={<Admin />}>
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="menu" element={<AdminMenu />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="accounting" element={<AdminAccounting />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  )
}

function StorefrontLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <ItemCustomizer />
    </div>
  )
}

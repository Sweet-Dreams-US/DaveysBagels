import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import ItemCustomizer from './components/ItemCustomizer'
import Home from './pages/Home'
import Menu from './pages/Menu'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      <ItemCustomizer />
    </div>
  )
}

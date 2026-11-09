import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { ForgotPassword, Login, RegisterSuccess, ResetPassword } from './pages/Auth'
import Register from './pages/Register'
import Block1Test from './pages/Block1Test'
import Block2Test from './pages/Block2Test'
import Block3Test from './pages/Block3Test'
import Intro from './pages/Intro'
import Landing from './pages/Landing'
import Loading from './pages/Loading'
import PersonalityTest from './pages/PersonalityTest'
import Results from './pages/Results'

/**
 * Flujo (Figma "Test web"):
 * Inicio → Login / Registro → Carga → Introducción → Test de personalidad (♥ x4)
 * → Bloque 1 (★ x4) → Bloque 2 (◆) → Bloque 3 (🏆) → Resultados
 */
export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/recuperar" element={<ForgotPassword />} />
          <Route path="/recuperar/nueva" element={<ResetPassword />} />
          <Route path="/registro-exitoso" element={<RegisterSuccess />} />
          <Route path="/cargando" element={<Loading />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/test/personalidad" element={<PersonalityTest />} />
          <Route path="/test/bloque-1" element={<Block1Test />} />
          <Route path="/test/bloque-2" element={<Block2Test />} />
          <Route path="/test/bloque-3" element={<Block3Test />} />
          <Route path="/resultados" element={<Results />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

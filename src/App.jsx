import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import Register from './components/Register'
import Login from './components/Login'
import Missing from './components/Missing.jsx'
import RequiredAuth from './components/RequiredAuth.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<Layout />} >
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Missing />} />
        <Route path="/hola" element={<h1>Hola</h1>} />
        <Route element={<RequiredAuth />}>
          <Route path="/home" element={<h1>Home</h1>} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App

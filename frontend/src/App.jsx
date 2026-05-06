import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuth } from './context/AuthContext'
// import WorkoutPlanModal from './pages/dashboard/WorkoutPlanModal'

// Layout components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Public pages
import Home from './pages/Home'
import About from './pages/About'
import Memberships from './pages/Memberships'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import RegisterOptions from './pages/auth/RegisterOptions'

// Protected pages
import Dashboard from './pages/dashboard/Dashboard'
import UserDashboard from './pages/dashboard/UserDashboard'
import TrainerDashboard from './pages/dashboard/TrainerDashboard'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import ProfileForm from './pages/user/ProfileForm'
import TrainerSelection from './pages/user/TrainerSelection'

// Admin pages
import UsersList from './pages/admin/UsersList'
import EditUser from './pages/admin/EditUser'

// Route guards
import ProtectedRoute from './components/routing/ProtectedRoute'
import RoleRoute from './components/routing/RoleRoute'


// import Page from './pages/page'
import Checkout from './pages/Checkout'
import ChatBot from './components/ChatBot'
function App() {
  const { user, loading } = useAuth()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!loading) {
      setIsInitialized(true)
    }
  }, [loading])

  if (!isInitialized) {
    return <div className="loading-container">Loading...</div>
  }

  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/memberships" element={<Memberships />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterOptions />} />
          <Route path="/register/:role" element={<Register />} />
          {/* <Route path="/page" element={<Page />} /> */}
          <Route path="/checkout" element={<Checkout />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* User Routes */}
          <Route path="/user/dashboard" element={
            <RoleRoute role="user">
              <UserDashboard />
            </RoleRoute>
          } />
          <Route path="/user/select-trainer" element={
            <RoleRoute role="user">
              <TrainerSelection />
            </RoleRoute>
          } />
          <Route path="/user/profile-form" element={
            <RoleRoute role="user">
              <ProfileForm />
            </RoleRoute>
          } />

          {/* Trainer Routes */}
          <Route path="/trainer/dashboard" element={
            <RoleRoute role="trainer">
              <TrainerDashboard />
              {/* <WorkoutPlanModal /> */}
            </RoleRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <RoleRoute role="admin">
              <AdminDashboard />
            </RoleRoute>
          } />
          <Route path="/admin/users" element={
            <RoleRoute role="admin">
              <UsersList />
            </RoleRoute>
          } />
          <Route path="/admin/users/:id/edit" element={
            <RoleRoute role="admin">
              <EditUser />
            </RoleRoute>
          } />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <ChatBot />
      <ToastContainer position="bottom-right" />
    </>
  )
}

export default App
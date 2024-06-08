import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ProjectList from './pages/ProjectList'
import MainLayout from './components/layout/MainLayout'
import AppLayout from './components/layout/AppLayout'
import LoginPage from './pages/LoginPage'
import ProjectDetail from './pages/ProjectDetail'
import Auth from './hooks/auth'
import Profile from './pages/Profile'
import ManagePlant from './pages/ManagePlant'
import PlantDetail from './pages/PlantDetail'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import OtherInfo from './pages/OtherInfo'
import ResetPasswordPage from './pages/ResetPasswordPage'
import Notfound from './pages/Notfound'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/home" />} />
          <Route element={<LoginPage />} path="/login" />
          <Route element={<ForgotPasswordPage />} path="/forgot-password" />
          <Route element={<ResetPasswordPage />} path="/reset-password/:resetText/:text" />
        </Route>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Auth path={'/login'}>{<ProjectList />}</Auth>} path="home" />
          <Route element={<Auth path={'/login'}>{<Profile />}</Auth>} path="profile" />
          <Route element={<Auth path={'/login'}>{<ManagePlant />}</Auth>} path="manage-plant" />
          <Route element={<Auth path={'/login'}>{<ProjectDetail />}</Auth>} path="project/:id" />
          <Route element={<Auth path={'/login'}>{<PlantDetail />}</Auth>} path="plant/:id" />
          <Route element={<Auth path={'/login'}>{<OtherInfo />}</Auth>} path="other-information" />
        </Route>
        <Route path="*" element={<Notfound />} />
      </Routes>
    </div>
  )
}

export default App

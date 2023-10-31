import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CreateProject from './pages/CreateProject';
import ProjectList from './pages/ProjectList';
import MainLayout from './components/layout/MainLayout'
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import ProjectDetail from './pages/ProjectDetail';

const App = () => {
  return (
    <div>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<LoginPage />} path="login" />
        </Route>
        <Route element={<MainLayout />}>
          <Route index element={<ProjectList />} path="home" />
          <Route element={<CreateProject />} path="create-project" />
          <Route element={<ProjectDetail />} path="project" />
        </Route>
      </Routes>
    </div>
  )
}

export default App

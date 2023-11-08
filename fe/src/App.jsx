import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CreateProject from './pages/CreateProject';
import ProjectList from './pages/ProjectList';
import MainLayout from './components/layout/MainLayout'
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import ProjectDetail from './pages/ProjectDetail';
import Auth from './hooks/auth';
import Profile from './pages/Profile';
import ManagePlant from './pages/ManagePlant';

const App = () => {
  return (
    <div>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<LoginPage />} path="/login" />
        </Route>
        <Route element={<MainLayout />}>
          <Route index element={<Auth path={"login"}>{<ProjectList />}</Auth>} path="home" />
          <Route index element={<Auth path={"login"}>{<Profile />}</Auth>} path="profile" />
          <Route index element={<Auth path={"login"}>{<ManagePlant />}</Auth>} path="manage-plant" />
          <Route element={<Auth path={"/login"}>{<CreateProject />}</Auth>} path="create-project" />
          <Route element={<Auth path={"/login"}>{<ProjectDetail />}</Auth>} path="project/:id" />
        </Route>
      </Routes>
    </div>
  )
}

export default App

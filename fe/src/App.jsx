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
import PlantDetail from './pages/PlantDetail';
import ManageTemplate from './pages/ManageTemplate';
import ManageRequest from './pages/ManageRequest';
import ManageGarden from './pages/ManageGarden';
import GardenProjectDetail from './pages/GardenProjectDetail';

const App = () => {
  return (
    <div>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<LoginPage />} path="/login" />
        </Route>
        <Route element={<MainLayout />}>
          <Route index element={<div path={"login"}>{<ProjectList />}</div>} path="home" />
          <Route index element={<div path={"login"}>{<Profile />}</div>} path="profile" />
          <Route index element={<div path={"login"}>{<ManagePlant />}</div>} path="manage-plant" />
          <Route index element={<div path={"login"}>{<ManageTemplate />}</div>} path="manage-template" />
          <Route index element={<div path={"login"}>{<ManageRequest />}</div>} path="manage-request" />
          <Route index element={<div path={"login"}>{<ManageGarden />}</div>} path="manage-planting-garden" />
          <Route element={<div path={"/login"}>{<GardenProjectDetail />}</div>} path="manage-planting-garden/:id" />
          <Route element={<div path={"/login"}>{<CreateProject />}</div>} path="create-project" />
          <Route element={<div path={"/login"}>{<ProjectDetail />}</div>} path="project/:id" />
          <Route element={<div path={"/login"}>{<PlantDetail />}</div>} path="plant/:id" />
        </Route>
      </Routes>
    </div>
  )
}

export default App

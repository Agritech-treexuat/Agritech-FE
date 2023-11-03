// src/components/ProjectList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectItem from '../../components/ProjectItem';
import useProjectList from './useProjectList';
import './style.css';
import FARM from '../../services/farmService';
import parseData from './helper'

const ProjectList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState([])
  const farmId = localStorage.getItem('id')
  useEffect(() => {
    async function fetchData() {
      const data = await FARM.getProjects(farmId)
      console.log("Data: ", data.data)

      setProjects(parseData(data.data).projects)
      console.log("Projects: ", projects)
    }
    fetchData();
  }, []);

  const filteredProjects = projects.length != 0 ? projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <div>
      <h1>Project List</h1>
      <input
        type="text"
        placeholder="Search projects"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Link to="/create-project">
        <button>Create New</button>
      </Link>
      <div className="project-grid">
        {filteredProjects.map((project) => (
          <Link to={`/project/${project.id}`} key={project.id}>
            <ProjectItem project={project} />
          </Link>
        ))}
      </div>

    </div>
  );
};

export default ProjectList;

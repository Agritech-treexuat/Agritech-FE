// src/components/ProjectList.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectItem from '../../components/ProjectItem';
import './style.css';

const ProjectList = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock project data
  const projects = [
    {
      id: 1,
      title: 'Project 1',
      seed: 'Seed A',
      startDate: '2023-10-01',
      image: 'project1.jpg',
    },
    {
      id: 2,
      title: 'Project 2',
      seed: 'Seed B',
      startDate: '2023-10-05',
      image: 'project2.jpg',
    },
    // Add more project data here
  ];

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <ProjectItem key={project.id} project={project} />
        ))}
      </div>

    </div>
  );
};

export default ProjectList;

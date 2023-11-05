// src/components/ProjectItem.js
import React from 'react';
import { Link } from 'react-router-dom';
import './style.css'; // Tạo một tệp CSS riêng cho component này

const ProjectItem = ({ project }) => {
  return (
    <div className="project-item">
      <img src={project.image} alt={project.title} style={{width: '100%', height: '200px'}}/>
      <h2>{project.title}</h2>
      <p className="bold-text">Seed: {project.seed}</p>
      <p>Start Date: {project.startDate}</p>
    </div>
  );
};

export default ProjectItem;

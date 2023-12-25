import React from 'react'
import './style.css'
import { formatDate } from '../../services/dateService'

const ProjectItem = ({ project }) => {
  return (
    <div className="project-item">
      <img src={project.image} alt={project.title} style={{ width: '100%', height: '200px' }} />
      <h2>{project.title}</h2>
      <p className="bold-text">Hạt giống: {project.seed}</p>
      <p>Ngày bắt đầu: {formatDate(new Date(project.startDate))}</p>
    </div>
  )
}

export default ProjectItem

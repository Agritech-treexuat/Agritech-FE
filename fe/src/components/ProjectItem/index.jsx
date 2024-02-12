import React from 'react'
import './style.css'
import { formatDate } from '../../utils/helpers'
import { Card } from 'antd'
const { Meta } = Card

const ProjectItem = ({ project }) => {
  return (
    <Card hoverable cover={<img alt={project.title} src={project.image} />} style={{ width: '90%' , margin: '1.5rem'}}>
      <Meta align={'center'} style={{ fontStyle: 'italic' }} title={project.title} />
      <div style={{ textAlign: 'left' }}>
        <p>Hạt giống: {project.seed}</p>
        <p>Ngày bắt đầu: {formatDate(new Date(project.startDate))}</p>
        <p>Mo ta: {project.description}</p>
      </div>
    </Card>
  )
}

export default ProjectItem

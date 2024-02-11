import React from 'react'
import { Tabs } from 'antd'
import { ProjectOutput, ProjectProcess, ProjectInput, ProjectExpect } from '../../components'
import ProjectFarming from '../../components/ProjectDetail/ProjectPlantFarming'
import ProcessActivityPage from '../../components/ProjectDetail/ProjectProcessActivity'
import { useParams } from 'react-router-dom'

const ProjectDetail = () => {
  const projectId = useParams().id
  const items = [
    {
      key: '1',
      label: 'Đầu vào',
      children: <ProjectInput />
    },
    {
      key: '2',
      label: 'Quy trình canh tác',
      children: <ProjectFarming projectId={projectId} />
    },
    {
      key: '3',
      label: 'Quá trình canh tác',
      children: <ProcessActivityPage projectId={projectId} />
    },
    {
      key: '4',
      label: 'Dự kiến',
      children: <ProjectExpect />
    },
    {
      key: '5',
      label: 'Đầu ra',
      children: <ProjectOutput />
    }
  ]
  return <Tabs defaultActiveKey="1" items={items} />
}
export default ProjectDetail

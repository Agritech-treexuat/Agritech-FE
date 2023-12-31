import React from 'react'
import { Tabs } from 'antd'
import { ProjectOutput, ProjectProcess, ProjectInput, ProjectExpect, ProjectTemplate } from '../../components'

const ProjectDetail = () => {
  const items = [
    {
      key: '1',
      label: 'Đầu vào',
      children: <ProjectInput />
    },
    {
      key: '2',
      label: 'Quy trình canh tác',
      children: <ProjectTemplate />
    },
    {
      key: '3',
      label: 'Quá trình canh tác',
      children: <ProjectProcess />
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

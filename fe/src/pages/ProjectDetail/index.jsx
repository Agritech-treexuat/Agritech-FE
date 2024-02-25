import React from 'react'
import { Tabs } from 'antd'
import { ProjectOutput, ProjectInput, ProjectExpect } from '../../components'
import ProjectFarming from '../../components/ProjectDetail/ProjectPlantFarming'
import ProcessActivityPage from '../../components/ProjectDetail/ProjectProcessActivity'
import { useParams } from 'react-router-dom'
import useProjectPlantFarming from '../../components/ProjectDetail/ProjectPlantFarming/useProjectPlantFarming'
import ProjectOtherInfo from '../../components/ProjectDetail/ProjectOtherInfo'

const ProjectDetail = () => {
  const projectId = useParams().id
  const { plantFarming, isSuccessPlantFarming } = useProjectPlantFarming({ projectId })
  const items = [
    {
      key: '1',
      label: 'Thông tin chung',
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
      children: <ProcessActivityPage projectId={projectId} />,
      disabled: plantFarming ? false : true
    },
    {
      key: '4',
      label: 'Thông tin khác',
      children: <ProjectOtherInfo />
    },
    {
      key: '5',
      label: 'Dự kiến',
      children: <ProjectExpect />,
      disabled: plantFarming ? false : true
    },
    {
      key: '6',
      label: 'Đầu ra',
      children: <ProjectOutput />,
      disabled: plantFarming ? false : true
    }
  ]
  return <Tabs defaultActiveKey="1" items={items} />
}
export default ProjectDetail

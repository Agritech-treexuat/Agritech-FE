import React from 'react';
import { Tabs } from 'antd';
import { useParams } from 'react-router-dom';
import {ProjectOutput, ProjectProcess, ProjectInput, ProjectExpect, ProjectTemplate} from '../../components';
const onChange = (key) => {
  console.log(key);
};

const ProjectDetail = () => {
  const { id } = useParams()
  console.log("id: ", id)

  const items = [
    {
      key: '1',
      label: 'Đầu vào',
      children: <ProjectInput />,
    },
    {
      key: '2',
      label: 'Template',
      children: <ProjectTemplate />,
    },
    {
      key: '3',
      label: 'Quá trình canh tác',
      children: <ProjectProcess />,
    },
    {
      key: '4',
      label: 'Dự kiến',
      children: <ProjectExpect />,
    },
    {
      key: '5',
      label: 'Đầu ra',
      children: <ProjectOutput />,
    },
  ];
  return (
    <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
  );
}
export default ProjectDetail;

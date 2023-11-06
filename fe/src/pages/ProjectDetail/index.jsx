import React from 'react';
import { Tabs } from 'antd';
import { useParams } from 'react-router-dom';
import {ProjectOutput, ProjectProcess, ProjectInput} from '../../components';
const onChange = (key) => {
  console.log(key);
};

const ProjectDetail = () => {
  const { id } = useParams()
  console.log("id: ", id)

  const items = [
    {
      key: '1',
      label: 'Tab 1',
      children: <ProjectInput />,
    },
    {
      key: '2',
      label: 'Tab 2',
      children: <ProjectProcess />,
    },
    {
      key: '3',
      label: 'Tab 3',
      children: <ProjectOutput />,
    },
  ];
  return (
    <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
  );
}
export default ProjectDetail;

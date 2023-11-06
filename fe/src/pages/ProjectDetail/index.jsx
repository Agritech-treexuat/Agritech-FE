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
      label: 'Đầu vào',
      children: <ProjectInput />,
    },
    {
      key: '2',
      label: 'Quá trình canh tác',
      children: <ProjectProcess />,
    },
    {
      key: '3',
      label: 'Đầu ra',
      children: <ProjectOutput />,
    },
  ];
  return (
    <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
  );
}
export default ProjectDetail;

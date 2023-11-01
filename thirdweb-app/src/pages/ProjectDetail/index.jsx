import React from 'react';
import { Tabs } from 'antd';
import { useParams } from 'react-router-dom';
import ProjectInput from '../../components/ProjectInput';
import ProjectProcess from '../../components/ProjectProcess';
import ProjectOutput from '../../components/ProjectOutput';
const onChange = (key) => {
  console.log(key);
};

const ProjectDetail = () => {
  const { id } = useParams()
  console.log("id: ", id)
  const project = {
    startDate: '2023-11-15',
    selectedSeed: 'Seed C',
    amount: 5000,
    image: 'project3.jpg',
    expected: 100000,
  };

  const items = [
    {
      key: '1',
      label: 'Tab 1',
      children: <ProjectInput
      startDate={project.startDate}
      selectedSeed={project.selectedSeed}
      amount={project.amount}
      image={project.image}
      expected={project.expected}
    />,
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

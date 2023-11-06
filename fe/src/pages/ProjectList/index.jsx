// src/components/ProjectList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectItem from '../../components/ProjectItem';
import useProjectList from './useProjectList';
import './style.css';
import FARM from '../../services/farmService';
import parseData from './helper'
import Loading from '../Loading'
import { Input } from 'antd';
import { Col, Row } from 'antd';
import { Button, Flex } from 'antd';




const ProjectList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState([])
  const farmId = localStorage.getItem('id')
  useEffect(() => {
    async function fetchData() {
      const data = await FARM.getProjects(farmId)
      console.log("Data: ", parseData(data.data))

      setProjects(parseData(data.data).projects)
      console.log("Projects: ", projects)
    }
    fetchData();
  }, []);

  const filteredProjects = projects.length != 0 ? projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <div>
      {projects ?
      (<div>
        <h1>Project List</h1>
        <Row>
          <Col span={8}>
          <Input placeholder="Search projects" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
          </Col>
          <Col span={1}></Col>
          <Col span={6}>
            <Link to="/create-project">
              <Flex gap="small" wrap="wrap">
                <Button style={{marginRight: "6px"}} type="primary">Create New</Button>
              </Flex>
            </Link>
        </Col>
        </Row>
        <Row className="project-grid">
          {filteredProjects.map((project) => (
            <Col span={4}>
            <Link to={`/project/${project.id}`} key={project.id}>
              <ProjectItem project={project} />
            </Link>
            </Col>
          ))}
        </Row>
    </div>) : <Loading />
      }
    </div>
  );
};

export default ProjectList;

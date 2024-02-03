// src/components/ProjectList.js
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ProjectItem from '../../components/ProjectItem'
import './style.css'
import Loading from '../Loading'
import useProjectList from './useProjectList'
import { Input, Button, Flex, Row, Col } from 'antd'
import PlantModal from '../../components/ProjectDetail/AddProject/AddProjectPlant'
import SeedModal from '../../components/ProjectDetail/AddProject/AddProjectSeed'
import PROJECT from '../../services/projectService'

const ProjectList = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlant, setSelectedPlant] = useState(null)
  const [selectedSeed, setSelectedSeed] = useState(null)
  const { projects, isSuccess, refetch, allPlantsInFarm, isSuccessAllPlantsInFarm, allSeedFromPlant } = useProjectList({
    plantId: selectedPlant?.id
  })
  const [open, setOpen] = useState(false)
  const [openSeed, setOpenSeed] = useState(false)

  const filteredProjects =
    projects.length > 0
      ? projects.filter((project) => {
          return project.title.toLowerCase().includes(searchQuery.toLowerCase())
        })
      : []

  const handleAddPlant = (plant) => {
    setSelectedPlant(plant)
    console.log(plant)
    setOpen(false)
    console.log('allSeedFromPlant', allSeedFromPlant)
    setOpenSeed(true)
  }

  const handleAddSeed = () => {
    // Thực hiện các thao tác khác khi thêm seed
    if (selectedSeed) {
      console.log(selectedSeed)
      // Do something with the selected seed
    }
    handleAddProject()
  }

  const handleAddProject = async () => {
    // Thực hiện các thao tác khác khi thêm project
    console.log('plantId', selectedPlant.id)
    console.log('seedId', selectedSeed.id)
    try {
      const data = {
        plantId: selectedPlant.id,
        seedId: selectedSeed.id,
        startDate: new Date()
      }
      await PROJECT.initProject(data)
      refetch()
    } catch (error) {
      console.log(error)
    }
    setOpenSeed(false)
  }

  return (
    <div>
      {isSuccess && isSuccessAllPlantsInFarm ? (
        <div>
          <h1>Danh sách các dự án</h1>
          <Row>
            <Col span={8}>
              <Input
                placeholder="Search projects"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Col>
            <Col span={1}></Col>
            <Col span={6}>
              <Flex gap="small" wrap="wrap">
                <Button type="primary" onClick={() => setOpen(true)}>
                  Tạp project mới
                </Button>
              </Flex>
              <PlantModal
                allPlantsInFarm={allPlantsInFarm}
                open={open}
                onClose={() => setOpen(false)}
                selectedPlant={selectedPlant}
                setSelectedPlant={setSelectedPlant}
                handleAddPlant={handleAddPlant}
              />
              <SeedModal
                seeds={allSeedFromPlant}
                open={openSeed}
                onClose={() => setOpenSeed(false)}
                selectedSeed={selectedSeed}
                setSelectedSeed={setSelectedSeed}
                handleAddSeed={handleAddSeed}
              />
            </Col>
          </Row>
          <Row className="project-grid">
            {filteredProjects.map((project) => (
              <Col span={4} key={project.id}>
                <Link to={`/project/${project.id}`} key={project.id}>
                  <ProjectItem project={project} />
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default ProjectList

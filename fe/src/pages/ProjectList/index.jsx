import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ProjectItem from '../../components/ProjectItem'
import Loading from '../Loading'
import useProjectList from './useProjectList'
import { Input, Button, Flex, Row, Col } from 'antd'
import PlantModal from '../../components/ProjectDetail/AddProject/AddProjectPlant'
import SeedModal from '../../components/ProjectDetail/AddProject/AddProjectSeed'
import LargeDescriptionModal from '../../components/ProjectDetail/AddProject/AddLargeDescription'
import PROJECT from '../../services/projectService'

const ProjectList = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlant, setSelectedPlant] = useState(null)
  const [selectedSeed, setSelectedSeed] = useState(null)
  const [description, setDescription] = useState('')
  const [isAddSeed, setIsAddSeed] = useState(false)
  const { projects, isSuccess, refetch } = useProjectList({
    plantId: selectedPlant?.id
  })
  const [open, setOpen] = useState(false)
  const [openSeed, setOpenSeed] = useState(false)
  const [openDescription, setOpenDescription] = useState(false)

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
    setIsAddSeed(true)
    setOpenSeed(true)
  }

  const handleAddSeed = () => {
    // Thực hiện các thao tác khác khi thêm seed
    if (selectedSeed) {
      console.log(selectedSeed)
      // Do something with the selected seed
    }
    setIsAddSeed(false)
    setOpenSeed(false)
    setOpenDescription(true)
    // handleAddProject()
  }

  const handleSubmit = () => {
  console.log(selectedSeed);
  console.log(selectedPlant);
  console.log(description);
  handleAddProject()
  setOpenDescription(false)
  }

  const handleAddProject = async () => {
    // Thực hiện các thao tác khác khi thêm project
    try {
      const data = {
        plantId: selectedPlant.id,
        seedId: selectedSeed.id,
        startDate: new Date(),
        description: description
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
      {isSuccess ? (
        <div>
          <h1>Danh sách các dự án</h1>
          <Row>
            <Col span={8}>
              <Input
                placeholder="Tìm kiếm các dự án"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Col>
            <Col span={1}></Col>
            <Col span={6}>
              <Flex gap="small" wrap="wrap">
                <Button type="primary" onClick={() => setOpen(true)}>
                  Tạo project mới
                </Button>
              </Flex>
              <PlantModal
                open={open}
                onClose={() => {
                  setOpen(false)
                  setIsAddSeed(false)
                }}
                selectedPlant={selectedPlant}
                setSelectedPlant={setSelectedPlant}
                handleAddPlant={handleAddPlant}
              />
              <SeedModal
                selectedPlant={selectedPlant}
                open={openSeed}
                onClose={() => setOpenSeed(false)}
                selectedSeed={selectedSeed}
                setSelectedSeed={setSelectedSeed}
                handleAddSeed={handleAddSeed}
                isAddSeed={isAddSeed}
              />
              <LargeDescriptionModal
              visible={openDescription}
              onCancel={() => {
                setOpenDescription(false)
              }} 
              onSubmit={handleSubmit}
              description={description}
              setDescription={setDescription}
              />

            </Col>
          </Row>
          <Row className="project-grid">
            {filteredProjects.map((project) => (
              <Col span={6} key={project.id}>
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

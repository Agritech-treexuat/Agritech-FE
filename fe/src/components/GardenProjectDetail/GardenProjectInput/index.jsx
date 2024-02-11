import React, { useState } from 'react'
import { useParams } from 'react-router'
import { Card, Tooltip, Button, Flex, notification } from 'antd'
import { EditFilled } from '@ant-design/icons'
import Loading from '../../../pages/Loading'
import { formatDate } from '../../../utils/helpers'
import useGardenProjectInput from './useGardenProjectInput'
import PlantModal from '../../ProjectDetail/AddProject/AddProjectPlant'
import SeedModal from '../../ProjectDetail/AddProject/AddProjectSeed'
import GARDEN from '../../../services/gardenService'
import PROJECT from '../../../services/projectService'

const { Meta } = Card

const GardenProjectInput = () => {
  const [api, contextHolder] = notification.useNotification()
  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5
    })
  }

  const gardenId = useParams().id
  const [openEdit, setOpenEdit] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedPlantEdit, setSelectedPlantEdit] = useState(null)
  const [projectDetail, setProjectDetail] = useState(null)
  const [selectedPlant, setSelectedPlant] = useState(null)
  const [selectedSeed, setSelectedSeed] = useState(null)
  const [openSeed, setOpenSeed] = useState(false)
  const [isAddSeed, setIsAddSeed] = useState(false)
  const { initData, isSuccess, refetch } = useGardenProjectInput(gardenId)

  const handleAddPlant = (plant) => {
    setSelectedPlant(plant)
    console.log(plant)
    setOpen(false)
    setIsAddSeed(true)
    setOpenSeed(true)
  }
  const handleAddSeed = () => {
    if (selectedSeed) {
      console.log(selectedSeed)
      // Do something with the selected seed
    }
    handleAddProject()
  }

  const handleAddProject = async () => {
    try {
      const data = {
        plantId: selectedPlant.id,
        seedId: selectedSeed.id,
        startDate: new Date()
      }
      await GARDEN.addNewProjectToGarden(data, gardenId)
      refetch()
      openNotificationWithIcon('success', 'Thông báo', 'Thêm thành công')
    } catch (error) {
      console.log(error)
    }
    setOpenSeed(false)
  }

  const handleUpdateProject = async () => {
    try {
      const data = {
        seed: selectedSeed.id
      }
      await PROJECT.editProjectInfo(data, projectDetail._id)
      refetch()
      openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
    } catch (error) {
      console.log(error)
    }
    setOpenEdit(false)
  }

  return (
    <div>
      {contextHolder}
      {isSuccess ? (
        <div>
          <Flex justify="space-between" align="center">
            <h2 style={{ margin: '0px' }}>Thông tin khởi tạo</h2>
            <Button
              type="primary"
              onClick={() => {
                setOpen(true)
              }}
            >
              Thêm cây mới
            </Button>
          </Flex>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap'
            }}
          >
            {initData.map((project) => (
              <Card
                style={{
                  width: '23%',
                  marginBottom: '1.5rem',
                  marginRight: '1.5rem'
                }}
                hoverable
                cover={<img alt="example" src={project.plantImage} />}
              >
                <Meta
                  align={'center'}
                  style={{ fontStyle: 'italic' }}
                  title={
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>Cây: {project.name}</span>{' '}
                      <Tooltip title="Sửa/Cập nhật thông tin">
                        <EditFilled
                          style={{ color: '#476930' }}
                          onClick={() => {
                            console.log(project)
                            setProjectDetail(project)
                            setSelectedPlantEdit(project.plant)
                            setIsAddSeed(false)
                            setOpenEdit(true)
                          }}
                        />
                      </Tooltip>{' '}
                    </div>
                  }
                />
                <div style={{ textAlign: 'left' }}>
                  <p>Hạt giống: {project.input.seed || 'Chưa có thông tin'}</p>
                  <p>
                    Ngày bắt đầu: {project.input.initDate ? formatDate(project.input.initDate) : 'Chưa có thông tin'}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <PlantModal
            open={open}
            onClose={() => setOpen(false)}
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
          <SeedModal
            selectedPlant={selectedPlantEdit}
            open={openEdit}
            onClose={() => setOpenEdit(false)}
            selectedSeed={selectedSeed}
            setSelectedSeed={setSelectedSeed}
            handleAddSeed={handleUpdateProject}
            isAddSeed={isAddSeed}
          />
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default GardenProjectInput

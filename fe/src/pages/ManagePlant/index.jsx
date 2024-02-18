import React from 'react'
import { useState } from 'react'
import { Row, Col, Input, Button, Popconfirm, notification } from 'antd'
import { Link } from 'react-router-dom'
import Loading from '../Loading'
import { Card } from 'antd'
import { AddPlantPopup } from '../../components'
import AddSeedPopup from '../../components/ManagePlant/AddSeedPopup'
import AddSeedConfirmationModal from '../../components/ManagePlant/AddSeedConfirmationModal'
import AddPlantFarmingPopup from '../../components/ManagePlant/AddPlantFarmingPopup'
import PLANT from '../../services/plantService'
import useManagePlant from './useManagePlant'
import SEED from '../../services/seedService'
import PLANT_FARMING from '../../services/plantFarmingService'
import { DeleteFilled, DeleteOutlined } from '@ant-design/icons'

const { Meta } = Card
const ManagePlant = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlant, setSelectedPlant] = useState(null)
  const [selectedSeed, setSelectedSeed] = useState(null)
  const [openSeed, setOpenSeed] = useState(false)
  const [open, setOpen] = useState(false)
  const [openPlantFarming, setOpenPlantFarming] = useState(false)
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false)
  const [isDefaultPlantFarming, setIsDefaultPlantFarming] = useState(false)

  const [api, contextHolder] = notification.useNotification()
  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5
    })
  }

  const { plantData, isSuccess, isLoading, refetch, recommendPlantFarming, isSuccessRecommendPlantFarming } =
    useManagePlant({
      seedId: selectedSeed?.id,
      isDefaultPlantFarming: isDefaultPlantFarming
    })
  const onCreate = async (values) => {
    try {
      const res = await PLANT.addPlantByRecommendPlantId(selectedPlant.id)
      if (res.response && res.response?.data?.message === 'Plant already exists') {
        openNotificationWithIcon('error', 'Thông báo', 'Cây đã tồn tại')
      } else {
        const resSeed = await SEED.addSeedByRecommendSeedId({
          recommendSeedId: selectedSeed.id
        })
        if (resSeed.response && resSeed.response?.data?.message === 'Seed already exists') {
          openNotificationWithIcon('error', 'Thông báo', 'Hạt giống đã tồn tại')
        } else {
          const res = await PLANT_FARMING.addPlantFarmingWithRecommendPlantIdAndSeedId({
            plantId: selectedPlant.id,
            seedId: selectedSeed.id,
            data: {
              isPlantFarmingDefault: true,
              ...values
            }
          })
          if (res.status === 200) {
            refetch()
            openNotificationWithIcon('success', 'Thông báo', 'Thêm thành công')
          } else {
            openNotificationWithIcon('error', 'Thông báo', 'Thêm thất bại')
          }
          setOpen(false)
          setOpenSeed(false)
          setOpenPlantFarming(false)
        }
      }
    } catch (error) {
      console.error(error)
      openNotificationWithIcon('error', 'Thông báo', 'Thêm thất bại')
    }
  }

  const handleAddPlant = (plant) => {
    setSelectedPlant(plant)
    setOpen(false)
    setOpenSeed(true)
  }

  const handleAddSeed = () => {
    if (selectedSeed) {
      setOpenSeed(false)
      setConfirmationModalVisible(true)
    }
  }

  const handleContinueWithTemplate = () => {
    setConfirmationModalVisible(false)
    setIsDefaultPlantFarming(true)
    setOpenPlantFarming(true)
  }

  const handleContinueWithEmpty = () => {
    setConfirmationModalVisible(false)
    setIsDefaultPlantFarming(false)
    setOpenPlantFarming(true)
  }

  const handleDelete = async (plantId) => {
    try {
      const res = await PLANT.deletePlant(plantId)
      if (res.status === 200) {
        refetch()
        openNotificationWithIcon('success', 'Thông báo', 'Xóa thành công')
      } else {
        openNotificationWithIcon('error', 'Thông báo', 'Xóa thất bại')
      }
    } catch (error) {
      console.log(error)
      openNotificationWithIcon('error', 'Thông báo', 'Xóa thất bại')
    }
  }

  return (
    <>
      {isLoading && <Loading />}
      {isSuccess && (
        <div>
          <h1>Danh sách các cây</h1>
          <Row>
            <Col span={8}>
              <Input
                placeholder="Tìm kiếm cây"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ marginBottom: '30px' }}
              />
            </Col>
            <Col span={1}></Col>
            <Col span={6}>
              <div>
                <Button
                  type="primary"
                  onClick={() => {
                    setOpen(true)
                  }}
                >
                  Thêm cây mới
                </Button>
                <AddPlantPopup
                  open={open}
                  onClose={() => setOpen(false)}
                  selectedPlant={selectedPlant}
                  setSelectedPlant={setSelectedPlant}
                  handleAddPlant={handleAddPlant}
                />
                <AddSeedPopup
                  selectedPlant={selectedPlant}
                  open={openSeed}
                  onClose={() => {
                    setOpenSeed(false)
                  }}
                  selectedSeed={selectedSeed}
                  setSelectedSeed={setSelectedSeed}
                  handleAddSeed={handleAddSeed}
                />
                <AddSeedConfirmationModal
                  visible={confirmationModalVisible}
                  onCancel={() => setConfirmationModalVisible(false)}
                  onContinueWithEmpty={handleContinueWithEmpty}
                  onContinueWithTemplate={handleContinueWithTemplate}
                />
                {isDefaultPlantFarming ? (
                  <>
                    {isSuccessRecommendPlantFarming && (
                      <AddPlantFarmingPopup
                        open={openPlantFarming}
                        onCancel={() => setOpenPlantFarming(false)}
                        onCreate={onCreate}
                        recommendPlantFarming={recommendPlantFarming}
                      />
                    )}
                  </>
                ) : (
                  <>
                    <AddPlantFarmingPopup
                      open={openPlantFarming}
                      onCancel={() => setOpenPlantFarming(false)}
                      onCreate={onCreate}
                      recommendPlantFarming={null}
                    />
                  </>
                )}
              </div>
            </Col>
          </Row>
          <Row className="plant-grid">
            {plantData.map((plant) => (
              <Col span={4} key={plant._id}>
                <Popconfirm
                  title="Are you sure to delete this plant?"
                  onConfirm={() => handleDelete(plant._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <div style={{ position: 'absolute', zIndex: '99', right: '2rem' }}>
                    <DeleteFilled style={{ fontSize: '24px', color: 'red' }} />
                  </div>
                </Popconfirm>
                <Link to={`/plant/${plant._id}`} key={plant._id}>
                  <Card
                    hoverable
                    style={{ width: 240, position: 'relative' }}
                    cover={<img alt="plant" src={plant.image} />}
                  >
                    <Meta title={plant.name} />
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </>
  )
}

export default ManagePlant

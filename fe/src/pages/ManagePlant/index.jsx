import React from 'react'
import { useState } from 'react'
import { Row, Col, Input, Button } from 'antd'
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

const { Meta } = Card
const ManagePlant = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlant, setSelectedPlant] = useState(null)
  const [selectedSeed, setSelectedSeed] = useState(null)
  const [openSeed, setOpenSeed] = useState(false)
  const [isDefaultSeed, setIsDefaultSeed] = useState(false)
  const [open, setOpen] = useState(false)
  const [openPlantFarming, setOpenPlantFarming] = useState(false)
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false)
  const [isDefaultPlantFarming, setIsDefaultPlantFarming] = useState(false)

  const { plantData, isSuccess, isLoading, refetch, recommendPlantFarming, isSuccessRecommendPlantFarming } =
    useManagePlant({
      seedId: selectedSeed?.id,
      isDefaultPlantFarming: isDefaultPlantFarming
    })
  const onCreate = async (values) => {
    try {
      const res = await PLANT.addPlantByRecommendPlantId(selectedPlant.id)
      if (res.response && res.response?.data?.message === 'Plant already exists') {
        alert('Cây đã tồn tại')
      } else {
        const resSeed = await SEED.addSeedByRecommendSeedId({
          recommendSeedId: selectedSeed.id,
          isSeedDefault: isDefaultSeed
        })
        if (resSeed.response && resSeed.response?.data?.message === 'Seed already exists') {
          alert('Hạt giống đã tồn tại')
        } else {
          await PLANT_FARMING.addPlantFarmingWithRecommendPlantIdAndSeedId({
            plantId: selectedPlant.id,
            seedId: selectedSeed.id,
            data: {
              isPlantFarmingDefault: true,
              ...values
            }
          })
          refetch()
          setIsDefaultSeed(false)
          setOpen(false)
          setOpenSeed(false)
          setOpenPlantFarming(false)
        }
      }
    } catch (error) {
      console.error(error)
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
                    setIsDefaultSeed(false)
                    setOpenSeed(false)
                  }}
                  selectedSeed={selectedSeed}
                  setSelectedSeed={setSelectedSeed}
                  handleAddSeed={handleAddSeed}
                  setIsDefaultSeed={setIsDefaultSeed}
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
                <Link to={`/plant/${plant._id}`} key={plant._id}>
                  <Card
                    hoverable
                    style={{
                      width: 240
                    }}
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

import React, { useState } from 'react'
import { Collapse, Button, Input, Card, Divider } from 'antd'
import { useParams } from 'react-router-dom'
import Loading from '../Loading'
import usePlantDetail from './usePlantDetail'
import AddSeedPopup from '../../components/ManagePlant/AddSeedPopup'
import AddSeedConfirmationModal from '../../components/ManagePlant/AddSeedConfirmationModal'
import AddPlantFarmingPopup from '../../components/ManagePlant/AddPlantFarmingPopup'
import PLANT_FARMING from '../../services/plantFarmingService'
import SEED from '../../services/seedService'

const { Panel } = Collapse

const PlantDetail = () => {
  const [search, setSearch] = useState('')
  const plantId = useParams().id

  const [openUpdatePlantFarming, setOpenUpdatePlantFarming] = useState(false)
  const [selectedPlantFarmming, setSelectedPlantFarmming] = useState(null)
  const [selectedSeed, setSelectedSeed] = useState(null)
  const [openSeed, setOpenSeed] = useState(false)
  const [isDefaultSeed, setIsDefaultSeed] = useState(false)
  const [openPlantFarming, setOpenPlantFarming] = useState(false)
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false)
  const [isDefaultPlantFarming, setIsDefaultPlantFarming] = useState(false)

  const {
    plans,
    isSuccessPlans,
    refetchPlans,
    currentPlant,
    isSuccessCurrentPlant,
    recommendPlantFarming,
    isSuccessRecommendPlantFarming,
    defaultPlant,
    isSuccessDefaultPlant
  } = usePlantDetail({ plantId, seedId: selectedSeed?.id, isDefaultPlantFarming })

  const onCreate = async (values) => {
    try {
      const resSeed = await SEED.addSeedByRecommendSeedId({
        recommendSeedId: selectedSeed.id,
        isSeedDefault: isDefaultSeed
      })
      if (resSeed.response && resSeed.response?.data?.message === 'Seed already exists') {
        alert('Hạt giống đã tồn tại')
      } else {
        await PLANT_FARMING.addPlantFarmingWithRecommendPlantIdAndSeedId({
          plantId,
          seedId: selectedSeed.id,
          data: {
            isPlantFarmingDefault: true,
            ...values
          }
        })
      }
      refetchPlans()
      setIsDefaultSeed(false)
      setIsDefaultPlantFarming(false)
      setOpenSeed(false)
      setOpenPlantFarming(false)
    } catch (error) {
      console.error(error)
    }
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
    <div>
      {isSuccessPlans && isSuccessCurrentPlant && isSuccessDefaultPlant ? (
        <>
          <h1>Thông tin cây trồng {currentPlant.name}</h1>
          <Input
            placeholder="Tìm kiếm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '200px', marginBottom: '16px' }}
          />
          <div>
            <Button
              type="primary"
              onClick={() => {
                setOpenSeed(true)
              }}
            >
              Thêm quy trình mới
            </Button>
          </div>
          <AddSeedPopup
            selectedPlant={{
              id: defaultPlant.id
            }}
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
                  onCancel={() => {
                    setIsDefaultSeed(false)
                    setIsDefaultPlantFarming(false)
                    setOpenPlantFarming(false)
                  }}
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
          {plans.map((item) => (
            <Card style={{ marginTop: '16px' }} key={item._id}>
              <h2>{item.seed}</h2>
              <Collapse>
                <Panel header="Quy trình chi tiết">
                  <Button
                    type="primary"
                    onClick={() => {
                      setSelectedPlantFarmming(item)
                      setOpenUpdatePlantFarming(true)
                    }}
                  >
                    Chỉnh sửa
                  </Button>
                  <AddPlantFarmingPopup
                    open={openUpdatePlantFarming}
                    onCancel={() => setOpenUpdatePlantFarming(false)}
                    onCreate={(values) => {
                      console.log('values', values)
                    }}
                    recommendPlantFarming={item}
                  />
                  <div>
                    {/* time cultivates: [{ start, end }] */}
                    <h2> Thoi gian canh tac </h2>
                    {item.timeCultivates.map((timeCultivate) => (
                      <div key={timeCultivate._id}>
                        <p>Thoi gian bat dau: {timeCultivate.start}</p>
                        <p>Thoi gian ket thuc: {timeCultivate.end}</p>
                      </div>
                    ))}
                  </div>
                  <Divider />
                  <div>
                    {/*  cultivationActivities: [{name, description}] */}
                    <h2> Hoat dong voi dat </h2>
                    {item.cultivationActivities.map((cultivationActivity) => (
                      <div key={cultivationActivity._id}>
                        <p>Ten hoat dong: {cultivationActivity.name}</p>
                        <p>Mo ta: {cultivationActivity.description}</p>
                      </div>
                    ))}
                  </div>
                  <Divider />
                  <div>
                    {/*  plantingActivity: {density, description} */}
                    <h2> Hoat dong trong gieo trong </h2>
                    <p>Mat do gieo trong: {item.plantingActivity.density}</p>
                    <p>Mo ta: {item.plantingActivity.description}</p>
                  </div>
                  <Divider />
                  <div>
                    {/* fertilizationActivities: [fertilizationTime, type, description] */}
                    <h2> Hoat dong phan bon </h2>
                    {item.fertilizationActivities.map((fertilizationActivity) => (
                      <div key={fertilizationActivity._id}>
                        <p>Thoi gian: {fertilizationActivity.fertilizationTime}</p>
                        <p>Loai: {fertilizationActivity.type}</p>
                        <p>Mo ta: {fertilizationActivity.description}</p>
                      </div>
                    ))}
                  </div>
                  <Divider />
                  <div>
                    {/* pestAndDiseaseControlActivities: [{name, type
                    symptoms
                    description
                    solution: [string]
                    note}] */}
                    <h2> Hoat dong phong ngua sau, benh </h2>
                    {item.pestAndDiseaseControlActivities.map((pestAndDiseaseControlActivity) => (
                      <div key={pestAndDiseaseControlActivity._id}>
                        <p>Ten: {pestAndDiseaseControlActivity.name}</p>
                        <p>Loai: {pestAndDiseaseControlActivity.type}</p>
                        <p>Trieu chung: {pestAndDiseaseControlActivity.symptoms}</p>
                        <p>Mo ta: {pestAndDiseaseControlActivity.description}</p>
                        <p>Giai phap:</p>
                        {pestAndDiseaseControlActivity.solution.map((solution) => (
                          <p key={solution}>{solution}</p>
                        ))}
                        <p>Ghi chu: {pestAndDiseaseControlActivity.note}</p>
                      </div>
                    ))}
                  </div>
                  <Divider />
                  <div>
                    {/* bestTimeCultivate: {start, end} */}
                    <h2> Thoi gian canh tac tot nhat </h2>
                    <p>Thoi gian bat dau: {item.bestTimeCultivate.start}</p>
                    <p>Thoi gian ket thuc: {item.bestTimeCultivate.end}</p>
                  </div>

                  <Divider />
                  {/* farmingTime: number */}
                  <p>Thoi gian trong cay: {item.farmingTime}</p>
                  <Divider />
                  {/* harvestTime: number */}
                  <p>Thoi gian thu hoach: {item.harvestTime}</p>
                  <Divider />
                </Panel>
              </Collapse>
            </Card>
          ))}
        </>
      ) : (
        <>
          <Loading />
        </>
      )}
    </div>
  )
}

export default PlantDetail

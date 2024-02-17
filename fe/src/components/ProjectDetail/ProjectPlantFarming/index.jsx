import React, { useState } from 'react'
import useProjectPlantFarming from './useProjectPlantFarming'
import Loading from '../../../pages/Loading'
import AddPlantFarmingPopup from '../../ManagePlant/AddPlantFarmingPopup'
import PLANT_FARMING from '../../../services/plantFarmingService'
import { Button, Divider } from 'antd'
import SelectOptionConfirmationModal from './SelectOptionConfirmationModal'
import useProjectInput from '../ProjectInput/useProjectInput'
import PROJECT from '../../../services/projectService'
import EditPlantFarmingHistory from './EditPlantFarmingHistory'

const ProjectFarming = ({ projectId }) => {
  const [openUpdatePlantFarming, setOpenUpdatePlantFarming] = useState(false)
  const [openAddPlantFarming, setOpenAddPlantFarming] = useState(false)
  const [opneConfirmPlantFarming, setOpenConfirmPlantFarming] = useState(false)
  const [isDefaultPlantFarming, setIsDefaultPlantFarming] = useState(false)
  const [isFarmPlantFarming, setIsFarmPlantFarming] = useState(false)
  const { projectInfo, isSuccess } = useProjectInput({ projectId })
  const {
    plantFarming,
    isSuccessPlantFarming,
    refetch,
    dataRecommendPlantFarming,
    isSuccessRecommendPlantFarming,
    dataFarmPlantFarming,
    isSuccessFarmPlantFarming
  } = useProjectPlantFarming({
    projectId,
    projectInfo,
    isSuccess,
    isDefaultPlantFarming,
    isFarmPlantFarming
  })

  const handleUpdatePlantFarming = async (values) => {
    try {
      await PLANT_FARMING.updatePlantFarming({
        plantFarmingId: plantFarming.id,
        data: values
      })
      refetch()
      setOpenUpdatePlantFarming(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleAddPlantFarming = async (values) => {
    try {
      await PROJECT.addPlantFarmingToProject({
        projectId: projectId,
        data: values
      })
      refetch()
      setOpenAddPlantFarming(false)
    } catch (error) {
      console.error(error)
    }
  }

  if (!isSuccessPlantFarming || !isSuccess) {
    return <Loading />
  }
  if (plantFarming === null && isSuccessPlantFarming) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold' }}>Dự án này chưa có Quy trình canh tác</h1>
        <button onClick={() => setOpenConfirmPlantFarming(true)} style={{ fontSize: '24px', marginTop: '20px' }}>
          Khởi tạo quy trình canh tác
        </button>
        <SelectOptionConfirmationModal
          visible={opneConfirmPlantFarming}
          onCancel={() => setOpenConfirmPlantFarming(false)}
          onContinueWithEmpty={() => {
            setIsDefaultPlantFarming(false)
            setIsFarmPlantFarming(false)
            setOpenConfirmPlantFarming(false)
            setOpenAddPlantFarming(true)
          }}
          onContinueWithRecommendPlantFarming={() => {
            setIsFarmPlantFarming(false)
            setIsDefaultPlantFarming(true)
            setOpenConfirmPlantFarming(false)
            setOpenAddPlantFarming(true)
          }}
          onContinueWithFarmPlantfarming={() => {
            setIsDefaultPlantFarming(false)
            setIsFarmPlantFarming(true)
            setOpenConfirmPlantFarming(false)
            setOpenAddPlantFarming(true)
          }}
        />
        {isSuccessRecommendPlantFarming && isDefaultPlantFarming && (
          <AddPlantFarmingPopup
            open={openAddPlantFarming}
            onCancel={() => {
              setIsDefaultPlantFarming(false)
              setOpenAddPlantFarming(false)
            }}
            onCreate={handleAddPlantFarming}
            recommendPlantFarming={dataRecommendPlantFarming}
          />
        )}
        {isSuccessFarmPlantFarming && isFarmPlantFarming && (
          <AddPlantFarmingPopup
            open={openAddPlantFarming}
            onCancel={() => {
              setIsFarmPlantFarming(false)
              setOpenAddPlantFarming(false)
            }}
            onCreate={handleAddPlantFarming}
            recommendPlantFarming={dataFarmPlantFarming}
          />
        )}
        {!isFarmPlantFarming && !isDefaultPlantFarming && (
          <AddPlantFarmingPopup
            open={openAddPlantFarming}
            onCancel={() => {
              setOpenAddPlantFarming(false)
            }}
            onCreate={handleAddPlantFarming}
            recommendPlantFarming={null}
          />
        )}
      </div>
    )
  } else {
    // Nếu có plantFarming, hiển thị nó
    return (
      <div>
        <h2>{`Quy trình canh tác cho cây ${projectInfo.plant?.plant_name} với hạt giống ${projectInfo.seed?.seed_name}`}</h2>
        <Button
          type="primary"
          onClick={() => {
            setOpenUpdatePlantFarming(true)
          }}
        >
          Chỉnh sửa
        </Button>
        {plantFarming.isEdited ? (
          <EditPlantFarmingHistory historyPlantFarmingEdit={plantFarming.historyPlantFarmingEdit} />
        ) : null}
        <AddPlantFarmingPopup
          open={openUpdatePlantFarming}
          onCancel={() => setOpenUpdatePlantFarming(false)}
          onCreate={handleUpdatePlantFarming}
          recommendPlantFarming={plantFarming}
          isUpdate={true}
        />
        <div>
          {/* time cultivates: [{ start, end }] */}
          <h2> Thoi gian canh tac </h2>
          {plantFarming.timeCultivates.map((timeCultivate) => (
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
          {plantFarming.cultivationActivities.map((cultivationActivity) => (
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
          <p>Mat do gieo trong: {plantFarming.plantingActivity.density}</p>
          <p>Mo ta: {plantFarming.plantingActivity.description}</p>
        </div>
        <Divider />
        <div>
          {/* fertilizationActivities: [fertilizationTime, type, description] */}
          <h2> Hoat dong phan bon </h2>
          {plantFarming.fertilizationActivities.map((fertilizationActivity) => (
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
          {plantFarming.pestAndDiseaseControlActivities.map((pestAndDiseaseControlActivity) => (
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
          <p>Thoi gian bat dau: {plantFarming.bestTimeCultivate.start}</p>
          <p>Thoi gian ket thuc: {plantFarming.bestTimeCultivate.end}</p>
        </div>

        <Divider />
        {/* farmingTime: number */}
        <p>Thoi gian trong cay: {plantFarming.farmingTime}</p>
        <Divider />
        {/* harvestTime: number */}
        <p>Thoi gian thu hoach: {plantFarming.harvestTime}</p>
        <Divider />
      </div>
    )
  }
}

export default ProjectFarming

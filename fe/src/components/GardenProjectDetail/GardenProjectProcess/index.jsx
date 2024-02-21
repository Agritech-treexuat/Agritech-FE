import React, { useState } from 'react'
import { Button } from 'antd'
import Loading from '../../../pages/Loading'
import useGardenProjectInput from '../GardenProjectInput/useGardenProjectInput'
import { useParams } from 'react-router-dom'
import { formatDateTime } from '../../../utils/helpers'
import ProcessActivityPage from '../../ProjectDetail/ProjectProcessActivity'

const GardenProjectProcess = () => {
  const gardenId = useParams().id
  const [selectedPlant, setSelectedPlant] = useState(null)
  const { initData, isSuccess } = useGardenProjectInput(gardenId)

  const handlePlantSelect = (plantId) => {
    setSelectedPlant(plantId)
  }

  const renderStatus = (status) => {
    switch (status) {
      case 'inProgress':
        return 'Đang thực hiện'
      case 'harvesting':
        return 'Đang thu hoạch'
      case 'almostFinished':
        return 'Sắp thu hoạch xong'
      case 'finished':
        return 'Hoàn thành'
      case 'cancel':
        return 'Đã hủy'
      default:
        return 'Chưa có thông tin'
    }
  }

  return isSuccess ? (
    <div>
      <div style={{ marginBottom: '16px' }}>
        {/* Render plant buttons */}
        {initData.map((project) => (
          <Button
            key={project._id}
            style={{ marginRight: '8px', marginBottom: '8px' }}
            onClick={() => handlePlantSelect(project._id)}
          >
            {project.name} - {formatDateTime(project.startDate)} - {renderStatus(project.status)}
          </Button>
        ))}
      </div>
      {/* Render ProcessActivityPage component if a plant is selected */}
      {selectedPlant && <ProcessActivityPage projectId={selectedPlant} />}
    </div>
  ) : (
    <Loading />
  )
}

export default GardenProjectProcess

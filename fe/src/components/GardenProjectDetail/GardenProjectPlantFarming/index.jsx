import React, { useState } from 'react'
import { Button } from 'antd'
import ProjectFarming from '../../ProjectDetail/ProjectPlantFarming'
import Loading from '../../../pages/Loading'
import useGardenProjectInput from '../GardenProjectInput/useGardenProjectInput'
import { useParams } from 'react-router-dom'
import { formatDateTime } from '../../../utils/helpers'

const GardenProjectPlantFarming = () => {
  const gardenId = useParams().id
  const [selectedPlant, setSelectedPlant] = useState(null)
  const { initData, isSuccess } = useGardenProjectInput(gardenId)

  const handlePlantSelect = (plantId) => {
    setSelectedPlant(plantId)
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
            {project.name} - {formatDateTime(project.startDate)} - {project.status}
          </Button>
        ))}
      </div>
      {/* Render ProjectFarming component if a plant is selected */}
      {selectedPlant && <ProjectFarming projectId={selectedPlant} />}
    </div>
  ) : (
    <Loading />
  )
}

export default GardenProjectPlantFarming

import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import PLANT from '../../services/plantService'

export default function useManagePlant() {
  const farmId = localStorage.getItem('id')
  const parseData = useCallback((data) => {
    const plant = data.map((plant) => ({
      _id: plant._id,
      name: plant.plant_name,
      image: plant.plant_thumb
    }))
    return { plant }
  }, [])

  const parseDataAllPlants = useCallback((data) => {
    const allPlants = data.map((plant) => ({
      _id: plant._id,
      name: plant.plant_name
    }))
    return { allPlants }
  }, [])

  const { data, isSuccess, isLoading, refetch } = useQuery({
    queryKey: ['getPlant', farmId],
    queryFn: () => PLANT.getPlantFromFarm(farmId),
    staleTime: 20 * 1000,
    select: (data) => parseData(data.data.metadata),
    enabled: !!farmId
  })

  const {
    data: data_2,
    isSuccess: isSuccess_2,
    isLoading: isLoading_2
  } = useQuery({
    queryKey: ['getAllPlant'],
    queryFn: () => PLANT.getAllPlant(),
    staleTime: 20 * 1000,
    select: (data) => parseDataAllPlants(data.data.metadata)
  })

  return {
    plantData: data?.plant,
    isSuccess,
    isLoading,
    allPlantsData: data_2?.allPlants,
    isLoading_2,
    isSuccess_2,
    refetch
  }
}

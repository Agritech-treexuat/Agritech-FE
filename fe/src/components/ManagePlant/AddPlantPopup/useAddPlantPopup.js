import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import PLANT from '../../../services/plantService'

export default function useAddProject() {
  const parseDataAllPlants = useCallback((data) => {
    const allPlants = data.map((item) => {
      return {
        id: item?._id,
        name: item?.plant_name,
        image: item?.plant_thumb,
        type: item?.plant_type
      }
    })

    return {
      allPlants
    }
  }, [])

  const {
    data: dataAllPlantInFarm,
    isSuccess: isSuccessAllPlants,
    isLoading: isLoadingAllPlants,
    refetch
  } = useQuery({
    queryKey: ['allPlant'],
    queryFn: () => PLANT.getAllPlant(),
    staleTime: 20 * 1000,
    select: (data) => parseDataAllPlants(data.data.metadata)
  })

  return {
    allPlants: dataAllPlantInFarm?.allPlants || [],
    isSuccessAllPlants,
    isLoadingAllPlants,
    refetch
  }
}

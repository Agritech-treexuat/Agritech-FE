import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import PROJECT from '../../services/projectService'
import PLANT from '../../services/plantService'

export default function useProjectList() {
  const farmId = localStorage.getItem('id')
  console.log('farm id: ', farmId)

  const parseData = useCallback((data) => {
    const projects = data.map((item) => {
      return {
        id: item?._id,
        title: item?.plant?.plant_name,
        seed: item.seed ? item?.seed?.seed_name : 'basic',
        startDate: item?.startDate,
        image: item?.plant?.plant_thumb
      }
    })

    return {
      projects
    }
  }, [])

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['projects', farmId],
    queryFn: () => PROJECT.getProjects(farmId),
    staleTime: 20 * 1000,
    select: (data) => parseData(data.data.metadata),
    enabled: !!farmId
  })

  const parseDataAllPlantsInFarm = useCallback((data) => {
    const allPlantsInFarm = data.map((item) => {
      return {
        id: item?._id,
        name: item?.plant_name,
        image: item?.plant_thumb
      }
    })

    return {
      allPlantsInFarm
    }
  }, [])

  const { data: dataAllPlantInFarm, isSuccess: isSuccessAllPlantsInFarm, isLoading: isLoadingAllPlantsInFarm } = useQuery({
    queryKey: ['allPlant', farmId],
    queryFn: () => PLANT.getPlantFromFarm(farmId),
    staleTime: 20 * 1000,
    select: (data) => parseDataAllPlantsInFarm(data.data.metadata),
    enabled: !!farmId
  })

  return {
    projects: data?.projects || [],
    isSuccess,
    isLoading,
    allPlantsInFarm: dataAllPlantInFarm?.allPlantsInFarm || [],
    isSuccessAllPlantsInFarm,
    isLoadingAllPlantsInFarm
  }
}

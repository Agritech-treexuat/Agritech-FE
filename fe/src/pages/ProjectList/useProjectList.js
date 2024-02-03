import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import PROJECT from '../../services/projectService'
import PLANT from '../../services/plantService'
import SEED from '../../services/seedService'

export default function useProjectList({ plantId }) {
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

  const { data, isSuccess, isLoading, refetch } = useQuery({
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
        image: item?.plant_thumb,
        type: item?.plant_type
      }
    })

    return {
      allPlantsInFarm
    }
  }, [])

  const {
    data: dataAllPlantInFarm,
    isSuccess: isSuccessAllPlantsInFarm,
    isLoading: isLoadingAllPlantsInFarm
  } = useQuery({
    queryKey: ['allPlant', farmId],
    queryFn: () => PLANT.getPlantFromFarm(farmId),
    staleTime: 20 * 1000,
    select: (data) => parseDataAllPlantsInFarm(data.data.metadata),
    enabled: !!farmId
  })

  const parseDataAllSeedFromPlant = useCallback((data) => {
    const allPlantsInFarm = data.map((item) => {
      return {
        id: item?._id,
        name: item?.seed_name,
        image: item?.seed_thumb,
        description: item?.seed_description
      }
    })

    return {
      allPlantsInFarm
    }
  }, [])

  const {
    data: dataAllSeedFromPlant,
    isSuccess: isSuccessAllSeedFromPlant,
    isLoading: isLoadingAllSeedFromPlant
  } = useQuery({
    queryKey: ['getAllSeedFromPlant', plantId],
    queryFn: () => SEED.getAllSeedByPlantId(plantId),
    staleTime: 20 * 1000,
    select: (data) => parseDataAllSeedFromPlant(data.data.metadata),
    enabled: !!plantId
  })

  return {
    projects: data?.projects || [],
    isSuccess,
    isLoading,
    refetch,
    allPlantsInFarm: dataAllPlantInFarm?.allPlantsInFarm || [],
    isSuccessAllPlantsInFarm,
    isLoadingAllPlantsInFarm,
    allSeedFromPlant: dataAllSeedFromPlant?.allPlantsInFarm || [],
    isSuccessAllSeedFromPlant,
    isLoadingAllSeedFromPlant
  }
}

import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import FARM from '../../services/farmService'

export default function useManagePlant() {
  const farmId = localStorage.getItem('id')
  const parseData = useCallback((data) => {
    const plant = data
    return { plant }
  }, [])

  const parseDataAllPlants = useCallback((data) => {
    const allPlants = data
    return { allPlants }
  }, [])

  const { data, isSuccess, isLoading, refetch } = useQuery({
    queryKey: ['getPlant', farmId],
    queryFn: () => FARM.getPlant(farmId),
    staleTime: 20 * 1000,
    select: (data) => parseData(data.data.plants),
    enabled: !!farmId
  })

  const {
    data: data_2,
    isSuccess: isSuccess_2,
    isLoading: isLoading_2
  } = useQuery({
    queryKey: ['getAllPlant'],
    queryFn: () => FARM.getAllPlant(),
    staleTime: 20 * 1000,
    select: (data) => parseDataAllPlants(data.data.plants)
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

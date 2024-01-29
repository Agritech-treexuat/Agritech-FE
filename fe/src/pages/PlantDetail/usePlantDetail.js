import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import FARM from '../../services/farmService'
import { constants } from '../../utils/constant'

export default function usePlantDetail(farmId, plantId, seed, isUseDefault) {
  const adminId = constants.ADMIN_ID
  const parseDataPlans = useCallback((data) => {
    const plans = data
    return { plans }
  }, [])

  const {
    data: dataPlans,
    isSuccess: isSuccessPlans,
    isLoading: isLoadingPlans,
    refetch: refetchPlans
  } = useQuery({
    queryKey: ['getPlans', farmId],
    queryFn: () => FARM.getPlans(farmId, plantId),
    staleTime: 20 * 1000,
    select: (data) => parseDataPlans(data.data.plantFarming),
    enabled: !!farmId
  })

  const parseDataAllSeedByPlant = useCallback((data) => {
    const allSeedByPlant = data
    return { allSeedByPlant }
  }, [])

  const {
    data: dataAllSeedByPlant,
    isSuccess: isSuccessAllSeedByPlant,
    isLoading: isLoadingAllSeedByPlant
  } = useQuery({
    queryKey: ['getAllSeedByPlantId', plantId],
    queryFn: () => FARM.getAllSeedByPlantId(plantId),
    staleTime: 20 * 1000,
    select: (data) => parseDataAllSeedByPlant(data.data.seeds),
    enabled: !!plantId
  })

  const parseDataCurrentPlant = useCallback((data) => {
    const currentPlant = data
    return { currentPlant }
  }, [])

  const {
    data: dataCurrentPlant,
    isSuccess: isSuccessCurrentPlant,
    isLoading: isLoadingCurrentPlant
  } = useQuery({
    queryKey: ['getPlantByPlantId', plantId],
    queryFn: () => FARM.getPlantByPlantId(plantId),
    staleTime: 20 * 1000,
    select: (data) => parseDataCurrentPlant(data.data.plant),
    enabled: !!plantId
  })

  const parseDataCultivatives = useCallback((data) => {
    const fetilizer = []
    const BVTV = []
    data.forEach((cultivative) => {
      if (cultivative.type === 'phân bón') {
        fetilizer.push(cultivative)
      } else if (cultivative.type === 'BVTV') {
        BVTV.push(cultivative)
      }
    })
    return { fetilizer, BVTV }
  }, [])

  const {
    data: dataCultivatives,
    isSuccess: isSuccessCultivatives,
    isLoading: isLoadingCultivatives
  } = useQuery({
    queryKey: ['getCultivative'],
    queryFn: () => FARM.getCultivative(),
    staleTime: 20 * 1000,
    select: (data) => parseDataCultivatives(data.data.cultivatives),
    enabled: !!plantId
  })

  const parseDataDefaultTemplate = useCallback((data) => {
    const defaultTemplate = data
    return { defaultTemplate }
  }, [])

  const {
    data: dataDefaultTemplate,
    isSuccess: isSuccessDefaultTemplate,
    isLoading: isLoadingDefaultTemplate
  } = useQuery({
    queryKey: ['getPlanFromSeed', seed],
    queryFn: () => FARM.getPlanFromSeed(adminId, seed),
    staleTime: 20 * 1000,
    select: (data) => parseDataDefaultTemplate(data.data.plantFarming.plan),
    enabled: !!seed && !!isUseDefault
  })

  return {
    plans: dataPlans?.plans,
    isSuccessPlans,
    isLoadingPlans,
    refetchPlans,
    allSeedByPlant: dataAllSeedByPlant?.allSeedByPlant,
    isSuccessAllSeedByPlant,
    isLoadingAllSeedByPlant,
    currentPlant: dataCurrentPlant?.currentPlant,
    isSuccessCurrentPlant,
    isLoadingCurrentPlant,
    fetilizer: dataCultivatives?.fetilizer,
    BVTV: dataCultivatives?.BVTV,
    isSuccessCultivatives,
    isLoadingCultivatives,
    defaultTemplate: dataDefaultTemplate?.defaultTemplate,
    isSuccessDefaultTemplate,
    isLoadingDefaultTemplate
  }
}

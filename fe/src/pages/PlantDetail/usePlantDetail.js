import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import PLANT from '../../services/plantService'
import SEED from '../../services/seedService'
import PLANT_FARMING from '../../services/plantFarmingService'

export default function usePlantDetail(plantId, seedId, isUseDefault) {
  const parseDataPlans = useCallback((data) => {
    const plans = data.map((plan) => ({
      _id: plan._id,
      seed: plan.seed.seed_name,
      timeCultivates: plan.timeCultivates,
      cultivationActivities: plan.cultivationActivities,
      plantingActivity: plan.plantingActivity,
      fertilizationActivities: plan.fertilizationActivities,
      pestAndDiseaseControlActivities: plan.pestAndDiseaseControlActivities,
      bestTimeCultivate: plan.bestTimeCultivate,
      farmingTime: plan.farmingTime,
      harvestTime: plan.harvestTime
    }))
    return { plans }
  }, [])

  const {
    data: dataPlans,
    isSuccess: isSuccessPlans,
    isLoading: isLoadingPlans,
    refetch: refetchPlans
  } = useQuery({
    queryKey: ['getPlans', plantId],
    queryFn: () => PLANT_FARMING.getListPlantFarmingFromPlant(plantId),
    staleTime: 20 * 1000,
    select: (data) => parseDataPlans(data.data.metadata),
    enabled: !!plantId
  })

  const parseDataAllSeedByPlant = useCallback((data) => {
    const allSeedByPlant = data.map((seed) => ({
      id: seed._id,
      name: seed.seed_name
    }))
    return { allSeedByPlant }
  }, [])

  const {
    data: dataAllSeedByPlant,
    isSuccess: isSuccessAllSeedByPlant,
    isLoading: isLoadingAllSeedByPlant
  } = useQuery({
    queryKey: ['getAllSeedByPlantId', plantId],
    queryFn: () => SEED.getAllSeedByPlantId(plantId),
    staleTime: 20 * 1000,
    select: (data) => parseDataAllSeedByPlant(data.data.metadata),
    enabled: !!plantId
  })

  const parseDataCurrentPlant = useCallback((data) => {
    const currentPlant = {
      name: data.plant_name
    }
    return { currentPlant }
  }, [])

  const {
    data: dataCurrentPlant,
    isSuccess: isSuccessCurrentPlant,
    isLoading: isLoadingCurrentPlant
  } = useQuery({
    queryKey: ['getPlantByPlantId', plantId],
    queryFn: () => PLANT.getPlantByPlantId(plantId),
    staleTime: 20 * 1000,
    select: (data) => parseDataCurrentPlant(data.data.metadata),
    enabled: !!plantId
  })

  const parseDataDefaultTemplate = useCallback((data) => {
    const defaultTemplate = data[0]
    return { defaultTemplate }
  }, [])

  const {
    data: dataDefaultTemplate,
    isSuccess: isSuccessDefaultTemplate,
    isLoading: isLoadingDefaultTemplate
  } = useQuery({
    queryKey: ['getPlanFromSeed', seedId],
    queryFn: () => PLANT_FARMING.getPlantFarmingFromSeed(seedId),
    staleTime: 20 * 1000,
    select: (data) => parseDataDefaultTemplate(data.data.metadata),
    enabled: !!seedId && !!isUseDefault
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
    defaultTemplate: dataDefaultTemplate?.defaultTemplate,
    isSuccessDefaultTemplate,
    isLoadingDefaultTemplate
  }
}

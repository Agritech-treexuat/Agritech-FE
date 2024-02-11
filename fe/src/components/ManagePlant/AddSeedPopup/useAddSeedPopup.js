import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import SEED from '../../../services/seedService'

export default function useAddSeedPopup({ plantId }) {
  const parseDataAllSeedFromPlant = useCallback((data) => {
    const allSeedsFromPlant = data.map((item) => {
      return {
        id: item?._id,
        name: item?.seed_name,
        image: item?.seed_thumb,
        description: item?.seed_description
      }
    })

    return {
      allSeedsFromPlant
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
    allSeedFromPlant: dataAllSeedFromPlant?.allSeedsFromPlant || [],
    isSuccessAllSeedFromPlant,
    isLoadingAllSeedFromPlant
  }
}

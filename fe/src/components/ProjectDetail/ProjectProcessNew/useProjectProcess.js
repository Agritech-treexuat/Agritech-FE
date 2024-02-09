import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import PROJECT from '../../../services/projectService'

export default function useProjectProcess({ projectId }) {
  const parseData = useCallback((data) => {
    // base on type of each item in data(list), (type: ['cultivation', 'planting', 'fertilize', 'pesticide', 'other']), classify to 5 list
    const process = {
      cultivation: [],
      planting: [],
      fertilize: [],
      pesticide: [],
      other: []
    }
    data.forEach((item) => {
      process[item.type].push(item)
    })
    return { process }
  }, [])

  const { data, isSuccess, isLoading, refetch } = useQuery({
    queryKey: ['getProcess', projectId],
    queryFn: () => PROJECT.getProcess(projectId),
    staleTime: 20 * 1000,
    select: (data) => parseData(data?.data?.metadata.process),
    enabled: !!projectId
  })

  return {
    cultivation: data?.process?.cultivation,
    planting: data?.process?.planting,
    fertilize: data?.process?.fertilize,
    pesticide: data?.process?.pesticide,
    other: data?.process?.other,
    isSuccess,
    isLoading,
    refetch
  }
}

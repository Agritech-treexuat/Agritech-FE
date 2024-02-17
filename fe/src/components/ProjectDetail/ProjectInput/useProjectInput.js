import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import PROJECT from '../../../services/projectService'

export default function useProjectInput({ projectId }) {
  const parseData = useCallback((data) => {
    console.log('data: ', data)
    const project = {
      id: data?._id,
      plant: data?.plant,
      seed: data?.seed,
      startDate: data?.startDate,
      square: data?.square,
      status: data?.status,
      description: data?.description,
      txHash: data?.txHash,
      createdAtTime: data?.createdAtTime,
      isInfoEdited: data?.isInfoEdited,
      historyInfo: data?.historyInfo
    }
    return {
      project
    }
  }, [])

  const { data, isSuccess, isLoading, refetch } = useQuery({
    queryKey: ['projectInfo', projectId],
    queryFn: () => PROJECT.getProjectByProjectId(projectId),
    staleTime: 20 * 1000,
    select: (data) => parseData(data?.data?.metadata),
    enabled: !!projectId
  })

  return {
    projectInfo: data?.project,
    isSuccess,
    isLoading,
    refetch
  }
}

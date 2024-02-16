import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import PROJECT from '../../../services/projectService'

export default function useProjectExpect({ projectId }) {
  const parseData = useCallback((data) => {
    const expect = data.map((item) => ({
      id: item?._id,
      tx: item?.tx,
      time: item?.time,
      amount: item?.amount,
      note: item?.note,
      isEdited: item?.isEdited,
      historyExpect: item?.historyExpect
    }))
    return { expect }
  }, [])

  const { data, isSuccess, isLoading, refetch } = useQuery({
    queryKey: ['projectExpect', projectId],
    queryFn: () => PROJECT.getExpect(projectId),
    staleTime: 20 * 1000,
    select: (data) => parseData(data?.data?.metadata),
    enabled: !!projectId
  })

  return {
    expectData: data?.expect,
    isSuccess,
    isLoading,
    refetch
  }
}

import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import PROJECT from '../../../services/projectService'

export default function useProjectOutput({ projectId }) {
  const parseData = useCallback((data) => {
    const output = data.map((item) => ({
      id: item?._id,
      tx: item?.tx,
      time: item?.time,
      amount: item?.amount,
      amountPerOne: item?.amountPerOne,
      images: item?.images,
      distributerWithAmount: item?.distributerWithAmount,
      isEdited: item?.isEdited,
      historyOutput: item?.historyOutput,
      exportQR: item?.exportQR
    }))
    return { output }
  }, [])

  const { data, isSuccess, isLoading, refetch } = useQuery({
    queryKey: ['projectOutput', projectId],
    queryFn: () => PROJECT.getOutput(projectId),
    staleTime: 20 * 1000,
    select: (data) => parseData(data?.data?.metadata.output),
    enabled: !!projectId
  })

  return {
    outputData: data?.output,
    isSuccess,
    isLoading,
    refetch
  }
}

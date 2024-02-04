import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import PROJECT from '../../../services/projectService'
import DISTRIBUTER from '../../../services/distributerService'

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

  const parseDataDistributer = useCallback((data) => {
    const allDistributer = data.map((item) => ({
      id: item?._id,
      name: item?.name,
      email: item?.email,
      status: item?.status,
      description: item?.description,
      images: item?.images,
      address: item?.address
    }))
    return { allDistributer }
  }, [])

  const {
    data: dataDistributer,
    isSuccess: isSucessDistributer,
    isLoading: isLoadingDistributer
  } = useQuery({
    queryKey: ['getAllDistributer'],
    queryFn: () => DISTRIBUTER.getAllDistributer(),
    staleTime: 20 * 1000,
    select: (data) => parseDataDistributer(data?.data?.metadata)
  })

  return {
    outputData: data?.output,
    isSuccess,
    isLoading,
    refetch,
    alllDistributer: dataDistributer?.allDistributer,
    isSucessDistributer,
    isLoadingDistributer
  }
}

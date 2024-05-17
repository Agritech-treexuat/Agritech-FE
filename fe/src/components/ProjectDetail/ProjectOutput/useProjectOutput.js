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
      quantity: item?.quantity,
      images: item?.images,
      distributerWithAmount: item?.distributerWithAmount,
      isEdited: item?.isEdited,
      historyOutput: item?.historyOutput,
      exportQR: item?.exportQR,
      createdAtTime: item?.createdAtTime
    }))
    return { output }
  }, [])

  const { data, isSuccess, isLoading, refetch } = useQuery({
    queryKey: ['projectOutput', projectId],
    queryFn: () => PROJECT.getOutput(projectId),
    staleTime: 20 * 1000,
    select: (data) => parseData(data?.data?.metadata),
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

  const parseDataProjectInfo = useCallback((data) => {
    console.log('data: ', data)
    const project = {
      id: data?._id,
      plant: data?.plant,
      seed: data?.seed,
      startDate: data?.startDate,
      square: data?.square,
      status: data?.status,
      description: data?.description,
      isGarden: data?.isGarden,
      projectIndex: data?.projectIndex
    }
    return {
      project
    }
  }, [])

  const { data: dataProjectInfo, isSuccess: isSuccessProjectInfo } = useQuery({
    queryKey: ['projectInfo', projectId],
    queryFn: () => PROJECT.getProjectByProjectId(projectId),
    staleTime: 20 * 1000,
    select: (data) => parseDataProjectInfo(data?.data?.metadata),
    enabled: !!projectId
  })

  return {
    outputData: data?.output,
    isSuccess,
    isLoading,
    refetch,
    alllDistributer: dataDistributer?.allDistributer,
    isSucessDistributer,
    isLoadingDistributer,
    projectInfo: dataProjectInfo?.project,
    isSuccessProjectInfo
  }
}

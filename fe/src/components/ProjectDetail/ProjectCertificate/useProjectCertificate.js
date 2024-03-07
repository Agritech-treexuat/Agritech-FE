import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import PROJECT from '../../../services/projectService'

export default function useProjectCertificate(projectId) {
  console.log('projectId: ', projectId)
  const parseData = useCallback((data) => {
    console.log('data: ', data)
    const certificateImages = data.map((item) => {
      return item
    })
    return { certificateImages }
  }, [])

  const { data, isSuccess, isLoading, refetch } = useQuery({
    queryKey: ['getCertificateImages', projectId],
    queryFn: () => PROJECT.getCertificateImages({ projectId }),
    staleTime: 20 * 1000,
    select: (data) => parseData(data?.data?.metadata),
    enabled: !!projectId
  })

  return {
    certificateImages: data?.certificateImages,
    isSuccess,
    isLoading,
    refetch
  }
}

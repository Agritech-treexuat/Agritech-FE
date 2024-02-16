import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import PROJECT from '../../services/projectService'
import { formatDateToInput } from '../../utils/helpers'

export default function useProjectList({ plantId }) {
  const farmId = localStorage.getItem('id')
  console.log('farm id: ', farmId)

  const parseData = useCallback((data) => {
    const projects = data.map((item) => {
      return {
        id: item?._id,
        title: item?.plant?.plant_name,
        plantId: item?.plant?._id,
        seed: item.seed ? item?.seed?.seed_name : 'basic',
        startDate: item?.startDate,
        image: item?.plant?.plant_thumb,
        square: item?.square,
        status: item?.status,
        description:
          item?.description ||
          `Đây là dự án được khởi tạo vào ngày ${formatDateToInput(item?.startDate)}, cho ${
            item?.plant?.plant_name
          } với hạt giống là ${item?.seed?.seed_name}`
      }
    })

    return {
      projects
    }
  }, [])

  const { data, isSuccess, isLoading, refetch } = useQuery({
    queryKey: ['projects', farmId],
    queryFn: () => PROJECT.getProjects(farmId),
    staleTime: 20 * 1000,
    select: (data) => parseData(data.data.metadata),
    enabled: !!farmId
  })

  return {
    projects: data?.projects || [],
    isSuccess,
    isLoading,
    refetch
  }
}

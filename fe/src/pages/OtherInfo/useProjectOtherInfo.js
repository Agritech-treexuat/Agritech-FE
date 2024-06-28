import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import PROJECT from '../../services/projectService'
import CAMERA from '../../services/cameraService'

export default function useProjectOtherInfo({ selectedTime }) {
  const farmId = localStorage.getItem('id')

  const parseData = useCallback((data) => {
    console.log('data: ', data)
    const weatherData = {
      description: data?.description,
      temp: data?.temp,
      humidity: data?.humidity,
      windSpeed: data?.windSpeed
    }
    return {
      weatherData
    }
  }, [])

  const {
    data,
    isSuccess: isSuccessWeather,
    isLoading: isLoadingWeather,
    isError: isErrorWeather,
    refetch: refetchWeather
  } = useQuery({
    queryKey: ['projectWeather', selectedTime],
    queryFn: () => PROJECT.getWeatherByTime({ time: selectedTime }),
    staleTime: 20 * 1000,
    select: (data) => parseData(data?.data?.metadata),
    enabled: !!selectedTime
  })

  const parseDataCamera = useCallback((data) => {
    const allCameraData = data.map((camera) => {
      return {
        _id: camera?._id,
        name: camera?.name,
        rtsp_link: camera?.rtsp_link,
        isDeleted: camera?.isDeleted,
      }
    })

    const cameraData = allCameraData.filter((camera) => !camera.isDeleted)

    return {
      cameraData
    }
  }, [])

  const {
    data: cameraData,
    isSuccess: isSuccessCamera,
    isLoading: isLoadingCamera,
    isError: isErrorCamera,
    refetch: refetchCamera
  } = useQuery({
    queryKey: ['farmCamera', farmId],
    queryFn: () => CAMERA.getCamerasInFarm({ farmId }),
    staleTime: 20 * 1000,
    select: (data) => parseDataCamera(data?.data?.metadata),
    enabled: !!farmId
  })

  return {
    weatherData: data?.weatherData,
    isSuccessWeather,
    isLoadingWeather,
    refetchWeather,
    isErrorWeather,
    cameraData: cameraData?.cameraData,
    isSuccessCamera,
    isLoadingCamera,
    refetchCamera,
    isErrorCamera
  }
}

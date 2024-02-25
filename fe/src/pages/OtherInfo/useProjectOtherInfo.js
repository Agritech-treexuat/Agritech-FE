import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import PROJECT from '../../services/projectService'

export default function useProjectOtherInfo({ selectedTime }) {
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

  return {
    weatherData: data?.weatherData,
    isSuccessWeather,
    isLoadingWeather,
    refetchWeather,
    isErrorWeather
  }
}

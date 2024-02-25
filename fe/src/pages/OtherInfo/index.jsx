import React, { useState } from 'react'
import { DatePicker, Spin, Alert } from 'antd'
import useProjectOtherInfo from './useProjectOtherInfo'
import dayjs from 'dayjs'

const OtherInfo = () => {
  const [selectedTime, setSelectedTime] = useState(dayjs(new Date()))
  const { weatherData, isSuccessWeather, isLoadingWeather, isErrorWeather } = useProjectOtherInfo({
    selectedTime: selectedTime
  })

  const handleDateChange = (date) => {
    if (date) {
      setSelectedTime(date.toDate().toUTCString())
    }
  }

  return (
    <div>
      <h2>Hãy chọn thời gian để xem thông tin tương ứng</h2>
      <DatePicker defaultValue={selectedTime} onChange={handleDateChange} showTime />
      <h2>Thông tin thời tiết</h2>
      {isLoadingWeather && <Spin />}
      {isErrorWeather && <Alert message="Lỗi khi load thông tin thời tiết" type="error" />}
      {isSuccessWeather &&
        (weatherData.description ? (
          <div>
            <p>Mô tả: {weatherData.description}</p>
            <p>Nhiệt độ: {weatherData.temp}°C</p>
            <p>Độ ẩm: {weatherData.humidity}%</p>
            <p>Tốc độ gió: {weatherData.windSpeed} km/h</p>
          </div>
        ) : (
          <p>Không có dữ liệu</p>
        ))}
      <h2>Thông tin hình ảnh từ camera</h2>
    </div>
  )
}

export default OtherInfo

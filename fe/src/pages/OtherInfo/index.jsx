import React, { useState } from 'react'
import { DatePicker, Spin, Alert, Button, notification } from 'antd'
import useProjectOtherInfo from './useProjectOtherInfo'
import AddCameraModal from './AddCameraModal'
import dayjs from 'dayjs'
import CAMERA from '../../services/cameraService'
import { metamaskWallet } from '@thirdweb-dev/react'
import { useStateContext } from '../../context'

const metamaskConfig = metamaskWallet()

const OtherInfo = () => {
  const { address, connect, addCamera } = useStateContext()
  const [loading, setLoading] = useState(false)
  const [selectedTime, setSelectedTime] = useState(dayjs(new Date()))
  const [modalVisible, setModalVisible] = useState(false)
  const [api, contextHolder] = notification.useNotification()
  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5
    })
  }
  const {
    weatherData,
    isSuccessWeather,
    isLoadingWeather,
    isErrorWeather,
    isSuccessCamera,
    refetchCamera,
    isLoadingCamera,
    cameraData
  } = useProjectOtherInfo({
    selectedTime: selectedTime
  })

  const handleDateChange = (date) => {
    if (date) {
      setSelectedTime(date.toDate().toUTCString())
    }
  }

  const handleAddCamera = async (values) => {
    console.log(values)
    setLoading(true)
    try {
      const receip = await addCamera()
      const txHash = receip.transactionHash
      if (!txHash) {
        openNotificationWithIcon('error', 'Thông báo', 'Khởi tạo thất bại ')
        setLoading(false)
        return
      }
      const cameraIndex = receip.events[0].args[0].toNumber()
      const res = await CAMERA.createCamera({
        data: {
          name: values.name,
          rtsp_link: values.rtsp_link,
          tx: txHash,
          cameraIndex: cameraIndex
        }
      })
      setLoading(false)
      if (res.status === 200) {
        openNotificationWithIcon('success', 'Thêm camera thành công', 'Thêm camera thành công')
        refetchCamera()
      } else {
        openNotificationWithIcon('error', 'Thêm camera thất bại', 'Thêm camera thất bại')
      }
    } catch (error) {
      setLoading(false)
      openNotificationWithIcon('error', 'Thêm camera thất bại', 'Thêm camera thất bại')
      console.log(error)
    }
  }

  return (
    <div>
      {contextHolder}
      <Spin spinning={loading} tip="Đang ghi lên Blockchain, làm ơn chờ chút ...">
        <div>
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
          </div>
          <h2>Thông tin hình ảnh từ camera</h2>
          <Button
            type="primary"
            onClick={async () => {
              if (!address) await connect(metamaskConfig)
              else setModalVisible(true)
            }}
          >
            {address ? 'Thêm camera' : 'Kết nối với ví để  thêm camera'}
          </Button>
          <AddCameraModal visible={modalVisible} onCancel={() => setModalVisible(false)} onSubmit={handleAddCamera} />{' '}
          {/* Modal thêm camera */}
          {isLoadingCamera ? (
            <Spin />
          ) : isSuccessCamera ? (
            <div>
              {cameraData.map((camera, index) => (
                <div key={index}>
                  <p>Tên: {camera.name}</p>
                  <p>RTSP Link: {camera.rtsp_link}</p>
                </div>
              ))}
            </div>
          ) : (
            <Alert message="Lỗi khi load thông tin camera" type="error" />
          )}
        </div>
      </Spin>
    </div>
  )
}

export default OtherInfo

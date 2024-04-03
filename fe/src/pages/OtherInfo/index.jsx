import React, { useState } from 'react'
import { DatePicker, Spin, Alert, Button, notification, List, Card, Row, Col, Popconfirm } from 'antd'
import useProjectOtherInfo from './useProjectOtherInfo'
import AddCameraModal from './AddCameraModal'
import dayjs from 'dayjs'
import CAMERA from '../../services/cameraService'
import { metamaskWallet } from '@thirdweb-dev/react'
import { useStateContext } from '../../context'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

const metamaskConfig = metamaskWallet()

const CameraList = ({ cameraData, handleCameraSelect, selectedCamera, handleEditCamera, handleDeleteCamera }) => {
  return (
    <List
      dataSource={cameraData}
      renderItem={(camera, index) => (
        <List.Item
          key={index}
          onClick={() => handleCameraSelect(camera)}
          style={{
            cursor: 'pointer',
            background: camera === selectedCamera ? '#f0f0f0' : 'transparent',
            padding: '10px',
            borderRadius: '5px'
          }}
          actions={[
            <EditOutlined
              key="edit"
              onClick={(e) => handleEditCamera(e, camera)}
              style={{ fontSize: '20px', color: 'blue', cursor: 'pointer' }}
            />,
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa camera này không?"
              onConfirm={() => handleDeleteCamera(camera)}
              onCancel={() => console.log('Cancel')}
              okText="Có"
              cancelText="Không"
            >
              <DeleteOutlined key="delete" style={{ fontSize: '20px', color: 'red', cursor: 'pointer' }} />
            </Popconfirm>
          ]}
        >
          <List.Item.Meta title={<p>Tên: {camera.name}</p>} description={<p>RTSP Link: {camera.rtsp_link}</p>} />
        </List.Item>
      )}
    />
  )
}

const VideoPlayer = ({ selectedCamera }) => {
  return (
    <Card title={selectedCamera ? selectedCamera.name : 'Chọn camera'}>
      {selectedCamera && (
        <video controls autoPlay>
          <source src={selectedCamera.rtsp_link} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </Card>
  )
}

const OtherInfo = () => {
  const { address, connect, addCamera } = useStateContext()
  const [loading, setLoading] = useState(false)
  const [loadingNotWriteBlockchain, setLoadingNotWriteBlockchain] = useState(false)
  const [updateCameraModalVisible, setUpdateCameraModalVisible] = useState(false)
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

  const [selectedCamera, setSelectedCamera] = useState(null)

  const [selectedUpdateCamera, setSelectedUpdateCamera] = useState(null)

  const handleCameraSelect = (camera) => {
    setSelectedCamera(camera)
  }

  const handleDateChange = (date) => {
    if (date) {
      setSelectedTime(date.toDate().toUTCString())
    }
  }

  const handleEditCamera = (e, camera) => {
    // Ngăn chặn sự kiện lan truyền lên cha
    e.stopPropagation()
    // Xử lý sự kiện chỉnh sửa camera ở đây
    console.log('Chỉnh sửa camera:', camera)
    setSelectedUpdateCamera(camera)
    // Hiển thị modal thêm camera
    setUpdateCameraModalVisible(true)
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

  const handleUpdateCamera = async (values) => {
    console.log(values)
    setLoadingNotWriteBlockchain(true)
    try {
      const res = await CAMERA.updateCamera({
        cameraId: selectedUpdateCamera._id,
        data: {
          name: values.name,
          rtsp_link: values.rtsp_link
        }
      })
      setLoadingNotWriteBlockchain(false)
      if (res.status === 200) {
        openNotificationWithIcon('success', 'Chỉnh sửa camera thành công', 'Chỉnh sửa camera thành công')
        refetchCamera()
      } else {
        openNotificationWithIcon('error', 'Chỉnh sửa camera thất bại', 'Chỉnh sửa camera thất bại')
      }
    } catch (error) {
      setLoadingNotWriteBlockchain(false)
      openNotificationWithIcon('error', 'Chỉnh sửa camera thất bại', 'Chỉnh sửa camera thất bại')
      console.log(error)
    }
  }

  const handleDeleteCamera = async (camera) => {
    console.log(camera)
    setLoadingNotWriteBlockchain(true)
    try {
      const res = await CAMERA.deleteCamera({
        cameraId: camera._id
      })
      setLoadingNotWriteBlockchain(false)
      if (res.status === 200) {
        openNotificationWithIcon('success', 'Xóa camera thành công', 'Xóa camera thành công')
        refetchCamera()
      } else {
        openNotificationWithIcon('error', 'Xóa camera thất bại', 'Xóa camera thất bại')
      }
    } catch (error) {
      setLoadingNotWriteBlockchain(false)
      openNotificationWithIcon('error', 'Xóa camera thất bại', 'Xóa camera thất bại')
      console.log(error)
    }
  }

  return (
    <div>
      {contextHolder}
      <Spin
        spinning={loading || loadingNotWriteBlockchain}
        tip={loading ? 'Đang ghi lên Blockchain, làm ơn chờ chút ...' : ''}
      >
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
          <AddCameraModal
            visible={updateCameraModalVisible}
            onCancel={() => setUpdateCameraModalVisible(false)}
            onSubmit={handleUpdateCamera}
            cameraItem={selectedUpdateCamera}
            isUpdate={true}
          />
          {isLoadingCamera ? (
            <Spin />
          ) : isSuccessCamera ? (
            <div style={{ marginTop: '10px' }}>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <CameraList
                    cameraData={cameraData}
                    handleCameraSelect={handleCameraSelect}
                    selectedCamera={selectedCamera}
                    handleEditCamera={handleEditCamera}
                    handleDeleteCamera={handleDeleteCamera}
                  />
                </Col>
                <Col span={16}>
                  <VideoPlayer selectedCamera={selectedCamera} />
                </Col>
              </Row>
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

import React, { useState } from 'react'
import { Modal, Input, Button, Card, Space, Row, Col } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import useAddPlantPopup from './useAddPlantPopup'
import Loading from '../../../pages/Loading'

const AddPlantPopup = ({ open, onClose, selectedPlant, setSelectedPlant, handleAddPlant }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState(null)
  const { allPlants, isSuccessAllPlants, plantInFarm, isSuccess } = useAddPlantPopup()

  const renderPlantType = (type) => {
    switch (type) {
      case 'herb':
        return 'Rau gia vị'
      case 'leafy':
        return 'Rau ăn lá'
      case 'root':
        return 'Củ'
      case 'fruit':
        return 'Quả'
      default:
        return type
    }
  }

  const handleSearch = (value) => {
    setSearchTerm(value)
  }

  const handleFilter = (type) => {
    setSelectedType(type)
  }

  const filteredPlants = allPlants.filter(
    (plant) =>
      (searchTerm === '' || plant.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedType === null || plant.type === selectedType) &&
      !plantInFarm.some((p) => p.name === plant.name)
  )

  return isSuccessAllPlants && isSuccess ? (
    <Modal
      open={open}
      title="Chọn cây"
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="add" type="primary" disabled={!selectedPlant} onClick={() => handleAddPlant(selectedPlant)}>
          Thêm
        </Button>
      ]}
    >
      <Input
        placeholder="Tìm kiếm theo tên cây"
        prefix={<SearchOutlined />}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      <Space>
        <Button
          onClick={() => handleFilter(null)}
          style={{ boxShadow: selectedType === null ? '0 0 1px 1px #1890ff' : '' }}
        >
          Tất cả
        </Button>
        <Button
          onClick={() => handleFilter('herb')}
          style={{ boxShadow: selectedType === 'herb' ? '0 0 1px 1px #1890ff' : '' }}
        >
          Rau gia vị
        </Button>
        <Button
          onClick={() => handleFilter('leafy')}
          style={{ boxShadow: selectedType === 'leafy' ? '0 0 1px 1px #1890ff' : '' }}
        >
          Rau ăn lá
        </Button>
        <Button
          onClick={() => handleFilter('root')}
          style={{ boxShadow: selectedType === 'root' ? '0 0 1px 1px #1890ff' : '' }}
        >
          Củ
        </Button>
        <Button
          onClick={() => handleFilter('fruit')}
          style={{ boxShadow: selectedType === 'fruit' ? '0 0 1px 1px #1890ff' : '' }}
        >
          Quả
        </Button>
      </Space>

      <Row gutter={16} style={{ marginTop: 16 }}>
        {filteredPlants.map((plant) => (
          <Col key={plant.id} span={6}>
            <Card
              hoverable
              style={{
                marginBottom: 16,
                cursor: 'pointer',
                border: selectedPlant === plant ? '2px solid #1890ff' : ''
              }}
              onClick={() => setSelectedPlant(plant)}
            >
              <img src={plant.image} alt={plant.name} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
              <p style={{ marginTop: 8 }}>{plant.name}</p>
              <p style={{ color: '#888' }}>{renderPlantType(plant.type)}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </Modal>
  ) : (
    <Loading />
  )
}

export default AddPlantPopup

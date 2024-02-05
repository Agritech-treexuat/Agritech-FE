import React from 'react'
import { useState } from 'react'
import { Row, Col, Input, Button } from 'antd'
import { Link } from 'react-router-dom'
import Loading from '../Loading'
import { Card } from 'antd'
import { AddPlantPopup } from '../../components'
import PLANT from '../../services/plantService'
import useManagePlant from './useManagePlant'
import AddTemplatePopup from '../../components/ManagePlant/AddTemplatePopup'

const { Meta } = Card
const ManagePlant = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const { plantData, isSuccess, isLoading, allPlantsData, isSuccess_2, isLoading_2, refetch } = useManagePlant()

  const filteredPlants =
    plantData && plantData.length !== 0
      ? plantData.filter((plant) => plant.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : []

  const [open, setOpen] = useState(false)
  const onCreate = (values) => {
    const recommentPlantId = values._id
    handleSubmitPlant(recommentPlantId)
  }

  const onCreateAddTemplatePopup = (values) => {
    
  }

  const handleSubmitPlant = async (recommentPlantId) => {
    try {
      const res = await PLANT.addPlantByRecommendPlantId(recommentPlantId)
      if (res.response && res.response?.data?.message === 'Plant already exists') {
        alert('Cây đã tồn tại')
      } else {
        refetch()
        setOpen(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <AddTemplatePopup
        open={open}
        onCreate={onCreateAddTemplatePopup}
        onCancel={() => {
          setOpen(false)
        }}
      />
      <Button
        type="primary"
        onClick={() => {
        setOpen(true)
        }}
        >
        Thêm template
      </Button>
      {isLoading && isLoading_2 && <Loading />}
      {
        <div>
          {isSuccess && isSuccess_2 && (
            <div>
              <h1>Danh sách các cây</h1>
              <Row>
                <Col span={8}>
                  <Input
                    placeholder="Tìm kiếm cây"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ marginBottom: '30px' }}
                  />
                </Col>
                <Col span={1}></Col>
                <Col span={6}>
                  <div>
                    <Button
                      type="primary"
                      onClick={() => {
                        setOpen(true)
                      }}
                    >
                      Thêm cây mới
                    </Button>
                    <AddPlantPopup
                      open={open}
                      onCreate={onCreate}
                      onCancel={() => {
                        setOpen(false)
                      }}
                      allPlants={allPlantsData}
                    />
                  </div>
                </Col>
              </Row>
              <Row className="plant-grid">
                {filteredPlants.map((plant) => (
                  <Col span={4} key={plant._id}>
                    <Link to={`/plant/${plant._id}`} key={plant._id}>
                      <Card
                        hoverable
                        style={{
                          width: 240
                        }}
                        cover={<img alt="plant" src={plant.image} />}
                      >
                        <Meta title={plant.name} />
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </div>
      }
    </>
  )
}

export default ManagePlant

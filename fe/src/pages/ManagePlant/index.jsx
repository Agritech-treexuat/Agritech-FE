import React from 'react'
import { useState, useEffect } from 'react'
import { Row, Col, Input, Button } from 'antd'
import { Link } from 'react-router-dom'
import Loading from '../Loading'
import { Card } from 'antd'
import { AddPlantPopup } from '../../components'
import FARM from '../../services/farmService'

const { Meta } = Card
const ManagePlant = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [plants, setPlants] = useState([])
  const [allPlants, setAllPlants] = useState([])

  const farmId = localStorage.getItem('id')

  useEffect(() => {
    async function fetchData() {
      const data = await FARM.getPlant(farmId)
      setPlants(data.data.plants)
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchData() {
      const data = await FARM.getAllPlant()
      setAllPlants(data.data.plants)
    }
    fetchData()
  }, [])

  const filteredPlants =
    plants.length !== 0 ? plants.filter((plant) => plant.name.toLowerCase().includes(searchQuery.toLowerCase())) : []

  const [open, setOpen] = useState(false)
  const onCreate = (values) => {
    const data = {
      plantId: values._id
    }
    handleSubmitPlant(data)
  }

  const handleSubmitPlant = async (data) => {
    try {
      const res = await FARM.addPlant(data)
      if (res.response && res.response.data.message === 'EXISTED_TREE') {
        alert('Cây đã tồn tại')
      } else {
        setPlants(res.data.plants)
        setOpen(false)
      }
    } catch (error) {
      console.error(error?.response?.data?.message)
    }
  }

  return (
    <div>
      {plants ? (
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
                  allPlants={allPlants}
                />
              </div>
            </Col>
          </Row>
          <Row className="plant-grid">
            {filteredPlants.map((plant) => (
              <Col span={4}>
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
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default ManagePlant

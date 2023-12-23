import React from 'react'
import { useState, useEffect } from 'react'
import { Row, Col, Input, Button, Flex } from 'antd'
import { Link } from 'react-router-dom'
import Loading from '../Loading'
import { Card } from 'antd'
import { AddPlantPopup } from '../../components'
import FARM from '../../services/farmService'
import { useParams } from 'react-router'

const { Meta } = Card
const ManagePlant = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [plants, setPlants] = useState([])
  const [allPlants, setAllPlants] = useState([])

  // const [plants, setPlants] = useState([])
  const farmId = localStorage.getItem('id')

  useEffect(() => {
    async function fetchData() {
      const data = await FARM.getPlant(farmId)
      console.log('Data plant: ', data)
      setPlants(data.data.plants)
    }
    fetchData()
    console.log('Output data: ', plants)
  }, [])

  useEffect(() => {
    async function fetchData() {
      const data = await FARM.getAllPlant()
      console.log('Data: ', data.data)
      setAllPlants(data.data.plants)
    }
    fetchData()
    console.log('Output data: ', allPlants)
  }, [])

  const filteredPlants =
    plants.length != 0 ? plants.filter((plant) => plant.name.toLowerCase().includes(searchQuery.toLowerCase())) : []

  const [open, setOpen] = useState(false)
  const onCreate = (values) => {
    console.log('Received values of form: ', values)
    const data = {
      plantId: values._id
    }
    handleSubmitPlant(data)
  }

  const handleSubmitPlant = async (data) => {
    try {
      console.log('data to send: ', data)
      const res = await FARM.addPlant(data)
      console.log('res: ', res)
      if (res.response && res.response.data.message == 'EXISTED_TREE') {
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
          <h1>Plant List</h1>
          <Row>
            <Col span={8}>
              <Input
                placeholder="Search plants"
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
                    cover={<img alt="example" src={plant.image} />}
                  >
                    <Meta title={plant.name} description="www.instagram.com" />
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

import React from 'react'
import { useState } from 'react';
import {Row, Col, Input, Button, Flex} from 'antd'
import { Link } from 'react-router-dom';
import Loading from '../Loading';
import { Card } from 'antd';
import { AddPlantPopup } from '../../components';
const { Meta } = Card;
const ManagePlant = () => {
  const [searchQuery, setSearchQuery] = useState('');
  // const [plants, setPlants] = useState([])
  const farmId = localStorage.getItem('id')

  const plants = [
    {
      "id": "01",
      "name": "Rau cau",
      "image": "https://www.thuocdantoc.org/wp-content/uploads/2019/11/rau-cai-canh.jpg"
    },
    {
      "id": "02",
      "name": "Rau 2",
      "image": "https://www.thuocdantoc.org/wp-content/uploads/2019/11/rau-cai-canh.jpg"
    },
    {
      "id": "03",
      "name": "Rau 3",
      "image": "https://www.thuocdantoc.org/wp-content/uploads/2019/11/rau-cai-canh.jpg"
    },
    {
      "id": "04",
      "name": "Rau 4",
      "image": "https://st.quantrimang.com/photos/image/2020/11/11/rau-cai-2.jpg"
    },
    {
      "id": "05",
      "name": "Rau 5",
      "image": "https://st.quantrimang.com/photos/image/2020/11/11/rau-cai-1.jpg"
    },
    {
      "id": "06",
      "name": "Rau 6",
      "image": "https://st.quantrimang.com/photos/image/2020/11/11/rau-cai-1.jpg"
    },
    {
      "id": "07",
      "name": "Rau 7",
      "image": "https://st.quantrimang.com/photos/image/2020/11/11/rau-cai-1.jpg"
    },
    {
      "id": "08",
      "name": "Rau 8",
      "image": "https://st.quantrimang.com/photos/image/2020/11/11/rau-cai-1.jpg"
    }
  ]
  const allPlants = [
    {
    "id": "01",
    "name": "Rau cau",
    "image": "https://www.thuocdantoc.org/wp-content/uploads/2019/11/rau-cai-canh.jpg"
  },
  {
    "id": "02",
    "name": "Rau 2",
    "image": "https://www.thuocdantoc.org/wp-content/uploads/2019/11/rau-cai-canh.jpg"
  },
  {
    "id": "03",
    "name": "Rau 3",
    "image": "https://www.thuocdantoc.org/wp-content/uploads/2019/11/rau-cai-canh.jpg"
  },
  {
    "id": "04",
    "name": "Rau 4",
    "image": "https://st.quantrimang.com/photos/image/2020/11/11/rau-cai-2.jpg"
  },
  {
    "id": "05",
    "name": "Rau 5",
    "image": "https://st.quantrimang.com/photos/image/2020/11/11/rau-cai-1.jpg"
  },
  {
    "id": "06",
    "name": "Rau 6",
    "image": "https://st.quantrimang.com/photos/image/2020/11/11/rau-cai-1.jpg"
  },
  {
    "id": "07",
    "name": "Rau 7",
    "image": "https://st.quantrimang.com/photos/image/2020/11/11/rau-cai-1.jpg"
  },
  {
    "id": "08",
    "name": "Rau 8",
    "image": "https://st.quantrimang.com/photos/image/2020/11/11/rau-cai-1.jpg"
  }
  ]
  const filteredPlants = plants.length != 0 ? plants.filter((plant) =>
    plant.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const [open, setOpen] = useState(false);
  const onCreate = (values) => {
    console.log('Received values of form: ', values);
    setOpen(false);
  };


  return (
    <div>
      {plants ?
      (<div>
        <h1>Plant List</h1>
        <Row>
          <Col span={8}>
          <Input placeholder="Search plants" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{marginBottom: "30px"}}/>
          </Col>
          <Col span={1}></Col>
          <Col span={6}>
          <div>
            <Button
              type="primary"
              onClick={() => {
                setOpen(true);
              }}
            >
              Thêm cây mới
            </Button>
            <AddPlantPopup
              open={open}
              onCreate={onCreate}
              onCancel={() => {
                setOpen(false);
              }}
              allPlants={allPlants}
            />
          </div>
        </Col>
        </Row>
        <Row className="plant-grid">
          {filteredPlants.map((plant) => (
            <Col span={4}>
              <Link to={`/plant/${plant.id}`} key={plant.id}>
                <Card
                  hoverable
                  style={{
                    width: 240,
                  }}
                  cover={<img alt="example" src={plant.image} />}
                >
                  <Meta title={plant.name} description="www.instagram.com" />
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
    </div>) : <Loading />
      }
    </div>
  );
}

export default ManagePlant

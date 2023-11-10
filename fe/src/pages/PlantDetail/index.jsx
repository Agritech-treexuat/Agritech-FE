import React, { useState, useEffect } from 'react';
import { Collapse, Button, Input, Card, Divider } from 'antd';
import { useParams } from 'react-router-dom';
import FARM from '../../services/farmService';
import Loading from '../Loading';

const { Panel } = Collapse;

const data = [
  {
    seed: {
      id: '1',
      name: 'Seed 1',
    },
    plantCultivates: [
      {
        id: '1',
        amount_per_kg: 5,
        time: '2023-10-01',
        note: 'Note 1',
      },
      {
        id: '2',
        amount_per_kg: 10,
        time: '2023-10-05',
        note: 'Note 2',
      },
    ],
  },
  {
    seed: {
      id: '2',
      name: 'Seed 2',
    },
    plantCultivates: [
      {
        id: '3',
        amount_per_kg: 7,
        time: '2023-10-10',
        note: 'Note 3',
      },
      {
        id: '4',
        amount_per_kg: 12,
        time: '2023-10-15',
        note: 'Note 4',
      },
    ],
  },
  // Add more data as needed
];

const PlantDetail = () => {
  const [search, setSearch] = useState('');
  const params = useParams();
  console.log("params:" , params)
  const farmId = localStorage.getItem('id')
  const [plans, setPlans] = useState([])

  useEffect(() => {
    async function fetchData() {
      const data = await FARM.getPlans(farmId, params.id)
      console.log("Data plant: ", data)
      if(data.data)
        setPlans(data.data.plans)
    }
    fetchData();
    console.log("Output data: ", plans)
  }, []);

  return (
    <div>
      {plans ? <>
        <h1>Thông tin cây trồng {params.id}</h1>
          <Input
            placeholder="Tìm kiếm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '200px', marginBottom: '16px' }}
          />
          <Button type="primary" style={{ marginLeft: '16px' }}>
            Tạo mới
          </Button>
          {plans.map((item) => (
            <Card style={{ marginTop: '16px' }}>
              <h2>{item.seed}</h2>
              <Collapse>
              <Panel
                    header='Quy trình chi tiết'
                  >
                    <Button type="primary">Chỉnh sửa</Button>
                {item.plan.map((cultivate) => (
                  <>
                  <Divider><h3>Time: {cultivate.time}</h3></Divider>
                  <h3>Note: {cultivate.note}</h3>
                  <h3>Type: {cultivate.cultivativeItems[0].type}</h3>
                    {cultivate.cultivativeItems.map((cultivativeItem) => (
                      <>
                      <Divider></Divider>
                        <p>Name: {cultivativeItem.name}</p>
                        <p>Amount per ha: {cultivativeItem.amount_per_ha}</p>
                      </>
                    ))}
                  </>
                ))}
                </Panel>
              </Collapse>
            </Card>
          ))}
      </> : <Loading />}
    </div>
  );
};

export default PlantDetail;

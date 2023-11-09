import React, { useState } from 'react';
import { Collapse, Button, Input, Card, Divider } from 'antd';
import { useParams } from 'react-router-dom';

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

  return (
    <div>
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
      {data.map((item) => (
        <Card key={item.seed.id} style={{ marginTop: '16px' }}>
          <h2>{item.seed.name}</h2>
          <Collapse>
          <Panel
                header={`Seed ${item.seed.name}`}
              >
                <Button type="primary">Chỉnh sửa</Button>
            {item.plantCultivates.map((cultivate) => (
              <>
                <Divider></Divider>
                <p>Amount per kg: {cultivate.amount_per_kg}</p>
                <p>Time: {cultivate.time}</p>
                <p>Note: {cultivate.note}</p>
              </>
            ))}
            </Panel>
          </Collapse>
        </Card>
      ))}
    </div>
  );
};

export default PlantDetail;

import React, { useState, useEffect } from 'react';
import { Collapse, Button, Input, Card, Divider } from 'antd';
import { useParams } from 'react-router-dom';
import FARM from '../../services/farmService';
import Loading from '../Loading';
import AddPlanPopup from '../../components/ManagePlant/AddPlanPopup';
import AddTemplatePopup from '../../components/ManagePlant/AddTemplatePopup';

const { Panel } = Collapse;

const PlantDetail = () => {
  const [search, setSearch] = useState('');
  const params = useParams();
  console.log("params:" , params)
  const farmId = localStorage.getItem('id')
  const [plans, setPlans] = useState([])
  const [allSeedByPlant, setAllSeedByPlant] = useState([])

  const [open, setOpen] = useState(false);
  const [openTemplate, setOpenTemplate] = useState(false);
  const onCreate = (values) => {
    console.log('Received values of form: ', values);
    setOpen(false);
    if(values.template == 'none'){
      // do something
    } else {
      // load template
    }
    setOpenTemplate(true)
  };

  const onCreateTemplate = (values) => {
    console.log('Received values of form: ', values);

    setOpenTemplate(false)
  };

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

  useEffect(() => {
    async function fetchData() {
      const data = await FARM.getAllSeedByPlantId(params.id)
      console.log("Data plant: ", data)
      if(data.data)
        setAllSeedByPlant(data.data.seeds)
    }
    fetchData();
    console.log("Output data: ", allSeedByPlant)
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
          <div>
            <Button
              type="primary"
              onClick={() => {
                setOpen(true);
              }}
            >
              New Collection
            </Button>
            <AddPlanPopup
              open={open}
              onCreate={onCreate}
              onCancel={() => {
                setOpen(false);
              }}
              allSeedByPlant={allSeedByPlant}
            />
            <AddTemplatePopup
              open={openTemplate}
              onCreate={onCreateTemplate}
              onCancel={() => {
                setOpenTemplate(false);
              }}
            />
          </div>
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

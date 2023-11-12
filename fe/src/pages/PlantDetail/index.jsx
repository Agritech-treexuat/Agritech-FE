import React, { useState, useEffect } from 'react';
import { Collapse, Button, Input, Card, Divider } from 'antd';
import { useParams } from 'react-router-dom';
import FARM from '../../services/farmService';
import Loading from '../Loading';
import AddPlanPopup from '../../components/ManagePlant/AddPlanPopup';
import AddTemplatePopup from '../../components/ManagePlant/AddTemplatePopup';
import UpdateTemplatePopup from '../../components/ManagePlant/UpdateTemplatePopup';

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
  const [openUpdateTemplate, setOpenUpdateTemplate] = useState(false);
  const [defaultTemplate, setDefaultTemplate] = useState([])
  const [seed, setSeed] = useState(null)
  const [fetilizer, setFetilizer] = useState([])
  const [BVTV, setBVTV] = useState([])

  const onCreate = async (values) => {
    console.log('Received values of form: ', values);
    setOpen(false);
    if(values.template == 'default'){
      await loadDefaultTemplate(values.seed)
    } else {
      setDefaultTemplate([])
    }
    setSeed(values.seed)
    loadCultivates()
    setOpenTemplate(true)
  };

  const onCreateTemplate = (values) => {
    console.log('Received values of form 2: ', values);
    const data = {
      plantId: params.id,
      seed: seed,
      plan: values.items
    }
    submitTemplate(data)
    setOpenTemplate(false)
  };

  const onUpdateTemplate = (values, plantCultivateId) => {
    console.log('Received values of form 23 ', values);
    const data = {
      plantCultivateId: plantCultivateId,
      plan: values.items
    }
    console.log("data to send: ", data)
    updateTemplate(data)
    setOpenUpdateTemplate(false)
  };

  const loadDefaultTemplate = async (seed) => {
    const data = await FARM.getPlanFromSeed(seed)
    console.log("data: ", data)
    setDefaultTemplate(data.data.plantCultivates.plan)
  }

  const loadCultivates = async () => {
    const data = await FARM.getCultivative()
    const fetilizer = [];
    const BVTV = [];

    data.data.cultivatives.forEach(cultivative => {
      if (cultivative.type === 'phân bón') {
        fetilizer.push(cultivative);
      } else if (cultivative.type === 'BVTV') {
        BVTV.push(cultivative);
      }
    });

    setFetilizer(fetilizer)
    setBVTV(BVTV)
    console.log("cul: ", fetilizer, BVTV)
  }

  const submitTemplate = async (data) => {
    const new_data = await FARM.addPlantCultivates(data)
    const newPlans = [...plans, new_data.data.plantCultivate]
    setPlans(newPlans)
  }

  const updateTemplate = async (data) => {
    const new_data = await FARM.updatePlantCultivates(data)
    const newPlans = plans.map((item) =>
      item._id === new_data.data.plantCultivate._id ? new_data.data.plantCultivate : item
    )
    setPlans(newPlans)
  }
  useEffect(() => {
    async function fetchData() {
      const data = await FARM.getPlans(farmId, params.id)
      console.log("Data plant new: ", data)
      if(data.data)
        setPlans(data.data.plantCultivates)
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
              defaultTemplate={defaultTemplate}
              fetilizer={fetilizer}
              BVTV={BVTV}
            />
          </div>
          {plans.map((item) => (
            <Card style={{ marginTop: '16px' }}>
              <h2>{item.seed}</h2>
              <Collapse>
              <Panel
                    header='Quy trình chi tiết'
                  >
                    <Button
                      type="primary"
                      onClick={() => {
                        loadCultivates();
                        setOpenUpdateTemplate(true);
                      }}
                    >
                      Update
                    </Button>
                    <UpdateTemplatePopup
                      open={openUpdateTemplate}
                      onCreate={onUpdateTemplate}
                      onCancel={() => {
                        setOpenUpdateTemplate(false);
                      }}
                      template={item.plan}
                      fetilizer={fetilizer}
                      BVTV={BVTV}
                      plantCultivateId={item._id}
                    />
                {item.plan.map((cultivate) => (
                  <>
                  <Divider><h3>Time: {cultivate.time}</h3></Divider>
                  <h3>Note: {cultivate.note}</h3>
                  <h3>Type: {cultivate.type}</h3>
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

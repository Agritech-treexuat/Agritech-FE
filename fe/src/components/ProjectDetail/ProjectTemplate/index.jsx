import React, { useEffect, useState } from 'react'
import { Collapse, Button, Input, Card, Divider } from 'antd';
import FARM from '../../../services/farmService';
import { useParams } from 'react-router-dom';
import AddPlanProjectPopup from './AddPlanProjectPopup';
import AddTemplateProjectPopup from './AddTemplateProjectPopup';
import AddTemplatePopup from '../../ManagePlant/AddTemplatePopup'
import UpdateTemplateProjectPopup from './UpdateTemplateProjectPopup';
import { ConsoleSqlOutlined } from '@ant-design/icons';
const { Panel } = Collapse;

const ProjectTemplate = () => {
  const params = useParams()
  const [search, setSearch] = useState('');
  console.log("params:" , params)
  const farmId = localStorage.getItem('id')
  const [projectTemplate, setProjectTemplate] = useState([])
  const [plans, setPlans] = useState([])
  const [allSeedByPlant, setAllSeedByPlant] = useState([])

  const [open, setOpen] = useState(false);
  const [openTemplate, setOpenTemplate] = useState(false);
  const [openUpdateTemplate, setOpenUpdateTemplate] = useState(false);
  const [defaultTemplate, setDefaultTemplate] = useState([])
  const [fetilizer, setFetilizer] = useState([])
  const [BVTV, setBVTV] = useState([])
  console.log("prj: ", projectTemplate)

  const onCreate = async (values) => {
    console.log('Received values of form: ', values);
    setOpen(false);
    if(values.template == 'default'){
      // load from farm admin
      loadDefaultTemplate('seed rau cai A')
    } else if(values.template == 'farm') {
      // load from farm
      loadFarmTemplate('seed rau cai A')
    }
    else {
      setDefaultTemplate([])
    }
    loadCultivates()
    setOpenTemplate(true)
  };

  const onCreateTemplate = (values) => {
    console.log('Received values of form 2: ', values);
    const data = {
      plan: values.items
    }

    submitTemplate(data, params.id)
    setOpenTemplate(false)
  };

  const onUpdateTemplate = (values, plantCultivateId) => {
    console.log('Received values of form 23 ', values);
    // console.log("data to send: ", data)
    // updateTemplate(data)
    setOpenUpdateTemplate(false)
  };

  const loadDefaultTemplate = async (seed) => {
    const data = await FARM.getPlanFromSeed('654a33952ad2c3b38560ce52', seed)
    console.log("data: ", data)
    setDefaultTemplate(data.data.plantCultivates.plan)
  }

  const loadFarmTemplate = async (seed) => {
    const data = await FARM.getPlanFromSeed(farmId, seed)
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

  const submitTemplate = async (data, projectId) => {
    const new_data = await FARM.addPlantCultivatesToProject(data, projectId)
    console.log("new data: ", new_data.data.updatedProjectPlan)
    setProjectTemplate(new_data.data.updatedProjectPlan)
    console.log("new prj t: ", projectTemplate)
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
      const data = await FARM.getPlanFromProject(params.id)
      if(data.data) {
        console.log("Data here: ", data.data.plan)
        setProjectTemplate([...data.data.plan])
      }
    }
    fetchData();
    console.log("heree: ", projectTemplate)

  }, []);

  return (
    <>
    <div>
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
        }}
      >
        New Collection
      </Button>
      <AddPlanProjectPopup
        open={open}
        onCreate={onCreate}
        onCancel={() => {
          setOpen(false);
        }}
        allSeedByPlant={allSeedByPlant}
      />
      <AddTemplateProjectPopup
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
    {projectTemplate? <h1>Khong co</h1> :
    <Card style={{ marginTop: '16px' }}>
              <Collapse>
              <Panel
                    header='Quy trình chi tiết'
                  >
                    {/* <Button
                      type="primary"
                      onClick={() => {
                        loadCultivates();
                        setOpenUpdateTemplate(true);
                      }}
                    >
                      Update
                    </Button> */}
                    {/* <UpdateTemplateProjectPopup
                      open={openUpdateTemplate}
                      onCreate={onUpdateTemplate}
                      onCancel={() => {
                        setOpenUpdateTemplate(false);
                      }}
                      template={projectTemplate}
                      fetilizer={fetilizer}
                      BVTV={BVTV}
                    /> */}
                {projectTemplate.map((cultivate) => (
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
}
    </>
  )
}

export default ProjectTemplate
import React, { useEffect, useState } from 'react'
import { Collapse, Button, Input, Card, Divider } from 'antd'
import FARM from '../../../services/farmService'
import { useParams } from 'react-router-dom'
import AddPlanProjectPopup from './AddPlanProjectPopup'
import AddTemplateProjectPopup from './AddTemplateProjectPopup'
import AddTemplatePopup from '../../ManagePlant/AddTemplatePopup'
import UpdateTemplateProjectPopup from './UpdateTemplateProjectPopup'
import { ConsoleSqlOutlined } from '@ant-design/icons'
const { Panel } = Collapse

const ProjectTemplate = () => {
  const params = useParams()
  const [search, setSearch] = useState('')
  console.log('params:', params)
  const farmId = localStorage.getItem('id')
  const [projectTemplate, setProjectTemplate] = useState([])
  const [plans, setPlans] = useState([])
  const [allSeedByPlant, setAllSeedByPlant] = useState([])

  const [open, setOpen] = useState(false)
  const [openTemplate, setOpenTemplate] = useState(false)
  const [openUpdateTemplate, setOpenUpdateTemplate] = useState(false)
  const [defaultTemplate, setDefaultTemplate] = useState([])
  const [fetilizer, setFetilizer] = useState([])
  const [BVTV, setBVTV] = useState([])
  console.log('prj: ', projectTemplate)

  const onCreate = async (values) => {
    console.log('Received values of form: ', values)
    setOpen(false)
    if (values.template == 'default') {
      // load from farm admin
      loadDefaultTemplate('seed rau cai A')
    } else if (values.template == 'farm') {
      // load from farm
      loadFarmTemplate('seed rau cai A')
    } else {
      setDefaultTemplate([])
    }
    loadCultivates()
    setOpenTemplate(true)
  }

  const onCreateTemplate = (values) => {
    console.log('Received values of form 2: ', values)
    const data = {
      plan: values.items
    }

    submitTemplate(data, params.id)
    setOpenTemplate(false)
  }

  const onUpdateTemplate = (values, plantCultivateId) => {
    console.log('Received values of form 23 ', values)
    const data = {
      plan: values.items
    }
    // console.log("data to send: ", data)
    updateTemplate(data, params.id)
    setOpenUpdateTemplate(false)
  }

  const loadDefaultTemplate = async (seed) => {
    const data = await FARM.getPlanFromSeed('65746f46f0640f51f585bb07', seed)
    console.log('data default: ', data)
    setDefaultTemplate(data.data.plantFarming.plan)
  }

  const loadFarmTemplate = async (seed) => {
    const data = await FARM.getPlanFromSeed(farmId, seed)
    console.log('data: ', data)
    setDefaultTemplate(data.data.plantFarming.plan)
  }

  const loadCultivates = async () => {
    const data = await FARM.getCultivative()
    const fetilizer = []
    const BVTV = []

    data.data.cultivatives.forEach((cultivative) => {
      if (cultivative.type === 'phân bón') {
        fetilizer.push(cultivative)
      } else if (cultivative.type === 'BVTV') {
        BVTV.push(cultivative)
      }
    })

    setFetilizer(fetilizer)
    setBVTV(BVTV)
    console.log('cul: ', fetilizer, BVTV)
  }

  const submitTemplate = async (data, projectId) => {
    const new_data = await FARM.addPlantCultivatesToProject(data, projectId)
    console.log('new data: ', new_data.data.updatedProjectPlan)
    setProjectTemplate(new_data.data.updatedProjectPlan)
    console.log('new prj t: ', projectTemplate)
  }

  const updateTemplate = async (data, projectId) => {
    console.log('data send: ', data)
    const new_data = await FARM.updatePlantCultivatesToProject(data, projectId)
    console.log('res new data: ', new_data)
    // const newPlans = plans.map((item) =>
    //   item._id === new_data.data.plantFarming._id ? new_data.data.plantFarming : item
    // )
    // setPlans(newPlans)
    setProjectTemplate(new_data.data.updatedProjectPlan)
  }

  useEffect(() => {
    async function fetchData() {
      const data = await FARM.getPlanFromProject(params.id)
      if (data.data) {
        console.log('Data here: ', data.data.plan)
        setProjectTemplate([...data.data.plan])
      }
    }
    fetchData()
    console.log('heree: ', projectTemplate)
  }, [])

  return (
    <>
      <div>
        <Button
          type="primary"
          onClick={() => {
            setOpen(true)
          }}
          // disabled={projectTemplate? true: false}
        >
          New Collection
        </Button>
        <AddPlanProjectPopup
          open={open}
          onCreate={onCreate}
          onCancel={() => {
            setOpen(false)
          }}
          allSeedByPlant={allSeedByPlant}
        />
        <AddTemplateProjectPopup
          open={openTemplate}
          onCreate={onCreateTemplate}
          onCancel={() => {
            setOpenTemplate(false)
          }}
          defaultTemplate={defaultTemplate}
          fetilizer={fetilizer}
          BVTV={BVTV}
        />
      </div>
      {projectTemplate ? (
        <Card style={{ marginTop: '16px' }}>
          <Button
            type="primary"
            onClick={() => {
              loadCultivates()
              setOpenUpdateTemplate(true)
            }}
          >
            Update
          </Button>
          <UpdateTemplateProjectPopup
            open={openUpdateTemplate}
            onCreate={onUpdateTemplate}
            onCancel={() => {
              setOpenUpdateTemplate(false)
            }}
            template={projectTemplate}
            fetilizer={fetilizer}
            BVTV={BVTV}
          />
          {projectTemplate.map((cultivate) => (
            <>
              <Divider>
                <h3>Time: {cultivate.time}</h3>
              </Divider>
              <h3>Note: {cultivate.note}</h3>
              <h3>Type: {cultivate.type}</h3>
              {cultivate.agroChemicalItems.map((cultivativeItem) => (
                <>
                  <Divider></Divider>
                  <p>Name: {cultivativeItem.name}</p>
                  <p>Amount per ha: {cultivativeItem.amountPerHa}</p>
                </>
              ))}
            </>
          ))}
        </Card>
      ) : (
        <h1>Khong co</h1>
      )}
    </>
  )
}

export default ProjectTemplate

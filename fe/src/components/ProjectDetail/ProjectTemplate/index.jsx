import React, { useEffect, useState } from 'react'
import { Button, Card, Divider } from 'antd'
import FARM from '../../../services/farmService'
import { useParams } from 'react-router-dom'
import AddPlanProjectPopup from './AddPlanProjectPopup'
import AddTemplateProjectPopup from './AddTemplateProjectPopup'
import UpdateTemplateProjectPopup from './UpdateTemplateProjectPopup'
import { constants } from '../../../utils/constant'

const ProjectTemplate = () => {
  const adminId = constants.ADMIN_ID
  const params = useParams()
  const farmId = localStorage.getItem('id')
  const [projectTemplate, setProjectTemplate] = useState([])
  const [allSeedByPlant, setAllSeedByPlant] = useState([])

  const [open, setOpen] = useState(false)
  const [openTemplate, setOpenTemplate] = useState(false)
  const [openUpdateTemplate, setOpenUpdateTemplate] = useState(false)
  const [defaultTemplate, setDefaultTemplate] = useState([])
  const [fetilizer, setFetilizer] = useState([])
  const [BVTV, setBVTV] = useState([])

  const onCreate = async (values) => {
    setOpen(false)
    if (values.template === 'default') {
      // load from farm admin
      loadDefaultTemplate('seed rau cai A')
    } else if (values.template === 'farm') {
      // load from farm
      loadFarmTemplate('seed rau cai A')
    } else {
      setDefaultTemplate([])
    }
    loadCultivates()
    setOpenTemplate(true)
  }

  const onCreateTemplate = (values) => {
    const data = {
      plan: values.items
    }

    submitTemplate(data, params.id)
    setOpenTemplate(false)
  }

  const onUpdateTemplate = (values, plantCultivateId) => {
    const data = {
      plan: values.items
    }
    updateTemplate(data, params.id)
    setOpenUpdateTemplate(false)
  }

  const loadDefaultTemplate = async (seed) => {
    const data = await FARM.getPlanFromSeed(adminId, seed)
    setDefaultTemplate(data.data.plantFarming.plan)
  }

  const loadFarmTemplate = async (seed) => {
    const data = await FARM.getPlanFromSeed(farmId, seed)
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
  }

  const submitTemplate = async (data, projectId) => {
    const new_data = await FARM.addPlantCultivatesToProject(data, projectId)
    setProjectTemplate(new_data.data.updatedProjectPlan)
  }

  const updateTemplate = async (data, projectId) => {
    const new_data = await FARM.updatePlantCultivatesToProject(data, projectId)
    setProjectTemplate(new_data.data.updatedProjectPlan)
  }

  useEffect(() => {
    async function fetchData() {
      const data = await FARM.getPlanFromProject(params.id)
      if (data.data) {
        setProjectTemplate([...data.data.plan])
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <div>
        <Button
          type="primary"
          onClick={() => {
            setOpen(true)
          }}
          disabled={projectTemplate ? true : false}
        >
          Khởi tạo quy trình canh tác
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
            Chỉnh sửa
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
                <h3>Thời gian: {cultivate.time}</h3>
              </Divider>
              <h3>Loại canh tác: {cultivate.type}</h3>
              <h3>Ghi chú: {cultivate.note}</h3>
              {cultivate.agroChemicalItems?.map((cultivativeItem) => (
                <>
                  <Divider></Divider>
                  <p>Tên: {cultivativeItem.name}</p>
                  <p>
                    Lượng: {cultivativeItem.amountPerHa} {cultivate.type === 'phân bón' ? 'kg/ha' : 'lit/ha'}
                  </p>
                </>
              ))}
            </>
          ))}
        </Card>
      ) : (
        <h1>Không có</h1>
      )}
    </>
  )
}

export default ProjectTemplate

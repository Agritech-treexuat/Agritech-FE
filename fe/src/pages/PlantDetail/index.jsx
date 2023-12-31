import React, { useState, useEffect } from 'react'
import { Collapse, Button, Input, Card, Divider } from 'antd'
import { useParams } from 'react-router-dom'
import FARM from '../../services/farmService'
import Loading from '../Loading'
import AddPlanPopup from '../../components/ManagePlant/AddPlanPopup'
import AddTemplatePopup from '../../components/ManagePlant/AddTemplatePopup'
import UpdateTemplatePopup from '../../components/ManagePlant/UpdateTemplatePopup'
import { constants } from '../../utils/constant'

const { Panel } = Collapse

const PlantDetail = () => {
  const adminId = constants.ADMIN_ID
  const [search, setSearch] = useState('')
  const params = useParams()
  const farmId = localStorage.getItem('id')
  const [plans, setPlans] = useState([])
  const [allSeedByPlant, setAllSeedByPlant] = useState([])

  const [open, setOpen] = useState(false)
  const [openTemplate, setOpenTemplate] = useState(false)
  const [openUpdateTemplate, setOpenUpdateTemplate] = useState(false)
  const [defaultTemplate, setDefaultTemplate] = useState([])
  const [seed, setSeed] = useState(null)
  const [fetilizer, setFetilizer] = useState([])
  const [currentPlant, setCurrentPlant] = useState(null)
  const [BVTV, setBVTV] = useState([])

  const onCreate = async (values) => {
    setOpen(false)
    if (values.template === 'default') {
      await loadDefaultTemplate(values.seed)
    } else {
      setDefaultTemplate([])
    }
    setSeed(values.seed)
    loadCultivates()
    setOpenTemplate(true)
  }

  const onCreateTemplate = (values) => {
    const data = {
      plantId: params.id,
      seed: seed,
      plan: values.items
    }
    submitTemplate(data)
    setOpenTemplate(false)
  }

  const onUpdateTemplate = (values, plantCultivateId) => {
    const data = {
      plantCultivateId: plantCultivateId,
      plan: values.items
    }
    updateTemplate(data)
    setOpenUpdateTemplate(false)
  }

  const loadDefaultTemplate = async (seed) => {
    const data = await FARM.getPlanFromSeed(adminId, seed)
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

  const submitTemplate = async (data) => {
    const new_data = await FARM.addPlantCultivates(data)
    const newPlans = [...plans, new_data.data.plantFarming]
    setPlans(newPlans)
  }

  const updateTemplate = async (data) => {
    const new_data = await FARM.updatePlantCultivates(data)
    const newPlans = plans.map((item) =>
      item._id === new_data.data.plantFarming._id ? new_data.data.plantFarming : item
    )
    setPlans(newPlans)
  }
  useEffect(() => {
    async function fetchData() {
      const data = await FARM.getPlans(farmId, params.id)
      if (data.data) setPlans(data.data.plantFarming)
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchData() {
      const data = await FARM.getAllSeedByPlantId(params.id)
      if (data.data) setAllSeedByPlant(data.data.seeds)
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchData() {
      const data = await FARM.getPlantByPlantId(params.id)
      if (data.data) setCurrentPlant(data.data.plant)
    }
    fetchData()
  }, [])

  return (
    <div>
      {plans && currentPlant ? (
        <>
          <h1>Thông tin cây trồng {currentPlant.name}</h1>
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
                setOpen(true)
              }}
            >
              Thêm quy trình mới
            </Button>
            <AddPlanPopup
              open={open}
              onCreate={onCreate}
              onCancel={() => {
                setOpen(false)
              }}
              allSeedByPlant={allSeedByPlant}
            />
            <AddTemplatePopup
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
          {plans.map((item) => (
            <Card style={{ marginTop: '16px' }}>
              <h2>{item.seed}</h2>
              <Collapse>
                <Panel header="Quy trình chi tiết">
                  <Button
                    type="primary"
                    onClick={() => {
                      loadCultivates()
                      setOpenUpdateTemplate(true)
                    }}
                  >
                    Chỉnh sửa
                  </Button>
                  <UpdateTemplatePopup
                    open={openUpdateTemplate}
                    onCreate={onUpdateTemplate}
                    onCancel={() => {
                      setOpenUpdateTemplate(false)
                    }}
                    template={item.plan}
                    fetilizer={fetilizer}
                    BVTV={BVTV}
                    plantCultivateId={item._id}
                  />
                  {item.plan.map((cultivate) => (
                    <>
                      <Divider>
                        <h3>Thời điểm: {cultivate.time}</h3>
                      </Divider>
                      <h3>Ghi chú: {cultivate.note}</h3>
                      <h3>Loại: {cultivate.type}</h3>
                      {cultivate.agroChemicalItems.map((cultivativeItem) => (
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
                </Panel>
              </Collapse>
            </Card>
          ))}
        </>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default PlantDetail

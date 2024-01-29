import React, { useState, useEffect } from 'react'
import { Collapse, Button, Input, Card, Divider } from 'antd'
import { useParams } from 'react-router-dom'
import FARM from '../../services/farmService'
import Loading from '../Loading'
import AddPlanPopup from '../../components/ManagePlant/AddPlanPopup'
import AddTemplatePopup from '../../components/ManagePlant/AddTemplatePopup'
import UpdateTemplatePopup from '../../components/ManagePlant/UpdateTemplatePopup'
import { constants } from '../../utils/constant'
import usePlantDetail from './usePlantDetail'
import { useMutation } from '@tanstack/react-query'

const { Panel } = Collapse

const PlantDetail = () => {
  const adminId = constants.ADMIN_ID
  const [search, setSearch] = useState('')
  const plantId = useParams().id
  const farmId = localStorage.getItem('id')

  const [open, setOpen] = useState(false)
  const [openTemplate, setOpenTemplate] = useState(false)
  const [openUpdateTemplate, setOpenUpdateTemplate] = useState(false)
  const [template, setTemplate] = useState([])
  const [seed, setSeed] = useState(null)
  const [isUseDefault, setIsUseDefault] = useState(false)

  const {
    plans,
    isSuccessPlans,
    refetchPlans,
    allSeedByPlant,
    isSuccessAllSeedByPlant,
    currentPlant,
    isSuccessCurrentPlant,
    fetilizer,
    BVTV,
    isSuccessCultivatives,
    defaultTemplate,
    isSuccessDefaultTemplate,
    isLoadingDefaultTemplate
  } = usePlantDetail(farmId, plantId, seed, isUseDefault)

  useEffect(() => {
    if (isSuccessDefaultTemplate && !isLoadingDefaultTemplate && isUseDefault) {
      setTemplate(defaultTemplate)
      setIsUseDefault(false)
      setOpenTemplate(true)
    }
  }, [isSuccessDefaultTemplate, isLoadingDefaultTemplate, seed])

  const onCreate = async (values) => {
    setOpen(false)
    if (values.template === 'default') {
      setSeed(values.seed)
      setIsUseDefault(true)
    } else {
      setSeed(values.seed)
      setIsUseDefault(false)
      setTemplate([])
      setOpenTemplate(true)
    }
  }

  const onCreateTemplate = (values) => {
    const data = {
      plantId,
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

  const submitTemplate = async (data) => {
    await FARM.addPlantCultivates(data)
    refetchPlans()
  }

  const update = useMutation({
    mutationFn: (data) => FARM.updatePlantCultivates(data)
  })

  const updateTemplate = async (data) => {
    update.mutate(data, {
      onSuccess: () => {
        refetchPlans()
      }
    })
  }

  return (
    <div>
      {isSuccessPlans && isSuccessAllSeedByPlant && isSuccessCurrentPlant && isSuccessCultivatives ? (
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
              defaultTemplate={template}
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

import React, { useState, useEffect } from 'react'
import { Collapse, Button, Input, Card, Divider } from 'antd'
import { useParams } from 'react-router-dom'
import FARM from '../../services/farmService'
import Loading from '../Loading'
import AddPlanPopup from '../../components/ManagePlant/AddPlanPopup'
import AddTemplatePopup from '../../components/ManagePlant/AddTemplatePopup'
import UpdateTemplatePopup from '../../components/ManagePlant/UpdateTemplatePopup'
import usePlantDetail from './usePlantDetail'
import { useMutation } from '@tanstack/react-query'

const { Panel } = Collapse

const PlantDetail = () => {
  const [search, setSearch] = useState('')
  const plantId = useParams().id
  const farmId = localStorage.getItem('id')

  const [open, setOpen] = useState(false)
  const [openTemplate, setOpenTemplate] = useState(false)
  const [openUpdateTemplate, setOpenUpdateTemplate] = useState(false)
  const [template, setTemplate] = useState([])
  const [seedId, setSeedId] = useState(null)
  const [isUseDefault, setIsUseDefault] = useState(false)

  const {
    plans,
    isSuccessPlans,
    refetchPlans,
    allSeedByPlant,
    isSuccessAllSeedByPlant,
    currentPlant,
    isSuccessCurrentPlant,
    defaultTemplate,
    isSuccessDefaultTemplate,
    isLoadingDefaultTemplate
  } = usePlantDetail(plantId, seedId, isUseDefault)

  useEffect(() => {
    if (isSuccessDefaultTemplate && !isLoadingDefaultTemplate && isUseDefault) {
      console.log('defaultTemplate init', defaultTemplate)
      setTemplate(defaultTemplate)
      setIsUseDefault(false)
      setOpenTemplate(true)
    }
  }, [isSuccessDefaultTemplate, isLoadingDefaultTemplate, seedId])

  const onCreate = async (values) => {
    setOpen(false)
    if (values.template === 'default') {
      setSeedId(values.seed)
      setIsUseDefault(true)
      setOpenTemplate(true)
    } else {
      setSeedId(values.seed)
      setIsUseDefault(false)
      setTemplate([])
      setOpenTemplate(true)
    }
  }

  const onCreateTemplate = (values) => {
    const data = {
      plantId,
      seed: seedId,
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
      {isSuccessPlans && isSuccessAllSeedByPlant && isSuccessCurrentPlant ? (
        <>
        {console.log('template: ', template)}
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
            />
          </div>
          {plans.map((item) => (
            <Card style={{ marginTop: '16px' }} key={item._id}>
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
                  {/* <UpdateTemplatePopup
                    open={openUpdateTemplate}
                    onCreate={onUpdateTemplate}
                    onCancel={() => {
                      setOpenUpdateTemplate(false)
                    }}
                    template={item.plan}
                    fetilizer={fetilizer}
                    BVTV={BVTV}
                    plantCultivateId={item._id}
                  /> */}
                  <div>
                    {/* time cultivates: [{ start, end }] */}
                    <h2> Thoi gian canh tac </h2>
                    {item.timeCultivates.map((timeCultivate) => (
                      <div key={timeCultivate._id}>
                        <p>Thoi gian bat dau: {timeCultivate.start}</p>
                        <p>Thoi gian ket thuc: {timeCultivate.end}</p>
                      </div>
                    ))}
                  </div>
                  <Divider />
                  <div>
                    {/*  cultivationActivities: [{name, description}] */}
                    <h2> Hoat dong voi dat </h2>
                    {item.cultivationActivities.map((cultivationActivity) => (
                      <div key={cultivationActivity._id}>
                        <p>Ten hoat dong: {cultivationActivity.name}</p>
                        <p>Mo ta: {cultivationActivity.description}</p>
                      </div>
                    ))}
                  </div>
                  <Divider />
                  <div>
                    {/*  plantingActivity: {density, description} */}
                    <h2> Hoat dong trong gieo trong </h2>
                    <p>Mat do gieo trong: {item.plantingActivity.density}</p>
                    <p>Mo ta: {item.plantingActivity.description}</p>
                  </div>
                  <Divider />
                  <div>
                    {/* fertilizationActivities: [fertilizationTime, type, description] */}
                    <h2> Hoat dong phan bon </h2>
                    {item.fertilizationActivities.map((fertilizationActivity) => (
                      <div key={fertilizationActivity._id}>
                        <p>Thoi gian: {fertilizationActivity.fertilizationTime}</p>
                        <p>Loai: {fertilizationActivity.type}</p>
                        <p>Mo ta: {fertilizationActivity.description}</p>
                      </div>
                    ))}
                  </div>
                  <Divider />
                  <div>
                    {/* pestAndDiseaseControlActivities: [{name, type
                    symptoms
                    description
                    solution: [string]
                    note}] */}
                    <h2> Hoat dong phong ngua sau, benh </h2>
                    {item.pestAndDiseaseControlActivities.map((pestAndDiseaseControlActivity) => (
                      <div key={pestAndDiseaseControlActivity._id}>
                        <p>Ten: {pestAndDiseaseControlActivity.name}</p>
                        <p>Loai: {pestAndDiseaseControlActivity.type}</p>
                        <p>Trieu chung: {pestAndDiseaseControlActivity.symptoms}</p>
                        <p>Mo ta: {pestAndDiseaseControlActivity.description}</p>
                        <p>Giai phap:</p>
                        {pestAndDiseaseControlActivity.solution.map((solution) => (
                          <p key={solution}>{solution}</p>
                        ))}
                        <p>Ghi chu: {pestAndDiseaseControlActivity.note}</p>
                      </div>
                    ))}
                  </div>
                  <Divider />
                  <div>
                    {/* bestTimeCultivate: {start, end} */}
                    <h2> Thoi gian canh tac tot nhat </h2>
                    <p>Thoi gian bat dau: {item.bestTimeCultivate.start}</p>
                    <p>Thoi gian ket thuc: {item.bestTimeCultivate.end}</p>
                  </div>

                  <Divider />
                  {/* farmingTime: number */}
                  <p>Thoi gian trong cay: {item.farmingTime}</p>
                  <Divider />
                  {/* harvestTime: number */}
                  <p>Thoi gian thu hoach: {item.harvestTime}</p>
                  <Divider />
                </Panel>
              </Collapse>
            </Card>
          ))}
        </>
      ) : (
        <>
          <Loading />
        </>
      )}
    </div>
  )
}

export default PlantDetail

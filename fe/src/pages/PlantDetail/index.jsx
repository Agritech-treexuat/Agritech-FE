import React, { useState } from 'react'
import { Collapse, Button, Divider, Popconfirm, Tooltip, notification, Select, List } from 'antd'
import { useParams } from 'react-router-dom'
import Loading from '../Loading'
import usePlantDetail from './usePlantDetail'
import AddSeedPopup from '../../components/ManagePlant/AddSeedPopup'
import AddSeedConfirmationModal from '../../components/ManagePlant/AddSeedConfirmationModal'
import AddPlantFarmingPopup from '../../components/ManagePlant/AddPlantFarmingPopup'
import PLANT_FARMING from '../../services/plantFarmingService'
import SEED from '../../services/seedService'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import UpdateSeedInfo from '../../components/ManagePlant/UpdateSeedInfo'
const { Option } = Select

const { Panel } = Collapse

const PlantDetail = () => {
  const plantId = useParams().id

  const [openUpdatePlantFarming, setOpenUpdatePlantFarming] = useState(false)
  const [selectedPlantFarmming, setSelectedPlantFarmming] = useState(null)
  const [selectedSeed, setSelectedSeed] = useState(null)
  const [openUpdateSeed, setOpenUpdateSeed] = useState(false)
  const [openSeed, setOpenSeed] = useState(false)
  const [openPlantFarming, setOpenPlantFarming] = useState(false)
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false)
  const [isDefaultPlantFarming, setIsDefaultPlantFarming] = useState(false)

  const {
    plans,
    isSuccessPlans,
    refetchPlans,
    currentPlant,
    isSuccessCurrentPlant,
    recommendPlantFarming,
    isSuccessRecommendPlantFarming,
    defaultPlant,
    isSuccessDefaultPlant
  } = usePlantDetail({ plantId, seedId: selectedSeed?.id, isDefaultPlantFarming })

  const [selectedDefaultSeed, setSelectedDefaultSeed] = useState(
    plans?.find((item) => item.isSeedDefault)?.seedId || ''
  )
  const [isUpdateDefaultSeed, setIsUpdateDefaultSeed] = useState(false)

  const [api, contextHolder] = notification.useNotification()
  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5
    })
  }

  const onCreate = async (values) => {
    try {
      const resSeed = await SEED.addSeedByRecommendSeedId({
        recommendSeedId: selectedSeed.id
      })

      if (resSeed.response && resSeed.response?.data?.message === 'Seed already exists') {
        openNotificationWithIcon('error', 'Thông báo', 'Hạt giống đã tồn tại')
        setIsDefaultPlantFarming(false)
        setOpenSeed(false)
        setOpenPlantFarming(false)
        return
      }
      if (resSeed.status !== 200) {
        openNotificationWithIcon('error', 'Thông báo', 'Thêm Seed thất bại')
        setIsDefaultPlantFarming(false)
        setOpenSeed(false)
        setOpenPlantFarming(false)
        return
      }
      const res = await PLANT_FARMING.addPlantFarmingWithRecommendPlantIdAndSeedId({
        plantId,
        seedId: selectedSeed.id,
        data: {
          isPlantFarmingDefault: true,
          ...values
        }
      })
      if (res.status === 200) {
        refetchPlans()
        openNotificationWithIcon('success', 'Thông báo', 'Thêm thành công')
      } else {
        refetchPlans()
        openNotificationWithIcon('error', 'Thông báo', 'Thêm plant farming thất bại')
      }
      setIsDefaultPlantFarming(false)
      setOpenSeed(false)
      setOpenPlantFarming(false)
    } catch (error) {
      console.error(error)
      openNotificationWithIcon('error', 'Thông báo', 'Thêm plant farming thất bại')
      setIsDefaultPlantFarming(false)
      setOpenSeed(false)
      setOpenPlantFarming(false)
    }
  }

  const handleAddSeed = () => {
    if (selectedSeed) {
      setOpenSeed(false)
      setConfirmationModalVisible(true)
    }
  }

  const handleContinueWithTemplate = () => {
    setConfirmationModalVisible(false)
    setIsDefaultPlantFarming(true)
    setOpenPlantFarming(true)
  }

  const handleContinueWithEmpty = () => {
    setConfirmationModalVisible(false)
    setIsDefaultPlantFarming(false)
    setOpenPlantFarming(true)
  }

  const handleUpdatePlantFarming = async (values) => {
    try {
      const res = await PLANT_FARMING.updatePlantFarming({
        plantFarmingId: selectedPlantFarmming._id,
        data: values
      })
      if (res.status === 200) {
        refetchPlans()
        openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
      } else {
        openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại')
      }
      setOpenUpdatePlantFarming(false)
    } catch (error) {
      console.error(error)
      openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại')
    }
  }

  const handleDeleteConfirm = async (item) => {
    try {
      const res = await PLANT_FARMING.deletePlantFarming(item._id)
      if (res.status === 200) {
        const resSeed = await SEED.deleteSeed(item.seedId)
        if (resSeed.status === 200) {
          refetchPlans()
          openNotificationWithIcon('success', 'Thông báo', 'Xóa thành công')
        } else {
          openNotificationWithIcon('error', 'Thông báo', 'Xóa thất bại')
        }
      } else {
        openNotificationWithIcon('error', 'Thông báo', 'Xóa thất bại')
      }
    } catch (error) {
      console.error(error)
      openNotificationWithIcon('error', 'Thông báo', 'Xóa thất bại')
    }
  }

  const handleUpdateDefaultSeed = async (seedId) => {
    console.log('seedId:', seedId)
    try {
      const res = await SEED.updateSeedDefault(seedId)
      if (res.status === 200) {
        refetchPlans()
        openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
      } else {
        openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại')
      }
    } catch (error) {
      console.error(error)
      openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại')
    }
  }

  const handleChange = (value) => {
    setSelectedDefaultSeed(value)
  }

  const handleSave = () => {
    if (selectedDefaultSeed) {
      handleUpdateDefaultSeed(selectedDefaultSeed)
      setSelectedDefaultSeed('')
    }
    setIsUpdateDefaultSeed(false)
  }

  const handleCancel = () => {
    setSelectedDefaultSeed('')
    setIsUpdateDefaultSeed(false)
  }

  const handleUpdateSeed = async (values) => {
    try {
      const res = await SEED.updateSeed({
        seedId: selectedSeed.seedId,
        data: {
          seed_name: values.name,
          seed_description: values.description,
          seed_thumb: values.thumb[0].url || values.thumb[0].response.metadata.thumb_url
        }
      })
      if (res.status === 200) {
        refetchPlans()
        openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
      } else {
        openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại')
      }
      setOpenUpdateSeed(false)
    } catch (error) {
      console.error(error)
      openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại')
    }
  }

  return (
    <div>
      {contextHolder}
      {isSuccessPlans && isSuccessCurrentPlant && isSuccessDefaultPlant ? (
        <>
          <h1>Thông tin cây trồng {currentPlant.name}</h1>
          <>
            {plans.map((item) => {
              if (item.isSeedDefault) {
                return (
                  <div key={item._id} style={{ display: 'flex' }}>
                    <p style={{ marginRight: '1rem' }}>Hạt giống mặc định là: {item.name}</p>
                    <Tooltip title="Cập nhật hạt giống mặc định">
                      <Button
                        shape="circle"
                        icon={<EditOutlined />}
                        onClick={() => {
                          setSelectedDefaultSeed(item.seeedId)
                          setIsUpdateDefaultSeed(true)
                        }}
                      />
                    </Tooltip>
                  </div>
                )
              }
              return null
            })}
            {isUpdateDefaultSeed && (
              <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                <Select
                  style={{ width: 200, marginRight: '8px' }}
                  defaultValue={selectedDefaultSeed}
                  onChange={handleChange}
                  showSearch
                  filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {plans.map((item) => (
                    <Option key={item._id} value={item.seedId}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
                <Button type="primary" onClick={handleSave}>
                  Lưu
                </Button>
                <Button onClick={handleCancel}>Hủy</Button>
              </div>
            )}
          </>
          <div>
            <Button
              type="primary"
              onClick={() => {
                setOpenSeed(true)
              }}
            >
              Thêm quy trình mới
            </Button>
          </div>
          <AddSeedPopup
            selectedPlant={{
              id: defaultPlant.id
            }}
            open={openSeed}
            onClose={() => {
              setOpenSeed(false)
            }}
            selectedSeed={selectedSeed}
            setSelectedSeed={setSelectedSeed}
            handleAddSeed={handleAddSeed}
          />
          <AddSeedConfirmationModal
            visible={confirmationModalVisible}
            onCancel={() => setConfirmationModalVisible(false)}
            onContinueWithEmpty={handleContinueWithEmpty}
            onContinueWithTemplate={handleContinueWithTemplate}
          />

          <UpdateSeedInfo
            visible={openUpdateSeed}
            onCreate={handleUpdateSeed}
            onCancel={() => setOpenUpdateSeed(false)}
            isUpdate={true}
            seed={selectedSeed}
          />
          {isDefaultPlantFarming ? (
            <>
              {isSuccessRecommendPlantFarming && (
                <AddPlantFarmingPopup
                  open={openPlantFarming}
                  onCancel={() => {
                    setIsDefaultPlantFarming(false)
                    setOpenPlantFarming(false)
                  }}
                  onCreate={onCreate}
                  recommendPlantFarming={recommendPlantFarming}
                />
              )}
            </>
          ) : (
            <>
              <AddPlantFarmingPopup
                open={openPlantFarming}
                onCancel={() => setOpenPlantFarming(false)}
                onCreate={onCreate}
                recommendPlantFarming={null}
                isUpdate={false}
              />
            </>
          )}
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: (page) => {
                console.log(page)
              },
              pageSize: 3
            }}
            dataSource={plans}
            renderItem={(item) => (
              <List.Item
                key={item.name}
                actions={[
                  <Popconfirm
                    title={
                      item.isSeedDefault
                        ? 'Bạn không thể xóa hạt giống mặc định, hãy đổi hạt giống mặc định trước'
                        : 'Xóa hạt giống kèm quy trình canh tác'
                    }
                    onConfirm={() => handleDeleteConfirm(item)}
                    okText="Yes"
                    cancelText="No"
                    disabled={item.isSeedDefault}
                  >
                    <Tooltip
                      title={
                        item.isSeedDefault
                          ? 'Bạn không thể xóa hạt giống mặc định, hãy đổi hạt giống mặc định trước'
                          : 'Xóa hạt giống kèm quy trình canh tác'
                      }
                    >
                      <span>
                        <DeleteOutlined style={{ fontSize: '18px', color: item.isSeedDefault ? 'gray' : 'red' }} />
                      </span>
                    </Tooltip>
                  </Popconfirm>,
                  <Tooltip title="Chỉnh sửa hạt giống">
                    <EditOutlined
                      onClick={() => {
                        setSelectedSeed(item)
                        setOpenUpdateSeed(true)
                      }}
                    />
                  </Tooltip>
                ]}
                extra={<img width={272} alt="logo" src={item.image} />}
              >
                <List.Item.Meta title={item.name} description={item.description} />
                <Collapse>
                  <Panel header="Quy trình chi tiết">
                    <Button
                      type="primary"
                      onClick={() => {
                        setSelectedPlantFarmming(item)
                        setOpenUpdatePlantFarming(true)
                      }}
                    >
                      Chỉnh sửa
                    </Button>
                    <AddPlantFarmingPopup
                      open={openUpdatePlantFarming}
                      onCreate={handleUpdatePlantFarming}
                      onCancel={() => {
                        setOpenUpdatePlantFarming(false)
                      }}
                      isUpdate={true}
                      recommendPlantFarming={selectedPlantFarmming}
                    />
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
              </List.Item>
            )}
          />
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

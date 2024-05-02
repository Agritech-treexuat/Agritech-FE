import React, { useState } from 'react'
import { Button, Modal, Divider } from 'antd'
import { formatDateTime } from '../../../utils/helpers'

const EditPlantFarmingHistory = ({ historyPlantFarmingEdit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }
  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Lịch sử chỉnh sửa
      </Button>
      <Modal
        title="Lịch sử chỉnh sửa"
        style={{ width: '1000' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        {historyPlantFarmingEdit.map((plantFarming) => (
          <div style={{ width: '1000' }}>
            <Divider>Nhập lúc: {formatDateTime(plantFarming.createdAtTime)}</Divider>
            <Divider>Chỉnh sửa lúc: {formatDateTime(plantFarming.modifiedAt)}</Divider>
            <Divider />
            <div>
              {/*  cultivationActivities: [{name, description}] */}
              <h2> Hoat dong voi dat </h2>
              {plantFarming.cultivationActivities.map((cultivationActivity) => (
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
              <p>Mat do gieo trong: {plantFarming.plantingActivity.density}</p>
              <p>Mo ta: {plantFarming.plantingActivity.description}</p>
            </div>
            <Divider />
            <div>
              {/* fertilizationActivities: [fertilizationTime, type, description] */}
              <h2> Hoat dong phan bon </h2>
              {plantFarming.fertilizationActivities.map((fertilizationActivity) => (
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
              {plantFarming.pestAndDiseaseControlActivities.map((pestAndDiseaseControlActivity) => (
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
          </div>
        ))}
      </Modal>
    </>
  )
}
export default EditPlantFarmingHistory

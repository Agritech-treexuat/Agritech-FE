import React from 'react'
import { useParams } from 'react-router'
import Loading from '../../../pages/Loading'
import UpdateInputPopup from './UpdateInputPopup'
import { Col, Row } from 'antd'
import { formatDate } from '../../../utils/helpers'
import useProjectInput from './useProjectInput'

const ProjectInput = () => {
  const projectId = useParams().id
  const { projectInfo, isSuccess, refetch } = useProjectInput({ projectId })

  return (
    <div>
      {isSuccess ? (
        <div>
          <Row>
            <Col span={4}>
              <h2 style={{ margin: '0px' }}>Thông tin khởi tạo</h2>
            </Col>
            <Col span={2}></Col>
            <Col span={18} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <UpdateInputPopup input={projectInfo} refetch={refetch} />
            </Col>
          </Row>
          <div>
            <label>Ngày bắt đầu: </label>
            <span>{formatDate(projectInfo.startDate)}</span>
          </div>
          <div>
            <label>Cây: </label>
            <span>{projectInfo.plant.plant_name}</span>
          </div>
          <div>
            <label>Hạt giống: </label>
            <span>{projectInfo.seed.seed_name}</span>
          </div>
          <div>
            <label>Diện tích trồng: </label>
            <span>{projectInfo.square || 'Chưa cập nhật'}</span>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default ProjectInput

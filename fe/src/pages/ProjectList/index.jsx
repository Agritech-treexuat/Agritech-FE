// src/components/ProjectList.js
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ProjectItem from '../../components/ProjectItem'
import './style.css'
import Loading from '../Loading'
import { Input } from 'antd'
import { Col, Row } from 'antd'
import { Button, Flex } from 'antd'
import useProjectList from './useProjectList'
import { Form, Modal, Radio } from 'antd'

const ProjectList = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const farmId = localStorage.getItem('id')
  const { projects, isSuccess, isLoading, allPlantsInFarm, isSuccessAllPlantsInFarm, isLoadingAllPlantsInFarm } = useProjectList(farmId)
  const [selectedPlant, setSelectedPlant] = useState(null)
  const [open, setOpen] = useState(false)
  const onCreate = (values) => {
    console.log('Received values of form: ', values)
    setSelectedPlant(values)
    setOpen(false)
  }

  const filteredProjects =
    projects.length > 0
      ? projects.filter((project) => {
          return project.title.toLowerCase().includes(searchQuery.toLowerCase())
        })
      : []

  const CreatePlantForm = ({ open, onCreate, onCancel }) => {
    const [form] = Form.useForm()
    return (
      <Modal
        open={open}
        title="What's plant do you want to add?"
        okText="Create"
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields()
              onCreate(values)
            })
            .catch((info) => {
              console.log('Validate Failed:', info)
            })
        }}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: 'public'
          }}
        >
        
          <Form.Item
            name="plant"
            label="plant"
            rules={[
              {
                required: true,
                message: 'Please input the title of collection!'
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input type="textarea" />
          </Form.Item>
        </Form>
      </Modal>
    )
  }

  return (
    <div>
      {isSuccess && isSuccessAllPlantsInFarm ? (
        <div>
          <h1>Danh sách các dự án</h1>
          <Row>
            <Col span={8}>
              <Input
                placeholder="Search projects"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Col>
            <Col span={1}></Col>
            <Col span={6}>
              <Flex gap="small" wrap="wrap">
                <Button
                  style={{ marginRight: '6px' }}
                  type="primary"
                  onClick={() => {
                    setOpen(true)
                  }}
                >
                  New Collection
                </Button>
              </Flex>
              <CreatePlantForm
                open={open}
                onCreate={onCreate}
                onCancel={() => {
                  setOpen(false)
                }}
              />
            </Col>
          </Row>
          <Row className="project-grid">
            {filteredProjects.map((project) => (
              <Col span={4} key={project.id}>
                <Link to={`/project/${project.id}`} key={project.id}>
                  <ProjectItem project={project} />
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default ProjectList

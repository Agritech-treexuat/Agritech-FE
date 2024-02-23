import React from 'react'
import { Button, Space, Input, Tooltip, Select } from 'antd'
import { EditFilled } from '@ant-design/icons'
import { districtOptions } from '../../../utils/constant'
const { Option } = Select

const OverViewProfile = ({
  isEditingOverView,
  setIsEditingOverView,
  description,
  setDescription,
  district,
  setDistrict,
  address,
  setAddress,
  handleSave,
  profile
}) => {
  const handleCancel = () => {
    setIsEditingOverView(false)
    setDescription(profile?.description)
    setDistrict(profile?.district)
    setAddress(profile?.address)
  }

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <h2 style={{ marginRight: '1rem' }}>Overview</h2>
        <Tooltip title="Edit overview">
          <EditFilled style={{ color: '#476930' }} onClick={() => setIsEditingOverView(true)} />
        </Tooltip>
      </div>
      {isEditingOverView ? (
        <div>
          <h3>Description: </h3>
          <Input.TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            autoSize={{ minRows: 3, maxRows: 5 }}
            style={{ marginBottom: '8px' }}
          />
          <h3>District: </h3>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select District"
            optionFilterProp="children"
            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            onChange={setDistrict}
            value={district}
          >
            {districtOptions.map((district) => (
              <Option key={district.value} value={district.value}>
                {district.label}
              </Option>
            ))}
          </Select>
          <h3>Address: </h3>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            style={{ marginBottom: '8px' }}
          />
          <Space>
            <Button type="primary" onClick={handleSave}>
              Save
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Space>
        </div>
      ) : (
        <div>
          <h3>Description: </h3>
          <p>{profile?.description}</p>
          <h3>District: </h3>
          <p>{profile?.district}</p>
          <h3>Address: </h3>
          <p>{profile?.address}</p>
        </div>
      )}
    </div>
  )
}

export default OverViewProfile

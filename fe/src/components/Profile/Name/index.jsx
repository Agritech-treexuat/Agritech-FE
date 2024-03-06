import React from 'react'
import { Button, Input, Tooltip } from 'antd'
import { EditFilled } from '@ant-design/icons'

const NameProfile = ({ isEditingName, setIsEditingName, newName, setNewName, handleSave, profile }) => {
  const handleCancel = () => {
    // Code để hủy chỉnh sửa
    setIsEditingName(false)
    // Khôi phục lại tên ban đầu nếu đã thay đổi
    setNewName(profile?.name)
  }

  return (
    <div>
      <div>
        {isEditingName ? (
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            style={{ marginBottom: '8px', marginLeft: '15px' }}
          />
        ) : (
          <div style={{ display: 'flex', marginLeft: '10px' }}>
            <h1 style={{ margin: '1rem' }}>Tên trang trại: {profile.name}</h1>
            <Tooltip title="Edit name">
              <EditFilled style={{ color: '#476930' }} onClick={() => setIsEditingName(true)} />
            </Tooltip>
          </div>
        )}
        <div>
          {isEditingName && (
            <div>
              <Button type="primary" onClick={handleSave} style={{ marginRight: '10px' }}>
                Save
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NameProfile

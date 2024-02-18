import React from 'react'
import { Button, Space, Input, Tooltip } from 'antd'
import { EditFilled, PlusOutlined } from '@ant-design/icons'

const ContactProfile = ({
  isEditingContact,
  setIsEditingContact,
  phoneList,
  setPhoneList,
  emailList,
  setEmailList,
  handleSave,
  profile
}) => {
  const handleCancel = () => {
    // Code để hủy chỉnh sửa
    setIsEditingContact(false)
    // Khôi phục lại thông tin ban đầu nếu đã thay đổi
    setPhoneList(profile.phone || [])
    setEmailList(profile.email || [])
  }

  const handleAddPhone = () => {
    setPhoneList([...phoneList, ''])
  }

  const handleAddEmail = () => {
    setEmailList([...emailList, ''])
  }

  const handlePhoneChange = (index, value) => {
    const newList = [...phoneList]
    newList[index] = value
    setPhoneList(newList)
  }

  const handleEmailChange = (index, value) => {
    const newList = [...emailList]
    newList[index] = value
    setEmailList(newList)
  }

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <h2 style={{ marginRight: '1rem' }}>Contact</h2>
        <Tooltip title="Edit contact">
          <EditFilled style={{ color: '#476930' }} onClick={() => setIsEditingContact(true)} />
        </Tooltip>
      </div>
      {isEditingContact ? (
        <div>
          <h3>Phone: </h3>
          {phoneList.map((phone, index) => (
            <Input
              key={index}
              placeholder="Phone number"
              value={phone}
              onChange={(e) => handlePhoneChange(index, e.target.value)}
              style={{ marginBottom: '8px' }}
            />
          ))}
          <Button type="dashed" onClick={handleAddPhone} icon={<PlusOutlined />}>
            Add Phone
          </Button>
          <br />
          <h3>Phone: </h3>
          {emailList.map((email, index) => (
            <Input
              key={index}
              placeholder="Email address"
              value={email}
              onChange={(e) => handleEmailChange(index, e.target.value)}
              style={{ marginBottom: '8px' }}
            />
          ))}
          <Button type="dashed" onClick={handleAddEmail} icon={<PlusOutlined />}>
            Add Email
          </Button>
          <br />
          <Space>
            <Button type="primary" onClick={handleSave}>
              Save
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Space>
        </div>
      ) : (
        <div>
          <h3>Phone: </h3>
          {phoneList && phoneList.length > 0 ? (
            phoneList.map((phone, index) => <p key={index}>{phone}</p>)
          ) : (
            <p>Not has phone yet</p>
          )}
          <h3>Email: </h3>
          {emailList && emailList.length > 0 ? (
            emailList.map((email, index) => <p key={index}>{email}</p>)
          ) : (
            <p>Not has email yet</p>
          )}
        </div>
      )}
    </div>
  )
}

export default ContactProfile

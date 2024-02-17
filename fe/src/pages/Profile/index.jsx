import React, { useState } from 'react'
import useProfile from './useProfile'
import Loading from '../Loading'
import { Avatar, Button, Space, Input, Tooltip, notification } from 'antd'
import { EditFilled } from '@ant-design/icons'
import FARM from '../../services/farmService'
import PlaceComponent from '../../components/Profile/Map'
const { TextArea } = Input
const Profile = () => {
  const { profile, isSuccess, refetch } = useProfile()
  const [isEditingOverView, setIsEditingOverView] = useState(false)
  const [description, setDescription] = useState(profile?.description)
  const [district, setDistrict] = useState(profile?.district)
  const [address, setAddress] = useState(profile?.address)
  const [isEditingLocation, setIsEditingLocation] = useState(false)
  const [api, contextHolder] = notification.useNotification()
  const [lat, setLat] = useState(profile?.lat)
  const [lng, setLng] = useState(profile?.lng)

  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5
    })
  }

  console.log('profile: ', profile)

  const handleSave = async () => {
    try {
      if (isEditingOverView) {
        const res = await FARM.updateProfile({
          data: {
            description,
            district,
            address
          }
        })

        if (res.status === 200) {
          refetch()
          openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
        } else {
          openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
        }
        setIsEditingOverView(false)
      }

      if (isEditingLocation) {
        const res = await FARM.updateProfile({
          data: {
            lat: lat,
            lng: lng
          }
        })

        if (res.status === 200) {
          refetch()
          openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
        } else {
          openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
        }
        setIsEditingLocation(false)
      }
    } catch (error) {
      console.log('error: ', error)
      openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
      setIsEditingOverView(false)
    }
  }

  const handleCancelOverView = () => {
    setDescription(profile.description)
    setDistrict(profile.district)
    setAddress(profile.address)
    setIsEditingOverView(false)
  }

  return (
    <>
      {contextHolder}
      {isSuccess ? (
        <div>
          <div>
            <Avatar size={64} src={profile.avatar} />
          </div>
          <div>
            <h1>{profile.name}</h1>
          </div>
          <div>
            <div style={{ display: 'flex' }}>
              <h2 style={{ marginRight: '1rem' }}>Overview Information</h2>{' '}
              <Tooltip title="Edit overview information">
                <EditFilled style={{ color: '#476930' }} onClick={() => setIsEditingOverView(true)} />
              </Tooltip>
            </div>
            {isEditingOverView ? (
              <div>
                <TextArea
                  placeholder="Description"
                  autoSize={{ minRows: 3, maxRows: 5 }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <Input placeholder="District" value={district} onChange={(e) => setDistrict(e.target.value)} />
                <Input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                <Space>
                  <Button type="primary" onClick={handleSave}>
                    Save
                  </Button>
                  <Button onClick={handleCancelOverView}>Cancel</Button>
                </Space>
              </div>
            ) : (
              <div>
                <p>
                  <strong>Description:</strong> {profile.description}
                </p>
                <p>
                  <strong>District:</strong> {profile.district}
                </p>
                <p>
                  <strong>Address:</strong> {profile.address}
                </p>
              </div>
            )}
          </div>
          <div>
            <h2>Contact</h2>
            {console.log('profile: ', profile)}
            {profile.phone && profile.phone.length > 0 ? (
              profile.phone.map((phone, index) => <p key={index}>{phone}</p>)
            ) : (
              <p>Not has phone yet</p>
            )}
            {profile.email && profile.email.length > 0 ? (
              profile.email.map((email, index) => <p key={index}>{email}</p>)
            ) : (
              <p>Not has email yet</p>
            )}
          </div>
          <PlaceComponent
            lat={lat || profile.lat}
            lng={lng || profile.lng}
            setLat={setLat}
            setLng={setLng}
            handleSave={handleSave}
            isEditingLocation={isEditingLocation}
            setIsEditingLocation={setIsEditingLocation}
          />
          <div>
            <h2>Images</h2>
            {profile.images
              ? profile.images.map((image, index) => <img key={index} src={image} alt="image" />)
              : 'Not has yet'}
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  )
}

export default Profile

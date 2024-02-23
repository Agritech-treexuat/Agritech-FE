import React, { useState } from 'react'
import useProfile from './useProfile'
import Loading from '../Loading'
import { notification } from 'antd'
import FARM from '../../services/farmService'
import PlaceComponent from '../../components/Profile/Map'
import ImagesProfile from '../../components/Profile/Image'
import ContactProfile from '../../components/Profile/Contact'
import OverViewProfile from '../../components/Profile/Overview'
import NameProfile from '../../components/Profile/Name'

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

  const [isEditingImages, setIsEditingImages] = useState(false)
  const [imageList, setImageList] = useState(profile?.images)

  const [isEditingContact, setIsEditingContact] = useState(false)
  const [phoneList, setPhoneList] = useState(profile?.phone)
  const [emailList, setEmailList] = useState(profile?.email)

  const [isEditingName, setIsEditingName] = useState(false)
  const [newName, setNewName] = useState(profile?.name)

  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5
    })
  }

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

      if (isEditingImages) {
        const res = await FARM.updateProfile({
          data: {
            images: imageList
          }
        })

        if (res.status === 200) {
          refetch()
          openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
        } else {
          openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
        }
        setIsEditingImages(false)
      }

      if (isEditingContact) {
        const res = await FARM.updateProfile({
          data: {
            phone: phoneList,
            email: emailList
          }
        })

        if (res.status === 200) {
          refetch()
          openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
        } else {
          openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
        }
        setIsEditingContact(false)
      }

      if (isEditingName) {
        const res = await FARM.updateProfile({
          data: {
            name: newName
          }
        })

        if (res.status === 200) {
          refetch()
          openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
        } else {
          openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
        }
        setIsEditingName(false)
      }
    } catch (error) {
      console.log('error: ', error)
      openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
      setIsEditingOverView(false)
    }
  }

  return (
    <>
      {contextHolder}
      {isSuccess ? (
        <div>
          <NameProfile
            isEditingName={isEditingName}
            setIsEditingName={setIsEditingName}
            newName={newName || profile?.name}
            setNewName={setNewName}
            handleSave={handleSave}
            profile={profile}
          />
          <OverViewProfile
            isEditingOverView={isEditingOverView}
            setIsEditingOverView={setIsEditingOverView}
            description={description || profile?.description}
            setDescription={setDescription}
            district={district || profile?.district}
            setDistrict={setDistrict}
            address={address || profile?.address}
            setAddress={setAddress}
            handleSave={handleSave}
            profile={profile}
          />
          <ContactProfile
            isEditingContact={isEditingContact}
            setIsEditingContact={setIsEditingContact}
            phoneList={phoneList || profile?.phone}
            setPhoneList={setPhoneList}
            emailList={emailList || profile?.email}
            setEmailList={setEmailList}
            handleSave={handleSave}
            profile={profile}
          />
          {/* <PlaceComponent
            lat={lat || profile.lat}
            lng={lng || profile.lng}
            setLat={setLat}
            setLng={setLng}
            handleSave={handleSave}
            isEditingLocation={isEditingLocation}
            setIsEditingLocation={setIsEditingLocation}
          /> */}
          <ImagesProfile
            isEditingImages={isEditingImages}
            setIsEditingImages={setIsEditingImages}
            imageList={imageList || profile?.images}
            setImageList={setImageList}
            handleSave={handleSave}
            profile={profile}
          />
        </div>
      ) : (
        <Loading />
      )}
    </>
  )
}

export default Profile

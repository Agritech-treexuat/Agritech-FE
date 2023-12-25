import React from 'react'
import { Col, Row } from 'antd'
import { useState } from 'react'
import { useEffect } from 'react'
import ProcessList from './Process/ProcessList'
import AddProcessPopUp from './Process/AddProcessPopup'
import { Image } from 'antd'
import FARM from '../../../services/farmService'
import { useParams } from 'react-router'
import './style.css'
import Loading from '../../../pages/Loading'

const ProjectProcess = () => {
  const totalImages = 24
  const rows = 4
  const cols = 6
  const imagesPerRow = totalImages / rows
  const projectID = useParams()

  const imageArray = new Array(totalImages).fill({
    imageUrl: 'https://www.greenqueen.com.hk/wp-content/uploads/2020/12/Veganic-Farming.png'
  })

  // Tạo ngày hôm nay bằng thư viện moment
  const [selectedDate, setSelectedDate] = useState('')
  const [processData, setProcessData] = useState([])
  const [imageData, setImageData] = useState([])
  const [weatherData, setWeatherData] = useState(null)
  const location = 'hà nội'
  const apid = 'fd3455621595a002c80c20ef925cfe5f'

  useEffect(() => {
    const today = new Date() // Lấy ngày hôm nay
    const year = today.getFullYear()
    const month = (today.getMonth() + 1).toString().padStart(2, '0') // Thêm số 0 phía trước nếu cần
    const day = today.getDate().toString().padStart(2, '0') // Thêm số 0 phía trước nếu cần
    const formattedDate = `${year}-${month}-${day}`

    setSelectedDate(formattedDate)
  }, [])

  useEffect(() => {
    async function fetchData() {
      const data = await FARM.getProcess(projectID.id)
      console.log('Data: ', data.data)
      setProcessData(data.data.processes)
    }
    fetchData()
    console.log('Process data: ', processData)
  }, [])

  useEffect(() => {
    async function fetchData() {
      console.log('date: ', selectedDate)
      if (selectedDate) {
        const data = await FARM.getImage(projectID.id, selectedDate)
        // console.log("Data img: ", data.data)
        // data is not ready
        data.data ? setImageData(data.data.images) : setImageData(imageArray)
      }
    }
    fetchData()
    console.log('image data: ', imageData)
  }, [selectedDate])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apid}&units=metric&lang=vi`
        )
        const data = await response.json()
        console.log('json: ', data)

        setWeatherData(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <Row>
        <Col span={24}>
          <div>
            <h1>Các hoạt động canh tác</h1>
            {processData ? (
              <>
                <AddProcessPopUp setProcessData={setProcessData} />
                <ProcessList processes={processData} setProcessData={setProcessData} />
              </>
            ) : (
              <Loading />
            )}
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <input type="date" id="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div>
            {weatherData ? (
              <>
                <h2>
                  {' '}
                  Thời tiết hôm nay {weatherData.weather[0].description}, {weatherData.main.temp} độ C, độ ẩm là{' '}
                  {weatherData.main.humidity}%, tốc độ gió là {weatherData.wind.speed} m/s
                </h2>
              </>
            ) : (
              <Loading />
            )}
          </div>
        </Col>
      </Row>
      {imageData ? (
        Array.from({ length: rows }, (_, rowIndex) => (
          <Row key={rowIndex}>
            {Array.from({ length: cols }, (_, colIndex) => {
              const index = rowIndex * cols + colIndex
              let imageUrl = 'https://www.greenqueen.com.hk/wp-content/uploads/2020/12/Veganic-Farming.png'
              if (index < imageData.length) {
                imageUrl = imageData[index]?.imageUrl
              }

              return imageUrl ? (
                <Col span={24 / imagesPerRow} key={colIndex} style={{ padding: 4 }}>
                  <div style={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
                    <Image class={'process-img'} src={imageUrl} />
                  </div>
                </Col>
              ) : null
            })}
          </Row>
        ))
      ) : (
        <Loading />
      )}
    </>
  )
}

export default ProjectProcess

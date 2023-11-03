import React from 'react';
import { Col, Row, DatePicker } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import ProcessList from '../Process/ProcessList'
import AddProcessPopUp from '../Process/AddProcessPopup'
import ExpectList from '../Expect/ExpectList'
import AddExpectPopup from '../Expect/AddExpectPopup'
import { Image } from 'antd';
import FARM from '../../../services/farmService';
import { useParams } from 'react-router';
import './style.css'
import Loading from '../../../pages/Loading';

const ProjectProcess = () => {
  const totalImages = 24;
  const rows = 4;
  const cols = 6;
  const imagesPerRow = totalImages / rows;
  const projectID = useParams()

  const imageArray = new Array(totalImages).fill('https://www.greenqueen.com.hk/wp-content/uploads/2020/12/Veganic-Farming.png');

  // Tạo ngày hôm nay bằng thư viện moment
  const [selectedDate, setSelectedDate] = useState('');
  const [processData, setProcessData] = useState([])
  const [expectData, setExpectData] = useState([])
  const [imageData, setImageData] = useState([])

  useEffect(() => {
    const today = new Date(); // Lấy ngày hôm nay
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Thêm số 0 phía trước nếu cần
    const day = today.getDate().toString().padStart(2, '0'); // Thêm số 0 phía trước nếu cần
    const formattedDate = `${year}-${month}-${day}`;

    setSelectedDate(formattedDate);
  }, []);

  useEffect(() => {
    async function fetchData() {
      const data = await FARM.getProcess(projectID.id)
      console.log("Data: ", data.data)
      setProcessData(data.data.processes)
    }
    fetchData();
    console.log("Process data: ", processData)
  }, []);

  useEffect(() => {
    async function fetchData() {
      const data = await FARM.getExpect(projectID.id)
      console.log("Data: ", data.data)
      setExpectData(data.data.expects)
    }
    fetchData();
    console.log("Expect data: ", expectData)
  }, []);

  useEffect(() => {
    async function fetchData() {
      console.log("date: ", selectedDate)
      if(selectedDate)
      {
        const data = await FARM.getImage(projectID.id, selectedDate)
        console.log("Data img: ", data.data)
        setImageData(data.data.images)
      }
    }
    fetchData();
    console.log("image data: ", imageData)
  }, [selectedDate]);


  return (
    <>
      <Row>
        <Col span={12}>
        <div>
          <h1>List of Processes</h1>
          {processData? <>
            <AddProcessPopUp />
            <ProcessList processes={processData} />
          </> : <Loading />}
        </div>
        </Col>
        <Col span={12}>
          <div>
            <h1>List of Expect</h1>
            {processData? <>
              <AddExpectPopup />
              <ExpectList expects={expectData} />
            </> : <Loading />}
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
        <h2> Thoi tiet hom nay nang, 30 do, do am la 100</h2>
        </Col>
      </Row>
      {
        imageData ?
        Array.from({ length: rows }, (_, rowIndex) => (
          <Row key={rowIndex}>
            {Array.from({ length: cols }, (_, colIndex) => {
              const index = rowIndex * cols + colIndex;
              let imageUrl='https://www.greenqueen.com.hk/wp-content/uploads/2020/12/Veganic-Farming.png'
              if(index < imageData.length)
                {
                  imageUrl = imageData[index]?.imageUrl;
                  console.log("Image url: ", imageUrl, index)
                }
              console.log(imageUrl, index)

              return imageUrl ? (
                <Col span={24 / imagesPerRow} key={colIndex} style={{ padding: 4 }}>
                  <div style={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
                    <Image
                      class={'process-img'}
                      src={imageUrl}
                    />
                  </div>
                </Col>
              ) : null;
            })}
          </Row>
        )) : <Loading />
      }
    </>
  );
};

export default ProjectProcess;

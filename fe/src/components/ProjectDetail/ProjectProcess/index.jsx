import React from 'react';
import { Col, Row, DatePicker } from 'antd';
import { useState } from 'react';
import { useEffect } from 'react';
import ProcessList from '../Process/ProcessList'
import AddProcessPopUp from '../Process/AddProcessPopup'
import ExpectList from '../Expect/ExpectList'
import AddExpectPopup from '../Expect/AddExpectPopup'
import { Image } from 'antd';
import './style.css'

const ProjectProcess = () => {
  const totalImages = 24;
  const rows = 4;
  const cols = 6;
  const imagesPerRow = totalImages / rows;

  const imageArray = new Array(totalImages).fill('https://www.greenqueen.com.hk/wp-content/uploads/2020/12/Veganic-Farming.png');
  const processes = [
    {
      date: '2023-10-15',
      type: 'phân bón',
      name: 'Phân bón X',
      amount: '50 kg',
      note: 'Áp dụng theo hướng dẫn.',
    },
    {
      date: '2023-06-15',
      type: 'BVTV',
      name: 'BVTV Y',
      amount: '10 kg',
      note: 'Do cay bi sau benh',
    },
    {
      date: '2023-10-20',
      type: 'tưới nước',
      note: 'Tưới nước hàng ngày.',
    },
    // Thêm các quá trình khác vào danh sách
  ];

  const expects = [
    {
      date: '2023-10-15',
      amount: '50 kg',
      note: '',
    },
    {
      date: '2023-06-15',
      amount: '40 kg',
      note: 'Do cay bi sau benh',
    },
    // Thêm các quá trình khác vào danh sách
  ];


  // Tạo ngày hôm nay bằng thư viện moment
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const today = new Date(); // Lấy ngày hôm nay
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Thêm số 0 phía trước nếu cần
    const day = today.getDate().toString().padStart(2, '0'); // Thêm số 0 phía trước nếu cần
    const formattedDate = `${year}-${month}-${day}`;

    setSelectedDate(formattedDate);
  }, []);

  return (
    <>
      <Row>
        <Col span={12}>
        <div>
          <h1>List of Processes</h1>
          <ProcessList processes={processes} />
          <AddProcessPopUp />
        </div>
        </Col>
        <Col span={12}>
          <div>
            <h1>List of Expect</h1>
            <ExpectList expects={expects} />
            <AddExpectPopup />
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
      {Array.from({ length: rows }, (_, rowIndex) => (
        <Row key={rowIndex}>
          {Array.from({ length: cols }, (_, colIndex) => {
            const index = rowIndex * cols + colIndex;
            const imageUrl = imageArray[index];

            return imageUrl ? (
              <Col span={24 / imagesPerRow} key={colIndex} style={{ padding: 4 }}>
                <div style={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
                  <Image
                    class={'process-img'}
                    src={imageUrl}
                    onError={(e) => {
                      e.target.style.display = 'none'; // Ẩn hình ảnh nếu URL không hợp lệ
                    }}
                  />
                </div>
              </Col>
            ) : null;
          })}
        </Row>
      ))}
    </>
  );
};

export default ProjectProcess;

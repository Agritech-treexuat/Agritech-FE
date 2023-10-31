import React from 'react';
import { Col, Row, DatePicker } from 'antd';
import moment from 'moment';

const ProjectProcess = () => {
  const totalImages = 24;
  const rows = 4;
  const cols = 6;
  const imagesPerRow = totalImages / rows;

  const imageArray = new Array(totalImages).fill('https://www.greenqueen.com.hk/wp-content/uploads/2020/12/Veganic-Farming.png');
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Tạo ngày hôm nay bằng thư viện moment
  const today = moment();

  return (
    <>
      <Row>
        <Col span={24}>
        <DatePicker
            placeholder={today.format('YYYY-MM-DD')} // Sử dụng ngày hôm nay làm giá trị placeholder
            defaultValue={today} // Đặt giá trị mặc định cho DatePicker
            format="YYYY-MM-DD" // Định dạng ngày
            onChange={handleDateChange}
          />
        </Col>
      </Row>
      <Row>
        <Col span={8}>col-8</Col>
        <Col span={8}>col-8</Col>
        <Col span={8}>col-8</Col>
      </Row>
      {Array.from({ length: rows }, (_, rowIndex) => (
        <Row key={rowIndex}>
          {Array.from({ length: cols }, (_, colIndex) => {
            const index = rowIndex * cols + colIndex;
            const imageUrl = imageArray[index];

            return imageUrl ? (
              <Col span={24 / imagesPerRow} key={colIndex} style={{ padding: 4 }}>
                <div style={{ position: 'relative', width: '100%', paddingBottom: '100%' }}>
                  <img
                    src={imageUrl}
                    alt={`Image ${index + 1}`}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                    }}
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

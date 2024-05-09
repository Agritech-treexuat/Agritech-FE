import React from 'react'
import { Modal, Button, Input, InputNumber, DatePicker } from 'antd'
import dayjs from 'dayjs'

const LargeDescriptionModal = ({
  visible,
  onCancel,
  onSubmit,
  description,
  setDescription,
  square,
  setSquare,
  expectedEndDate,
  setExpectedEndDate,
  expectedOutput,
  setExpectedOutput
}) => {
  // Chuyển đổi expectedEndDate từ Day.js Date Object sang JavaScript Date Object
  const handleExpectedEndDateChange = (date) => {
    setExpectedEndDate(date.toDate())
  }

  return (
    <Modal
      title="Nhập diện tích và mô tả"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            onSubmit()
            onCancel()
          }}
        >
          Xác nhận
        </Button>
      ]}
      width={800} // Kích thước modal
    >
      <DatePicker
        value={expectedEndDate ? dayjs(expectedEndDate) : null}
        onChange={handleExpectedEndDateChange}
        placeholder="Chọn ngày dự kiến kết thúc..."
        style={{ width: '100%', marginBottom: 10 }}
      />
      <InputNumber
        value={expectedOutput}
        onChange={(value) => setExpectedOutput(value)}
        placeholder="Nhập sản lượng dự kiến..."
        style={{ width: '100%', marginBottom: 10 }}
        addonAfter="kg"
      />
      <InputNumber
        value={square}
        onChange={(value) => setSquare(value)}
        addonAfter="m2"
        placeholder="Nhập diện tích..."
        style={{ width: '100%', marginBottom: 10 }}
      />
      <Input.TextArea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Nhập mô tả..."
        autoSize={{ minRows: 10 }} // Số hàng tối thiểu
        style={{ width: '100%' }} // Chiều rộng
      />
    </Modal>
  )
}

export default LargeDescriptionModal

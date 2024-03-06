import React from 'react'
import { Modal, Button, Input } from 'antd'

const LargeDescriptionModal = ({ visible, onCancel, onSubmit, description, setDescription }) => {
  return (
    <Modal
      title="Nhập Mô tả"
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

import { Modal, Form, Input, Upload, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import token from '../../../utils/token'
const { getAccessToken, getRefreshToken } = token

const UpdateSeedInfo = ({ visible, onCreate, onCancel, isUpdate, seed }) => {
  const [form] = Form.useForm()

  const onFinish = (values) => {
    // Gửi giá trị của form (values) đến hàm onCreate để thêm hạt giống
    onCreate(values)
    form.resetFields()
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const handleUploadChange = (info) => {
    console.log('info', info)
  }

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }

  const uploadProps = {
    action: 'http://127.0.0.1:3052/v1/api/upload/single',
    method: 'post',
    accept: 'image/*',
    name: 'file',
    headers: {
      authorization: getAccessToken(),
      'x-rtoken-id': getRefreshToken()
    },
    listType: 'picture'
  }

  return (
    <Modal
      open={visible}
      title={isUpdate ? 'Cập nhật hạt giống' : 'Thêm hạt giống'}
      okText={isUpdate ? 'Cập nhật' : 'Thêm'}
      cancelText="Hủy"
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields()
            onFinish(values)
          })
          .catch((info) => {
            console.log('Validate Failed:', info)
          })
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={
          isUpdate
            ? {
                _id: seed?._id,
                description: seed?.description,
                thumb: [
                  {
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: seed?.image
                  }
                ]
              }
            : {}
        }
      >
        <Form.Item
          name="thumb"
          label="Thumbnail"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra="Chọn ảnh thumbnail"
        >
          <Upload {...uploadProps} maxCount={1} onChange={handleUploadChange}>
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>
        <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UpdateSeedInfo

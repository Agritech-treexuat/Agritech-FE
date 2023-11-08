import React from 'react';
import { Button, Form, Input, Select, InputNumber, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import FARM from '../../../services/farmService'
import { useParams } from 'react-router';
import './style.css';
const { Option } = Select;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};
const normFile = (e) => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const testForm = null;
const seeds = ['Seed A', 'Seed B', 'Seed C', 'Seed D'];

const UpdateInputForm = ({ handleCloseForm, input, setInitData }) => {
  const params = useParams()
  console.log("input form: ", input)
  const dateObj = new Date(input.initDate);

  const yearData = dateObj.getFullYear();
  const monthData = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const dateData = dateObj.getDate().toString().padStart(2, '0');

  const formattedDate = `${yearData}-${monthData}-${dateData}`;
  const formRef = React.useRef(null);
  const initValue = {
    'date': formattedDate,
    'seed': input.seed,
    'amount': input.amount,
    'upload': input.images
  };

  const onFinish = (values) => {
    console.log("Values: ", values);
    const images = values.upload.map(item => (typeof item === 'string' ? item : item.name));
    console.log("images here: ", images)
    const updatedValue = { ...values, initDate: values.date, images: images };
    delete updatedValue.date;
    delete updatedValue.upload;
    console.log(updatedValue);
    const data = {
      "tx": "b",
      ...updatedValue
    }
    handleSubmitInput(data, params.id)
  };

  const handleSubmitInput = async (data, projectId)=> {
    try {
      console.log("data to send: ", data, projectId)
      const res = await FARM.editInput(data, projectId);
      console.log("res: ", res)
      setInitData(res.data.updatedInput)
      handleCloseForm();
    } catch (error) {
        console.error(error?.response?.data?.message);
    }
  }


  return (
    <Form
      {...layout}
      ref={formRef}
      name="control-ref"
      onFinish={onFinish}
      initialValues={initValue}
      style={{
        maxWidth: 600,
      }}
    >
      {/* date */}
      <Form.Item
        name="date"
        label="Ngày bắt đầu"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input type="date" />
      </Form.Item>
      {/* seed */}
      <Form.Item
        name="seed"
        label="Hạt giống"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select placeholder="Select a seed">
          {seeds.map((seed) => (
                <Option key={seed} value={seed}>
                  {seed}
                </Option>
              ))}
        </Select>
      </Form.Item>
      {/* amount */}
      <Form.Item
        name="amount"
        label="Lượng"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <InputNumber defaultValue={3} />
      </Form.Item>

      <Form.Item
        name="upload"
        label="Ảnh"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload name="logo" action="/upload.do" listType="picture">
          <Button icon={<UploadOutlined />}>Đăng ảnh</Button>
        </Upload>
      </Form.Item>
      {/* submit button */}
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
        Cập nhật
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateInputForm;

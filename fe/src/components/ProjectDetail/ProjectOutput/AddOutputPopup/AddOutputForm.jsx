import { Button, Form, Input, InputNumber, Select, Upload } from 'antd';
import { useRef } from 'react';
import './style.css';
import { UploadOutlined } from '@ant-design/icons';
import { useParams } from 'react-router';
import FARM from '../../../../services/farmService'

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

const AddOutputForm = ({ handleCloseForm }) => {
  const formRef = useRef(null);
  const params = useParams()

  const onFinish = (values) => {
    console.log("Values: ", values);
    const images = values.upload.map((upload) => upload.name)
    const updatedValue = { ...values, time: values.date, amount_perOne: values['amount per one'], images: images };
    delete updatedValue.date;
    delete updatedValue['amount per one'];
    delete updatedValue.upload
    const data = {
      "tx": "b",
      ...updatedValue
    }
    handleSubmitOutput(data, params.id)
  };

  const handleSubmitOutput = async (data, projectId )=> {
    try {
      console.log("data to send: ", data, projectId)
      const res = await FARM.addOutput(data, projectId);
      console.log("res: ", res)
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
      style={{
        maxWidth: 600,
      }}
    >
      {/* date */}
      <Form.Item
        name="date"
        label="Date"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input type="date" />
      </Form.Item>
      {/* amount */}
      <Form.Item
        name="amount"
        label="Amount"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <InputNumber defaultValue={3} />
      </Form.Item>
      {/* amount per one */}
      <Form.Item
        name="amount per one"
        label="Amount per one"
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
        label="Upload"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload name="logo" action="/upload.do" listType="picture">
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
      </Form.Item>
      {/* submit button */}
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddOutputForm;

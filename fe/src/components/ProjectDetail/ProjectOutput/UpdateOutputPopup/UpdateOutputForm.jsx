import React from 'react';
import { Button, Form, Input, Select, InputNumber, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import FARM from '../../../../services/farmService'
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

const UpdateOutputForm = ({ handleCloseForm, output }) => {
  const params = useParams()
  const dateObj = new Date(output.time);

  const yearData = dateObj.getFullYear();
  const monthData = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const dateData = dateObj.getDate().toString().padStart(2, '0');

  const formattedDate = `${yearData}-${monthData}-${dateData}`;
  const formRef = React.useRef(null);
  const initValue = {
    'date': formattedDate,
    'amount': output.amount,
    'amount per one': output.amount_perOne,
    'upload': output.images
  };

  const onFinish = (values) => {
    console.log("Values: ", values);
    const images = values.upload.map(item => (typeof item === 'string' ? item : item.name));
    console.log("images here: ", images)
    const updatedValue = { ...values, time: values.date, amount_perOne: values['amount per one'], images: images };
    delete updatedValue.date;
    delete updatedValue.upload;
    delete updatedValue['amount per one'];
    console.log(updatedValue);
    const data = {
      "tx": "b",
      ...updatedValue
    }
    handleSubmitOutput(data, params.id, output._id)
  };

  const handleSubmitOutput = async (data, projectId, outputId )=> {
    try {
      console.log("data to send: ", data, projectId)
      const res = await FARM.editOutput(data, projectId, outputId);
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
      initialValues={initValue}
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
        <InputNumber />
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
        <InputNumber />
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

export default UpdateOutputForm;

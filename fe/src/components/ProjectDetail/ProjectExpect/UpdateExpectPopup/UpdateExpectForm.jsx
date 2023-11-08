import React from 'react';
import { Button, Form, Input, Select, InputNumber } from 'antd';
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

const testForm = null;

const UpdateExpectForm = ({ handleCloseForm, expect, setExpectData }) => {
  const params = useParams()
  const dateObj = new Date(expect.time);

  const yearData = dateObj.getFullYear();
  const monthData = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const dateData = dateObj.getDate().toString().padStart(2, '0');

  const formattedDate = `${yearData}-${monthData}-${dateData}`;
  const formRef = React.useRef(null);
  const initValue = {
    'date': formattedDate,
    'amount': expect.amount,
    'note': expect.note
  };

  const onFinish = (values) => {
    const updatedValue = { ...values, time: values.date };
    delete updatedValue.date;
    console.log(updatedValue);
    const data = {
      "tx": "b",
      ...updatedValue
    }
    handleSubmitexpect(data, params.id, expect._id)
  };

  const handleSubmitexpect = async (data, projectId, expectId )=> {
    try {
      console.log("data to send: ", data, projectId)
      const res = await FARM.editExpect(data, projectId, expectId);
      console.log("res: ", res)
      setExpectData(res.data.updatedExpect)
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
        label="Thời gian"
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
        label="Lượng"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <InputNumber />
      </Form.Item>
      {/* note */}
      <Form.Item
        name="note"
        label="Ghi chú"
      >
        <Input />
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

export default UpdateExpectForm;

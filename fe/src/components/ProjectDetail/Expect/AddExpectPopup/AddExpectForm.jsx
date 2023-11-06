import React from 'react';
import { Button, Form, Input, InputNumber, Select } from 'antd';
import './style.css';
import FARM from '../../../../services/farmService'
import { useParams } from 'react-router';
import { useStateContext } from '../../../../context';
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

const AddExpectForm = ({ handleCloseForm, setExpectData }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Cần thêm 1 vào tháng vì tháng bắt đầu từ 0
  const date = today.getDate().toString().padStart(2, '0');

  const currentDate = `${year}-${month}-${date}`;
  const formRef = React.useRef(null);
  const params = useParams()
  const { insertExpect, connect, address } = useStateContext();

  const onFinish = (values) => {
    console.log("Values: ", values);

    const updatedValue = { ...values, time: values.date };
    delete updatedValue.date;
    console.log(updatedValue);
    const data = {
      "tx": "b",
      ...updatedValue
    }
    handleSubmitExpect(data, params.id)
  };

  const handleSubmitExpect = async (data, projectId )=> {
    try {
      console.log("data to send: ", data, projectId)
      const res = await FARM.addExpect(data, projectId);
      console.log("res: ", res)
      setExpectData(res.data.updatedProjectExpect)
      handleCloseForm();
    } catch (error) {
        console.error(error?.response?.data?.message);
    }
  }

  return (
    <Form
      {...layout}
      ref={formRef}
      initialValues={
        {
          'date': currentDate,
          'amount': 1000,
          'note': ''
        }
      }
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
        <InputNumber />
      </Form.Item>
      {/* note */}
      <Form.Item
        name="note"
        label="Note"
      >
        <Input />
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

export default AddExpectForm;

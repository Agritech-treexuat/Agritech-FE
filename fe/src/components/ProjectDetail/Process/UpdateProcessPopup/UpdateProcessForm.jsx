import React from 'react';
import { Button, Form, Input, Select } from 'antd';
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

const fertilizers = ["NHK", "Kali", "Other name"];
const bvtvs = ["BVTV1", "BVTV2", "Other name"];

const UpdateProcessForm = ({ handleCloseForm, process }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Cần thêm 1 vào tháng vì tháng bắt đầu từ 0
  const date = today.getDate().toString().padStart(2, '0');

  const currentDate = `${year}-${month}-${date}`;
  console.log("Today: ", currentDate)
  const params = useParams()
  const dateObj = new Date(process.time);

  const yearData = dateObj.getFullYear();
  const monthData = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const dateData = dateObj.getDate().toString().padStart(2, '0');

  const formattedDate = `${yearData}-${monthData}-${dateData}`;
  const formRef = React.useRef(null);
  let initValue = {
    'date': formattedDate,
    'type': process.type,
    'note': process.note
  };

  if (process.type === 'phân bón') {
    if (fertilizers.includes(process.name)) {
      initValue = {
        'date': formattedDate,
        'type': process.type,
        'name': process.name,
        'amount': process.amount,
        'note': process.note
      };
    } else {
      initValue = {
        'date': formattedDate,
        'type': process.type,
        'name': 'Other name',
        'other name': process.name,
        'amount': process.amount,
        'note': process.note
      };
    }
  } else if (process.type === 'BVTV') {
    if (bvtvs.includes(process.name)) {
      initValue = {
        'date': formattedDate,
        'type': process.type,
        'name': process.name,
        'amount': process.amount,
        'note': process.note
      };
    } else {
      initValue = {
        'date': formattedDate,
        'type': process.type,
        'name': 'Other name',
        'other name': process.name,
        'amount': process.amount,
        'note': process.note
      };
    }
  }
  console.log("process: ", process)
  console.log("init: ", initValue)

  const onFinish = (values) => {
    console.log("Values: ", values);
    if ('other name' in values) {
      values.name = values['other name'];
    }
    const updatedValue = { ...values, time: values.date };
    delete updatedValue.date;
    console.log(updatedValue);
    const data = {
      "tx": "b",
      ...updatedValue
    }
    console.log("test form: ", testForm)
    handleSubmitProcess(data, params.id, process._id)
  };

  const handleSubmitProcess = async (data, projectId, processId )=> {
    try {
      console.log("data to send: ", data, projectId)
      const res = await FARM.editProcess(data, projectId, processId);
      console.log("res: ", res)
      handleCloseForm();
    } catch (error) {
        console.error(error?.response?.data?.message);
    }
  }


  return (
    <Form
      {...layout}
      form={testForm}
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
      {/* type */}
      <Form.Item
        name="type"
        label="Type"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select placeholder="Select a type">
          <Option value="phân bón">Phân bón</Option>
          <Option value="BVTV">BVTV</Option>
          <Option value="other">Other</Option>
        </Select>
      </Form.Item>
      {/* item whe check type */}
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
      >
        {({ getFieldValue }) => (
          getFieldValue('type') === 'phân bón' || getFieldValue('type') === 'BVTV' ? (
            <div>
              {/* name */}
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select placeholder="Select a name">
                  {getFieldValue('type') === 'phân bón'
                    ? fertilizers.map((fertilizer) => (
                        <Option key={fertilizer} value={fertilizer}>
                          {fertilizer}
                        </Option>
                      ))
                    : bvtvs.map((bv) => (
                        <Option key={bv} value={bv}>
                          {bv}
                        </Option>
                      ))
                    }
                </Select>
              </Form.Item>
              {/* when have other name */}
              <Form.Item
                noStyle
                shouldUpdate={(prevValues2, currentValues2) => prevValues2.name !== currentValues2.name}
              >
                {({ getFieldValue }) => (
                  getFieldValue('name') === 'Other name' ? (
                    <Form.Item
                      name="other name"
                      label="OtherName"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  ) : null
                )}
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
                <Input />
              </Form.Item>
              {/* note */}
              <Form.Item
                name="note"
                label="Note"
              >
                <Input />
              </Form.Item>
            </div>
          ) : (
            // note
            <Form.Item
              name="note"
              label="Note"
            >
              <Input />
            </Form.Item>
          )
        )}
      </Form.Item>
      {/* submit button */}
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Update
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateProcessForm;

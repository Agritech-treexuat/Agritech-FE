// src/components/CreateProject.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './style.css'
import { useStateContext } from '../../context';
import CustomButton from '../../components/CustomButton';
import { Button, Form, Input, InputNumber, Select, Upload } from 'antd';
import { useRef } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import FARM from '../../services/farmService';
import { redirect } from "react-router-dom";
import { layout, tailLayout, normFile } from './helper'
const { Option } = Select;

const CreateProject = () => {
  const { createProject, connect, address } = useStateContext();
  const farmId = localStorage.getItem('id')
  const formRef = useRef(null);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const onFinish = (values) => {
    console.log(values);
    if(address) handleSave(values)
    else connect();
  };

  // Mock seed data
  const seeds = ['Seed A', 'Seed B', 'Seed C', 'Seed D'];

  const handleSave = async (values) => {
    // Handle project creation and data submission here
    console.log("address: ", address)
    // console.log("data: ", startDate, selectedSeed, amount, image, expected)
    const input = values.date + values.amount + values.name + values.expected
    const receip = await createProject(values.seed, input)
    const txhash = receip? receip.transactionHash : 'b'
    console.log("tx hash: ", txhash)
    handleInit(values, txhash)
  };

  const handleInit = async (values, txhash) => {
    try {
      const images = values.upload.map((upload) => upload.name)
      let formData = new FormData();
      formData.append('name', values.name)
      formData.append('tx', txhash)
      formData.append('initDate', values.date)
      formData.append('seed', values.seed)
      formData.append('amount', values.amount)
      fileList.forEach((file) => {
        formData.append('images', file);
      });
      setUploading(true);
      const data = formData
      const res = await FARM.initProject(data)
      console.log("res: ", res)
      const newPrj = res.data.project
      handleAddExpect(values, newPrj._id, txhash)
    } catch (error) {
        console.error(error?.response?.data?.message);
    }
  }

  const handleAddExpect = async (values, projectId, txhash) => {
    try {
      const data = {
        "tx": txhash,
        "amount": values.expected,
        "note": "init project expected",
        "time": values.date
      }
      const res = await FARM.addExpect(data, projectId)
      console.log("res: ", res)
      return redirect('/home')
    } catch (error) {
        console.error(error?.response?.data?.message);
    }
  }

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  return (
    <div className="create-project-container">
      <h1>Create Project</h1>
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
        <Input/>
      </Form.Item>
      {/* seed */}
      <Form.Item
        name="seed"
        label="Seed"
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
        label="Amount"
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
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
      </Form.Item>
      {/* expected */}
      <Form.Item
        name="expected"
        label="Expected"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <InputNumber defaultValue={30} />
      </Form.Item>
      {/* submit button */}
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
        {address ? 'Create' : 'Connect'}
        </Button>
      </Form.Item>
    </Form>
    </div>
  );
};

export default CreateProject;

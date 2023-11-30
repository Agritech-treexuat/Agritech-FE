import React, { useState } from "react";
import FARM from "../../../services/farmService";
import { useParams } from "react-router";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import {
  Col,
  Row,
  Image,
  Card,
  Button,
  Table,
  Column,
  ColumnGroup,
  Form,
  Input,
  Modal,
  Divider,
  Flex,
  Select,
  DatePicker,
} from "antd";
import { HistoryOutlined, EditFilled } from "@ant-design/icons";

import Loading from "../../../pages/Loading";
import MenuDivider from "antd/es/menu/MenuDivider";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const CollectionCreateForm = ({ open, onCreate, onCancel, initData }) => {
  const [form] = Form.useForm();
  console.log("init dât; ", initData);
  return initData.length > 0 ? (
    <Modal
      open={open}
      title="Thêm mới"
      okText="Thêm"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        form={form}
        {...layout}
        name="form_in_modal"
        initialValues={{
          modifier: "public",
        }}
      >
        <Form.Item
          name="startDate"
          label="Ngày bắt đầu"
        >
          <DatePicker
            defaultValue={dayjs(new Date()).add(1, "day")}
            placeholder="Chọn ngày giao"
            style={{ width: "100%" }}
          />
        </Form.Item>
        {initData[0].plants?.map((data, i) => (
          <div>
            <Form.Item
              name={data.name}
              label={data.name}
            >
              <Input type="number" defaultValue={0} addonAfter="kg"/>
            </Form.Item>
          </div>
        ))}
      </Form>
    </Modal>
  ) : <Loading />;
};
const GardenProjectOutput = () => {
  const [open, setOpen] = useState(false);
  const onCreate = (values) => {
    console.log("Received values of form: ", values);
    
    setOpen(false);
  };
  const [initData, setInitData] = useState([]);
  const [deliveried, setDeliveried] = useState([]);
  const [notDeliveried, setNotDeliveried] = useState([]);
  const projectID = useParams();
  console.log("params: ", projectID);
  console.log(deliveried);

  useEffect(() => {
    // 1 là đã giao, 0 là chưa giao
    setInitData([
      {
        time: new Date().toISOString(),
        plants: [
          { name: "Cây 1", amount: 5 },
          { name: "Cây 2", amount: 5 },
          { name: "Cây 3", amount: 0 },
          { name: "Cây 4", amount: 0 },
        ],
        status: 1,
      },
      {
        time: new Date().toISOString(),
        plants: [
          { name: "Cây 1", amount: 5 },
          { name: "Cây 1", amount: 5 },
        ],
        status: 1,
      },
      {
        time: new Date().toISOString(),
        plants: [
          { name: "Cây 1", amount: 5 },
          { name: "Cây 1", amount: 5 },
        ],
        status: 1,
      },
      {
        time: new Date().toISOString(),
        plants: [
          { name: "Cây 1", amount: 5 },
          { name: "Cây 1", amount: 5 },
        ],
        status: 0,
      },
    ]);
  }, []);

  useEffect(() => {
    console.log("Init: ", initData);
    // 1 là đã giao, 0 là chưa giao
    setDeliveried(initData.filter((i) => i.status === 1));
  }, [initData]);

  useEffect(() => {
    // 1 là đã giao, 0 là chưa giao
    setNotDeliveried(initData.filter((i) => i.status === 0));
  }, [initData]);

  const columns = [
    {
      title: "Ngày",
      dataIndex: "date",
      width: 300,
      key: "date",
      render: (_, record) => <div>{record?.time}</div>,
    },
    {
      title: "Thông tin",
      key: "value",
      dataIndex: "value",
      render: (_, record) => (
        <div>
          {record.plants.map((plant) => (
            <div>
              {plant.amount > 0 ? (
                <div>
                  Cây: {plant?.name} - {plant?.amount} kg
                </div>
              ) : (
                <div></div>
              )}
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div>
      {initData ? (
        <div>
          <Button
            type="primary"
            onClick={() => {
              setOpen(true);
            }}
          >
            Thêm
          </Button>
          <CollectionCreateForm
            open={open}
            onCreate={onCreate}
            onCancel={() => {
              setOpen(false);
            }}
            initData={initData}
          />
          <h2 style={{ marginBottom: "1rem" }}>Sắp giao</h2>
          <Table
            bordered={true}
            columns={columns}
            dataSource={notDeliveried}
          />{" "}
          <h2 style={{ marginBottom: "1rem", marginTop: "1rem" }}>Đã giao</h2>
          <Table
            bordered={true}
            columns={columns}
            dataSource={deliveried}
          />{" "}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default GardenProjectOutput;

import React, { useState } from "react";
import FARM from "../../../services/farmService";
import { useParams } from "react-router";
import { useEffect } from "react";
import {
  Collapse,
  Col,
  Row,
  Image,
  Card,
  Tooltip,
  Form,
  Input,
  Modal,
  Radio,
  Button,
  Flex,
  InputNumber,
  Upload,
  Select,
  DatePicker,
  notification,
  Divider,
} from "antd";
import { EditFilled, UploadOutlined } from "@ant-design/icons";
import Loading from "../../../pages/Loading";
import "./style.css";

const { Meta } = Card;

const mainContent = {
  id: "1",
  transaction_hash: "adakdhakjdsas",
  //Cây
  seeds: [
    {
      id: "1",
      name: "cây 1",
      seed: "abc",
      startDate: "23/11/2023",
      amount: 10000,
      img: [
        "https://st.depositphotos.com/2632165/4026/i/450/depositphotos_40264933-stock-photo-young-plant.jpg",
      ],
      plan: [
        {
          time: "12h",
          note: "note",
          type: "type select",
          cultivativeItems: [
            {
              name: "name",
              amount_per_ha: 12,
            },
            {
              name: "name",
              amount_per_ha: 12,
            },
          ],
        },
        {
          time: "14h",
          note: "note",
          type: "type select",
          cultivativeItems: [
            {
              name: "name",
              amount_per_ha: 12,
            },
            {
              name: "name",
              amount_per_ha: 12,
            },
          ],
        },
      ],
    },
    {
      id: "1",
      name: "cây 2",
      seed: "Hạt giống",
      startDate: "23/11/2023",
      amount: 1000,
      img: [
        "https://st.depositphotos.com/2632165/4026/i/450/depositphotos_40264933-stock-photo-young-plant.jpg",
      ],
      plan: [
        {
          time: "12h",
          note: "note",
          type: "type select",
          cultivativeItems: [
            {
              name: "name",
              amount_per_ha: 12,
            },
            {
              name: "name",
              amount_per_ha: 12,
            },
          ],
        },
      ],
    },
    {
      id: "1",
      name: "cây 3",
      seed: "Hạt giống",
      startDate: "23/11/2023",
      amount: 1000,
      img: [
        "https://st.depositphotos.com/2632165/4026/i/450/depositphotos_40264933-stock-photo-young-plant.jpg",
      ],
      plan: [
        {
          time: "12h",
          note: "note",
          type: "type select",
          cultivativeItems: [
            {
              name: "name",
              amount_per_ha: 12,
            },
            {
              name: "name",
              amount_per_ha: 12,
            },
          ],
        },
      ],
    },
  ],
};

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const CollectionCreateForm = ({ open, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      open={open}
      title="Create a new collection"
      okText="Create"
      cancelText="Cancel"
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
          name="title"
          label="Title"
          rules={[
            {
              required: true,
              message: "Please input the title of collection!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input type="textarea" />
        </Form.Item>
        <Form.Item
          name="modifier"
          className="collection-create-form_last-form-item"
        >
          <Radio.Group>
            <Radio value="public">Public</Radio>
            <Radio value="private">Private</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const items = mainContent.seeds?.map((plant, index) => {
  plant.key = index.toString();
  plant.label = plant.name.charAt(0).toUpperCase() + plant.name.slice(1);
  plant.children = (
    <div>
      <div style={{ cursor: "pointer" }}>
        <EditFilled style={{ color: "#476930", fontSize: "18px" }} />
        {"  "}Chỉnh sửa thông tin
      </div>
      <div>
        <p>
          <strong>Tên hạt giống:</strong> {plant.name}
        </p>
        <p>
          <strong>Lượng:</strong> {plant.amount}
        </p>
        {plant.plan.map((p) => (
          <div>
            <Divider orientation="center" style={{ fontSize: "20px" }}>
              Thời gian: {p.time}
            </Divider>
            <p>
              <strong>Ghi chú:</strong> {p.note}
            </p>
            <p>
              <strong>Type:</strong> {p.type}
            </p>
            <p style={{ fontSize: "16px", textAlign: "center" }}>
              <strong>
                <i>Chi tiết hoạt động </i>
              </strong>
            </p>
            {p.cultivativeItems.map((i) => (
              <div>
                <Divider></Divider>
                <p>Tên: {i.name}</p>
                <p>Số lượng trên ha: {i.amount_per_ha}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
  return plant;
});

const GardenProjectTemplate = () => {
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5,
    });
  };
  const [initData, setInitData] = useState(null);
  const projectID = useParams();
  console.log("params: ", projectID);
  const [open, setOpen] = useState(false);
  const onCreate = (values) => {
    console.log("Received values of form: ", values);
    setOpen(false);
  };

  useEffect(() => {
    setInitData(mainContent);
  }, []);

  return (
    <div>
      {contextHolder}
      {setInitData ? (
        <div>
          <Button
            type="primary"
            onClick={() => {
              setOpen(true);
            }}
          >
            Thêm cây
          </Button>
          <CollectionCreateForm
            open={open}
            onCreate={onCreate}
            onCancel={() => {
              setOpen(false);
            }}
          />
          <div>
            <Collapse
              style={{ marginTop: "1.5rem" }}
              items={items}
              defaultActiveKey={["1"]}
            />
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default GardenProjectTemplate;

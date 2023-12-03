import React, { useState } from "react";
import FARM from "../../../services/farmService";
import { useParams } from "react-router";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTree } from "@fortawesome/free-solid-svg-icons";
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
            {
              name: "name",
              amount_per_ha: 12,
            },
            {
              name: "name",
              amount_per_ha: 12,
            },
            {
              name: "name",
              amount_per_ha: 12,
            },
            {
              name: "name",
              amount_per_ha: 12,
            },
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

const CollectionCreateForm = ({ open, onCreate, onCancel, listPlant }) => {
  const [form] = Form.useForm();

  const handlePlantChange = (value) => {
    console.log(value);
  };
  return (
    <Modal
      open={open}
      title="Thêm cây"
      okText="Tạo mới"
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
          name="plant"
          label="Chọn cây"
          rules={[
            {
              required: true,
              message: "Trường thông tin không được để trống!",
            },
          ]}
        >
          <Select
            showSearch
            style={{
              width: "100%",
            }}
            placeholder="Chọn cây"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label.toLocaleLowerCase() ?? "").includes(
                input.toLowerCase()
              )
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={listPlant?.map((plant) => {
              plant.label = plant.name;
              plant.value = plant.id;
              return plant;
            })}
            onChange={handlePlantChange}
          />
        </Form.Item>
        <Form.Item
          name="template"
          label="Template"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select placeholder="Chọn template">
            {/* <Option value="default">Default</Option>
            <Option value="none">Empty</Option> */}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const items = mainContent.seeds?.map((plant, index) => {
  plant.key = index.toString();
  plant.label = (
    <div>
      <FontAwesomeIcon icon={faTree} style={{ color: "#476930" }} />{" "}
      <span>{`${plant.name.charAt(0).toUpperCase()} ${plant.name.slice(
        1
      )}`}</span>
    </div>
  );
  plant.children = (
    <div>
      <div style={{ cursor: "pointer" }}>
        <EditFilled style={{ color: "#86B049", fontSize: "18px" }} />
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
            <Divider orientation="center" style={{ fontSize: "18px" }}>
              Thời gian: {p.time}
            </Divider>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              <p style={{ width: "25%" }}>
                <strong>Ghi chú:</strong> {p.note}
              </p>
              <p style={{ width: "25%" }}>
                <strong>Type:</strong> {p.type}
              </p>
            </div>
            <p style={{ fontSize: "16px", margin: '0 1rem' }}>
              <strong>
                <Divider orientation="left" style={{marginRight: '1rem', width: '80%'}}>
                  <i>Chi tiết hoạt động </i>
                </Divider>
              </strong>
            </p>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {p.cultivativeItems.map((i) => (
                <div
                  style={{
                    width: "25%",
                    backgroundColor: "#fff",
                    marginBottom: "1rem",
                  }}
                >
                  <p>Tên: {i.name}</p>
                  <p>Số lượng trên ha: {i.amount_per_ha}</p>
                </div>
              ))}
            </div>
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
            listPlant={mainContent.seeds}
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

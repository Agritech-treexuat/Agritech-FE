import React from "react";
import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Flex,
  Form,
  Modal,
  Radio,
  InputNumber,
  Divider,
  Tooltip,
  notification,
} from "antd";
import { EditFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Loading from "../Loading";
import { Card, Space } from "antd";
import FARM from "../../services/farmService";
import { useParams } from "react-router";
import "./style.css";
import SERVICE from "../../services/serviceService";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const CollectionCreateForm = ({ open, onCreate, onCancel, template2 }) => {
  const [form] = Form.useForm();
  console.log("ds", template2);
  return (
    <Modal
      destroyOnClose={true}
      open={open}
      title="Template"
      okText={template2 ? "Cập nhật" : "Tạo mới"}
      cancelText="Hủy"
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values, template2);
            console.log(values);
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
        initialValues={template2}
      >
        <Form.Item
          name="square"
          label="Diện tích"
          rules={[
            {
              required: true,
              message: "Trường thông tin này không được để trống!",
            },
          ]}
        >
          <InputNumber addonAfter="M2" style={{ width: 300 }} />
        </Form.Item>
        <Form.Item
          name="price"
          label="Giá tiền"
          rules={[
            {
              required: true,
              message: "Trường thông tin này không được để trống!",
            },
          ]}
        >
          <InputNumber addonAfter="VNĐ" style={{ width: 300 }} />
        </Form.Item>
        <Divider>Chủng loại gieo trồng</Divider>
        <Form.Item
          name="leafyMax"
          label="Rau ăn lá"
          rules={[
            {
              required: true,
              message: "Trường thông tin này không được để trống!",
            },
          ]}
        >
          <InputNumber addonAfter="cây" style={{ width: 300 }} />
        </Form.Item>
        <Form.Item
          name="herbMax"
          label="Rau gia vị"
          rules={[
            {
              required: true,
              message: "Trường thông tin này không được để trống!",
            },
          ]}
        >
          <InputNumber addonAfter="cây" style={{ width: 300 }} />
        </Form.Item>
        <Form.Item
          name="rootMax"
          label="Củ, quả"
          rules={[
            {
              required: true,
              message: "Trường thông tin này không được để trống!",
            },
          ]}
        >
          <InputNumber addonAfter="củ/quả" style={{ width: 300 }} />
        </Form.Item>

        <Divider>Cam ket</Divider>
        <Form.Item
          name="expectedOutput"
          label="San luong du kien"
          rules={[
            {
              required: true,
              message: "Trường thông tin này không được để trống!",
            },
          ]}
        >
          <InputNumber addonAfter="kg" style={{ width: 300 }} />
        </Form.Item>
        <Form.Item
          name="expectDeliveryPerWeek"
          label="So lan giao 1 tuan"
          rules={[
            {
              required: true,
              message: "Trường thông tin này không được để trống!",
            },
          ]}
        >
          <InputNumber addonAfter="lan" style={{ width: 300 }} />
        </Form.Item>
        <Form.Item
          name="expectDeliveryAmount"
          label="So luong 1 lan giao"
          rules={[
            {
              required: true,
              message: "Trường thông tin này không được để trống!",
            },
          ]}
        >
          <InputNumber addonAfter="kg/lan" style={{ width: 300 }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
const ManageTemplate = () => {
  const farmId = localStorage.getItem('id')
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5,
    });
  };
  const [templates, setTemplates] = useState([]);
  const [template, setTemplate] = useState(null);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const onCreate = (values, template2) => {
    console.log("Received values of form: ", values);
    // send data in here
    // setTemplates in here
    async function fetchData() {
      if (template2) {
        const data = await SERVICE.updateServiceTemplate(values, template2._id);
        console.log("Data res: ", data);
        setTemplates(data?.data.allServiceTemplates);
      } else {
        const data = await SERVICE.addServiceTemplate(values);
        setTemplates(data?.data.allServiceTemplates);
      }
    }
    fetchData();
    setOpen(false);
    openNotificationWithIcon("success", "Thông báo", "Cập nhật thành công");
  };

  useEffect(() => {
    async function fetchData() {
      const data = await SERVICE.getServiceTemplate(farmId);
      console.log("Data: ", data.data);
      if (data.data.serviceTemplates) {
        setTemplates(
          data.data.serviceTemplates.map((serviceTemplate) => {
            return {
              _id: serviceTemplate._id,
              square: serviceTemplate.square,
              herbMax: serviceTemplate.herbMax,
              leafyMax: serviceTemplate.leafyMax,
              rootMax: serviceTemplate.rootMax,
              expectedOutput: serviceTemplate.expectedOutput,
              expectDeliveryPerWeek: serviceTemplate.expectDeliveryPerWeek,
              price: serviceTemplate.price,
              expectDeliveryAmount: serviceTemplate.expectDeliveryAmount,
            };
          })
        );
      }
    }
    fetchData();
    // setTemplates([
    //   {
    //     square: 4,
    //     rau_dinh_duong: 3,
    //     leafyMax: 4,
    //     rootMax: 5,
    //     herbMax: 4,
    //     expectedOutput: 4,
    //     price: 3000,
    //   },
    //   {
    //     square: 4,
    //     rau_dinh_duong: 3,
    //     leafyMax: 4,
    //     rootMax: 5,
    //     herbMax: 4,
    //     expectedOutput: 4,
    //     price: 3000,
    //   },
    //   {
    //     square: 4,
    //     rau_dinh_duong: 3,
    //     leafyMax: 4,
    //     rootMax: 5,
    //     herbMax: 4,
    //     expectedOutput: 4,
    //     price: 3000,
    //   },
    //   {
    //     square: 4,
    //     rau_dinh_duong: 3,
    //     leafyMax: 4,
    //     rootMax: 5,
    //     herbMax: 4,
    //     expectedOutput: 4,
    //     price: 3000,
    //   },
    // ]);
  }, []);

  return (
    <div>
      {contextHolder}
      {templates ? (
        <div>
          <h2 style={{ textAlign: "left" }}>Template List</h2>
          <Row>
            <Col span={6}>
              <div style={{ marginBottom: "1.5rem" }}>
                <Button
                  type="primary"
                  onClick={() => {
                    console.log("sdsdsdsds");
                    setTemplate(null);
                    setOpen(true);
                  }}
                >
                  Tạo template mới
                </Button>
                <CollectionCreateForm
                  open={open}
                  onCreate={onCreate}
                  onCancel={() => {
                    setOpen(false);
                  }}
                  template2={template}
                />
              </div>
            </Col>
          </Row>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {templates.map((temp) => (
              <Card
                title={`Diện tích ${temp.square} M2`}
                extra={
                  <Tooltip title="Edit template">
                    <EditFilled
                      onClick={() => {
                        setTemplate(temp);
                        setOpen(true);
                      }}
                      style={{ color: "#fff", cursor: "pointer" }}
                    />
                  </Tooltip>
                }
                style={{
                  width: "30%",
                  marginBottom: "1.5rem",
                  borderTopLeftRadius: "15px",
                  borderTopRightRadius: "15px",
                  marginRight: "1.5rem",
                }}
              >
                <div style={{ textAlign: "end" }}>
                  <div className="styleText">
                    <p style={{ fontWeight: "600" }}>CHỦNG LOẠI GIEO TRỒNG</p>
                  </div>
                  <p>{temp.leafyMax} Rau ăn lá</p>
                  <p>{temp.herbMax} Rau gia vị</p>
                  <p>{temp.rootMax} Củ, quả</p>
                  <div className="styleText">
                    <p style={{ fontWeight: "600" }}>SẢN LƯỢNG DỰ KIẾN</p>
                    <p>{temp.expectedOutput} kg/tháng</p>
                  </div>
                  <div className="styleText">
                    <p style={{ fontWeight: "600" }}>SỐ LẦN GỬI RAU TỚI NHÀ</p>
                    <p>{temp.expectDeliveryPerWeek} lần/ tuần</p>
                  </div>
                  <div className="styleText">
                    <p style={{ fontWeight: "600" }}>SỐ LUONG GIAO MOI LAN</p>
                    <p>{temp.expectDeliveryAmount} kg/ lan</p>
                  </div>
                  <div className="styleText">
                    <p style={{ fontWeight: "600" }}>GIÁ</p>
                    <p>
                      {temp.price.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default ManageTemplate;

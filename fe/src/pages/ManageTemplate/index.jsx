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
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
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
          name="area"
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
          name="rau_dinh_duong"
          label="Rau dinh dưỡng"
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
          name="rau_an_la"
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
          name="rau_gia_vi"
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
          name="cu_qua"
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
      </Form>
    </Modal>
  );
};
const ManageTemplate = () => {
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
  const onCreate = (values) => {
    console.log("Received values of form: ", values);
    setOpen(false);
    openNotificationWithIcon("success", "Thông báo", "Cập nhật thành công");
  };

  useEffect(() => {
    setTemplates([
      {
        area: 4,
        rau_dinh_duong: 3,
        rau_an_la: 4,
        cu_qua: 5,
        rau_gia_vi: 4,
        san_luong_du_kien: 4,
        price: 3000,
      },
      {
        area: 4,
        rau_dinh_duong: 3,
        rau_an_la: 4,
        cu_qua: 5,
        rau_gia_vi: 4,
        san_luong_du_kien: 4,
        price: 3000,
      },
      {
        area: 4,
        rau_dinh_duong: 3,
        rau_an_la: 4,
        cu_qua: 5,
        rau_gia_vi: 4,
        san_luong_du_kien: 4,
        price: 3000,
      },
      {
        area: 4,
        rau_dinh_duong: 3,
        rau_an_la: 4,
        cu_qua: 5,
        rau_gia_vi: 4,
        san_luong_du_kien: 4,
        price: 3000,
      },
    ]);
  }, []);

  return (
    <div>
      {contextHolder}
      {templates ? (
        <div>
          <h2 style={{ textAlign: "left" }}>Template List</h2>
          <Row>
            <Col span={6}>
              <div style={{ marginBottom: "1rem" }}>
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
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            {templates.map((temp) => (
              <Card
                title={`Diện tích ${temp.area} M2`}
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
                  marginBottom: "1rem",
                  borderTopLeftRadius: "15px",
                  borderTopRightRadius: "15px",
                }}
              >
                <div>
                  <div className="styleText">
                    <p style={{ fontWeight: "600" }}>CHỦNG LOẠI GIEO TRỒNG</p>
                    <p>{temp.rau_dinh_duong} Rau dinh dưỡng</p>
                  </div>
                  <p>{temp.rau_an_la} Rau ăn lá</p>
                  <p>{temp.rau_gia_vi} Rau gia vị</p>
                  <p>{temp.cu_qua} Củ, quả</p>
                  <div className="styleText">
                    <p style={{ fontWeight: "600" }}>SẢN LƯỢNG DỰ KIẾN</p>
                    <p>{temp.san_luong_du_kien} kg/tháng</p>
                  </div>
                  <div className="styleText">
                    <p style={{ fontWeight: "600" }}>SỐ LẦN GỬI RAU TỚI NHÀ</p>
                    <p>{temp.san_luong_du_kien} lần/ tuần</p>
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

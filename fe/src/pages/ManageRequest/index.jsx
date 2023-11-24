import React from "react";
import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  DatePicker,
  Flex,
  Form,
  Modal,
  Radio,
  InputNumber,
  Divider,
  Tooltip,
  notification,
  Collapse,
  theme,
} from "antd";
import { EyeOutlined, CaretRightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Loading from "../Loading";
import { Card, Space } from "antd";
import FARM from "../../services/farmService";
import { useParams } from "react-router";
import "./style.css";

const { Meta } = Card;
const ManageRequest = () => {
  const { token } = theme.useToken();
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5,
    });
  };
  const panelStyle = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reqDetail, setReqDetail] = useState({
    id: "",
    date: "",
    name: "",
    address: "",
    phone: "",
    area: 0,
    price: 0,
  });

  const showModal = (id) => {
    // Gọi api detail
    setReqDetail({
      id: id,
      date: "23/11/2023",
      name: "Le Ha",
      address: "32 P. Đại Từ",
      phone: "0188666123",
      area: 4,
      price: 10000,
      rau_dinh_duong: 3,
      rau_an_la: 4,
      cu_qua: 5,
      rau_gia_vi: 4,
      san_luong_du_kien: 4,
    });
    console.log(reqDetail);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    openNotificationWithIcon(
      "success",
      "Thông báo",
      "Chấp nhận đơn hàng thành công"
    );
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleReject = () => {
    setIsModalOpen(false);
    openNotificationWithIcon(
      "success",
      "Thông báo",
      "Từ chối đơn hàng thành công"
    );
  };

  const getItems = (panelStyle) => [
    {
      key: "1",
      label: "Xem thêm",
      children: (
        <div style={{ textAlign: "right" }}>
          <div className="styleText">
            <p style={{ fontWeight: "600" }}>CHỦNG LOẠI GIEO TRỒNG</p>
            <p>{reqDetail.rau_dinh_duong} Rau dinh dưỡng</p>
          </div>
          <p>{reqDetail.rau_an_la} Rau ăn lá</p>
          <p>{reqDetail.rau_gia_vi} Rau gia vị</p>
          <p>{reqDetail.cu_qua} Củ, quả</p>
          <div className="styleText">
            <p style={{ fontWeight: "600" }}>SẢN LƯỢNG DỰ KIẾN</p>
            <p>{reqDetail.san_luong_du_kien} kg/tháng</p>
          </div>
          <div className="styleText">
            <p style={{ fontWeight: "600" }}>SỐ LẦN GỬI RAU TỚI NHÀ</p>
            <p>{reqDetail.san_luong_du_kien} lần/ tuần</p>
          </div>
        </div>
      ),
    },
  ];

  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };

  useEffect(() => {
    // Gọi api list
    setRequests([
      {
        id: "1",
        date: "23/11/2023",
        name: "Le Ha",
        address: "32 P. Đại Từ",
        phone: "0188666123",
        area: 4,
        price: 10000,
      },
      {
        id: "2",
        date: "23/11/2023",
        name: "Le Ha",
        address: "32 P. Đại Từ",
        phone: "0188666123",
        area: 4,
        price: 10000,
      },
      {
        id: "3",
        date: "23/11/2023",
        name: "Le Ha",
        address: "32 P. Đại Từ",
        phone: "0188666123",
        area: 4,
        price: 10000,
      },
      {
        id: "4",
        date: "23/11/2023",
        name: "Le Ha",
        address: "32 P. Đại Từ",
        phone: "0188666123",
        area: 4,
        price: 10000,
      },
    ]);
  }, []);

  return (
    <div>
      {contextHolder}
      {requests ? (
        <div>
          <h2 style={{ textAlign: "left" }}>Quản lý cầu của khách hàng</h2>
          {/* Sreach request */}
          <div>
            <p>
              <strong>Tìm kiếm thông tin</strong>
            </p>
            <Flex style={{ marginBottom: "2rem" }} align="flex-end">
              <Flex vertical style={{ marginRight: "1rem" }}>
                <label style={{ marginBottom: "0.5rem" }}>
                  Nội dung/Tên người đặt/Template đơn hàng:{" "}
                </label>
                <Input style={{ width: "100%" }} placeholder="Search" />
              </Flex>
              <Flex vertical style={{ marginRight: "1rem" }}>
                <label style={{ marginBottom: "0.5rem" }}>
                  Ngày đặt hàng:{" "}
                </label>
                <DatePicker onChange={onChange} />
              </Flex>
              <Flex gap="small" wrap="wrap">
                <Button type="primary">Tìm kiếm</Button>
                <Button>Đặt lại</Button>
              </Flex>
            </Flex>
          </div>
          <h2 style={{ textAlign: "left", fontSize: "18px" }}>
            Danh sách yêu cầu của khách hàng
          </h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {requests.map((req) => (
              <Card
                title={`Ngày đặt hàng: ${req.date}`}
                hoverable
                style={{ width: "30%", marginBottom: "1.5rem", marginRight: '1.5rem' }}
                extra={
                  <Tooltip title="Chi tiết">
                    <EyeOutlined
                      style={{
                        color: "#fff",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                      onClick={() => showModal(req.id)}
                    />
                  </Tooltip>
                }
              >
                <Row>
                  <Col span={13} style={{ textAlign: "left" }}>
                    <h3>Thông tin khách hàng</h3>
                    <p>Tên: {req.name}</p>
                    <p>SĐT: {req.phone}</p>
                    <p>Địa chỉ: {req.address}</p>
                  </Col>
                  <Col
                    span={2}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Divider
                      style={{
                        color: "#8fb955",
                        height: "-webkit-fill-available",
                      }}
                      type="vertical"
                    />
                  </Col>
                  <Col span={9} style={{ textAlign: "left" }}>
                    <h3>Template</h3>
                    <p>Diện tích: {req.area} M2</p>
                    <p>
                      Giá:{" "}
                      {req.price.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                  </Col>
                </Row>
              </Card>
            ))}
          </div>

          {/* Modal detail info */}
          <Modal
            title="Chi tiết đơn hàng"
            open={isModalOpen}
            okText="Chấp nhận"
            cancelText="Từ chối"
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Hủy
              </Button>,
              <Button key="submit" danger onClick={handleReject}>
                Từ chối
              </Button>,
              <Button type="primary" onClick={handleOk}>
                Chấp nhận
              </Button>,
            ]}
          >
            <Divider orientation="left" style={{ fontSize: "14px" }}>
              Thông tin khách hàng
            </Divider>
            <div style={{ marginLeft: "5%" }}>
              <p>Tên: {reqDetail.name}</p>
              <p>SĐT: {reqDetail.phone}</p>
              <p>Địa chỉ: {reqDetail.address}</p>
            </div>

            <Divider orientation="left" style={{ fontSize: "14px" }}>
              Nội dung đặt hàng
            </Divider>
            <div style={{ marginLeft: "5%" }}>
              <p>Ngày đặt hàng: {reqDetail.date}</p>
              <p>
                <i>
                  <strong>Template</strong>:{" "}
                  <span>Diện tích: {reqDetail.area} M2</span>
                </i>
              </p>
              <Collapse
                // defaultActiveKey={["1"]}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                // ghost
                items={getItems(panelStyle)}
              />
              <p>
                Giá:{" "}
                {reqDetail.price.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
            </div>
          </Modal>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default ManageRequest;

import React from "react";
import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Flex,
  DatePicker,
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
// import "./style.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import SERVICE from "../../services/serviceService";
import GARDEN from "../../services/gardenService";

const { Meta } = Card;
const ManageGarden = () => {
  const farmId = localStorage.getItem('id')
  const [projects, setProjects] = useState([]);

  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };

  const handleStart = (project) => {
    console.log("Herre: ", project)
    const dataStatus = {
      status: 'started'
    }
    async function fetchData() {
      const data = await GARDEN.updateStatusGarden(dataStatus, project._id)
      if (data.data.garden) {
        setProjects(projects.map(project => {
          if(project._id === data.data.garden._id) {
            project.status = data.data.garden.status
            project.startDate = data.data.garden.startDate
          }
          return project
        }))
      }
    }
    fetchData();
  }

  useEffect(() => {
    // Gọi api list
    async function fetchData() {
      const data = await GARDEN.getGardens(farmId)
      if (data.data.gardens) {
        setProjects(data.data.gardens)
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      {projects ? (
        <div>
          <h2 style={{ textAlign: "left" }}>Quản lý mảnh vườn TRỒNG RAU HỘ</h2>
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
            Danh sách dự án TRH
          </h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {projects?.map((project) => (
              <Card
                hoverable
                cover={
                  <img
                    alt="example"
                    src="https://media.istockphoto.com/id/1323663582/vi/anh/tr%E1%BA%BB-em-v%C3%A0-m%E1%BA%B9-l%C3%A0m-v%C6%B0%E1%BB%9Dn-trong-v%C6%B0%E1%BB%9Dn-rau-%E1%BB%9F-s%C3%A2n-sau.jpg?s=612x612&w=0&k=20&c=wU9d5Vwf0Rmb6B7jZOU0T6KgcceeTrGU99lCT2XfH-Q="
                  />
                }
                style={{ width: "23%", marginBottom: "1.5rem", marginRight: '1.5rem'}}
              >
                <Link
                to={`/manage-planting-garden/${project._id}`}
                >
                  <Meta
                    align={"center"}
                    style={{ fontStyle: "italic" }}
                    title={project.startDate ? `Ngày bắt đầu ${project.startDate}` : 'not started'}
                  />
                  <div style={{ textAlign: "left" }}>
                    <p>Template: {project.template.square} M2</p>
                    <p>Khách hàng: {project.client.email}</p>
                    <p>Thông tin liên lạc: {project.client.phone ? project.client.phone : 'not have'}</p>
                  </div>
                </Link>
                <div>
                  {
                    project.status === 'waiting' ? <Button onClick={() => handleStart(project)}> Start </Button> : 'Started'
                  }
                </div >
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

export default ManageGarden;

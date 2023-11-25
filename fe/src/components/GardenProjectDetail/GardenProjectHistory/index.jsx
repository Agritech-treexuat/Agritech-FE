import React, { useState } from "react";
import FARM from "../../../services/farmService";
import { useParams } from "react-router";
import { useEffect } from "react";
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
  Flex,Select
} from "antd";
import { HistoryOutlined, EditFilled } from "@ant-design/icons";

import Loading from "../../../pages/Loading";

const { Meta } = Card;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const CollectionCreateForm = ({ open, onCreate, onCancel, listPlant}) => {
  const [form] = Form.useForm();

  const handlePlantChange = (value) => {
    console.log(value);
  };

  return (
    <Modal
      open={open}
      title="Thêm hoạt động"
      okText="Thêm mới"
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
            options={listPlant.map((plant) => {
              plant.label = plant.name;
              plant.value = plant.id;
              return plant;
            })}
            onChange={handlePlantChange}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const GardenProjectHistory = () => {
  const [initData, setInitData] = useState(null);
  const [open, setOpen] = useState(false);
  const projectID = useParams();
  console.log("params: ", projectID);

  const onCreate = (values) => {
    console.log("Received values of form: ", values);
    setOpen(false);
  };

  useEffect(() => {
    setInitData({
      id: "1",
      startDate: "23/11/2023",
      plants: [
        {
          id: '1',
          name: "Cây 1",
          plan: [
            {
              tx: "skdjksjdskjdskjdkjsdksd",
              time: "19/11/2023",
              loai_canh_tac: "phân bón",
              detail: [
                { name: "NHK", amount_per_ha: 100 },
                { name: "Kali", amount_per_ha: 130 },
              ],
              note: "Bon thuc lan 1 sau 20 ngay-abc",
            },
            {
              tx: "skdjksjdskjdskjdkjsdksd",
              time: "19/11/2023",
              loai_canh_tac: "phân bón",
              detail: [
                { name: "NHK", amount_per_ha: 100 },
                { name: "Kali", amount_per_ha: 130 },
              ],
              note: "Bon thuc lan 2 sau 20 ngay-abc",
            },
          ],
          status: "status",
        },
        {
          id: '2',
          name: "Cây 2",
          plan: [
            {
              tx: "skdjksjdskjdskjdkjsdksd",
              time: "19/11/2023",
              loai_canh_tac: "phân bón",
              detail: [
                { name: "NHK", amount_per_ha: 100 },
                { name: "Kali", amount_per_ha: 130 },
              ],
              note: "Bon thuc lan 1 sau 20 ngay-abc",
            },
          ],
          status: "status",
        },
        {
          id: '3',
          name: "Cây 3",
          plan: [],
        },
        {
          id: '4',
          name: "Cây 4",
          plan: [],
        },
        {
          id: '5',
          name: "Cây 5",
          plan: [],
        },
        {
          id: '6',
          name: "Cây 6",
          plan: [],
        },
      ],
    });
  }, []);

  const columns = [
    {
      title: "Cây",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div style={{ textAlign: "center" }}>{record.name}</div>
      ),
    },
    {
      title: "Hoạt động canh tác",
      key: "plan",
      dataIndex: "plant",
      render: (_, record) =>
        record.plan.length > 0 ? (
          <div>
            {record.plan.map((rec) => (
              <div>
                <Flex justify="space-between">
                  <div
                    style={{
                      color: "#476930",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    <span>
                      <EditFilled /> Chỉnh sửa
                    </span>
                  </div>
                  <a style={{ cursor: "pointer" }}>
                    <HistoryOutlined /> Lịch sử chỉnh sửa
                  </a>
                </Flex>
                <p>Transaction hash: {rec.tx}</p>
                <p>Thời gian: {rec.time}</p>
                <p>Loại canh tác: {rec.loai_canh_tac}</p>
                <p>
                  Chi tiết:{" "}
                  <ul>
                    {rec.detail.map((item, index) => (
                      <li key={index}>
                        <strong>{item.name}:</strong> {item.amount_per_ha}
                      </li>
                    ))}
                  </ul>
                </p>
                <Divider></Divider>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>Không có thông tin</div>
        ),
    },
    {
      title: "Chỉnh sửa trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, record) =>
        record.status ? (
          <div style={{ textAlign: "center" }}>
            <div
              style={{ color: "#476930", fontWeight: "500", cursor: "pointer" }}
            >
              <span>
                {record.status} <EditFilled />
              </span>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>Không có thông tin</div>
        ),
    },
  ];

  return (
    <div>
      {initData ? (
        <div>
          <h2 style={{ margin: "0px" }}>Các hoạt động canh tác</h2>
          <Button
            type="primary"
            onClick={() => {
              setOpen(true);
            }}
            style={{ marginTop: "1rem", marginBottom: "1rem" }}
          >
            Thêm hoạt động
          </Button>
          <CollectionCreateForm
            open={open}
            onCreate={onCreate}
            onCancel={() => {
              setOpen(false);
            }}
            listPlant={initData.plants}
          />
          <Table
            bordered={true}
            columns={columns}
            dataSource={initData.plants.map((data, index) => {
              data.key = index;
              return data;
            })}
          />{" "}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default GardenProjectHistory;

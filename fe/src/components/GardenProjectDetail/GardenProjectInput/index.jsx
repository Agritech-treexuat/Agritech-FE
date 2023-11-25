import React, { useState } from "react";
import FARM from "../../../services/farmService";
import { useParams } from "react-router";
import { useEffect } from "react";
import {
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
} from "antd";
import { EditFilled, UploadOutlined } from "@ant-design/icons";
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

const CollectionCreateForm = ({ open, onCreate, onCancel, listPlant }) => {
  const [form] = Form.useForm();
  const [listSeed, setlistSeed] = useState([]);

  const handlePlantChange = (value) => {
    setlistSeed(listPlant.find((plant) => plant.value === value).seeds);
    console.log(value);
    console.log(listSeed);
  };

  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Modal
      open={open}
      title="Thêm cây mới"
      cancelText="Hủy"
      okText="Thêm"
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
      <Form form={form} {...layout} name="form_in_modal">
        <Form.Item
          name="startDate"
          label="Ngày bắt đầu"
          rules={[
            {
              required: true,
              message: "Trường thông tin không được để trống!",
            },
          ]}
        >
          <DatePicker
            placeholder="Chọn ngày bắt đầu"
            style={{ width: "100%" }}
          />
        </Form.Item>
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
        <Form.Item
          name="seed"
          label="Chọn hạt giống"
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
            placeholder="Chọn hạt giống"
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
            options={listSeed.map((seed) => {
              seed.label = seed.name;
              seed.value = seed.id;
              return seed;
            })}
          />
        </Form.Item>
        <Form.Item
          name="amount"
          label="Lượng"
          rules={[
            {
              required: true,
              message: "Trường thông tin không được để trống!",
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="upload"
          label="Ảnh"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload name="logo" action="/upload.do" listType="picture">
            <Button icon={<UploadOutlined />}>Đăng ảnh</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const CollectionEditForm = ({ open, onCreate, onCancel, seedDetail, seed }) => {
  const [formEdit] = Form.useForm();
  const [listSeed, setListSeed] = useState([]);
  // seed.upload = [seed.img]
  console.log("Seed: ", seed);

  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  useEffect(() => {
    setListSeed([
      {
        id: "a11",
        name: "seed 1",
      },
      {
        id: "a21",
        name: "seed 2",
      },
      {
        id: "a13",
        name: "seed 3",
      },
    ]);
    console.log("Seed: ", seed);
  }, []);

  return (
    <Modal
      open={open}
      title="Cập nhật/Chỉnh sửa thông tin"
      cancelText="Hủy"
      okText="Cập nhật"
      onCancel={onCancel}
      onOk={() => {
        formEdit
          .validateFields()
          .then((values) => {
            formEdit.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        form={formEdit}
        {...layout}
        name="form_in_modal"
        initialValues={seed}
      >
        {/* <Form.Item
          name="startDate"
          label="Ngày bắt đầu"
          rules={[
            {
              required: true,
              message: "Trường thông tin không được để trống!",
            },
          ]}
        >
          <DatePicker
            placeholder="Chọn ngày bắt đầu"
            style={{ width: "100%" }}
          />
        </Form.Item> */}
        <Form.Item
          name="seed"
          label="Chọn hạt giống"
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
            placeholder="Chọn hạt giống"
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
            options={listSeed?.map((seed) => {
              seed.label = seed.name;
              seed.value = seed.id;
              return seed;
            })}
          />
        </Form.Item>
        <Form.Item
          name="amount"
          label="Lượng"
          rules={[
            {
              required: true,
              message: "Trường thông tin không được để trống!",
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="img"
          label="Ảnh"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload name="logo" action="/upload.do" listType="picture">
            <Button icon={<UploadOutlined />}>Đăng ảnh</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const GardenProjectInput = () => {
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5,
    });
  };
  const [initData, setInitData] = useState(null);
  const [seedDetail, setSeedDetail] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [listPlant, setListPlant] = useState([]);
  const projectID = useParams();
  const [selectedSeed, setSelectedSeed] = useState([]);
  console.log("params: ", projectID);

  const onCreateEdit = (values) => {
    console.log("Received values of form: ", values);
    openNotificationWithIcon(
      "success",
      "Thông báo",
      "Chỉnh sửa/Cập nhật thành công"
    );
    setOpenEdit(false);
  };

  const onCreate = (values) => {
    console.log("Received values of form: ", values);
    setOpen(false);
    openNotificationWithIcon("success", "Thông báo", "Tạo mới thành công");
  };

  useEffect(() => {
    setInitData({
      id: "1",
      transaction_hash: "adakdhakjdsas",
      // Danh sách các cây: plants
      seeds: [
        {
          id: "1",
          name: "cây 1",
          seed: "abc",
          startDate: "23/11/2023",
          amount: null,
          img: [
            "https://st.depositphotos.com/2632165/4026/i/450/depositphotos_40264933-stock-photo-young-plant.jpg",
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
        },
        {
          id: "1",
          name: "cây 4",
          seed: "",
          startDate: "23/11/2023",
          amount: null,
          img: [
            "https://st.depositphotos.com/2632165/4026/i/450/depositphotos_40264933-stock-photo-young-plant.jpg",
          ],
        },
        {
          id: "1",
          name: "cây 5",
          seed: "Hạt giống",
          startDate: "23/11/2023",
          amount: 1000,
          img: [
            "https://st.depositphotos.com/2632165/4026/i/450/depositphotos_40264933-stock-photo-young-plant.jpg",
          ],
        },
        {
          id: "1",
          name: "cây 6",
          seed: "Hạt giống",
          startDate: "23/11/2023",
          amount: 1000,
          img: [
            "https://st.depositphotos.com/2632165/4026/i/450/depositphotos_40264933-stock-photo-young-plant.jpg",
          ],
        },
      ],
    });
  }, []);

  useEffect(() => {
    setListPlant([
      {
        id: "1",
        name: "Cay 1",
        seeds: [
          {
            id: "1",
            name: "Hạt giống 11",
          },
          {
            id: "2",
            name: "Hạt giống 12",
          },
        ],
      },
      {
        id: "2",
        name: "Cay 2",
        seeds: [
          {
            id: "3",
            name: "Hạt giống 21",
          },
          {
            id: "2",
            name: "Hạt giống 22",
          },
        ],
      },
      {
        id: "3",
        name: "Cay 3",
        seeds: [
          {
            id: "4",
            name: "Hạt giống 31",
          },
          {
            id: "5",
            name: "Hạt giống 32",
          },
        ],
      },
      {
        id: "4",
        name: "Cay 4",
        seeds: [
          {
            id: "6",
            name: "Hạt giống 41",
          },
          {
            id: "7",
            name: "Hạt giống 42",
          },
        ],
      },
    ]);
  }, []);

  return (
    <div>
      {contextHolder}
      {initData ? (
        <div>
          <Flex justify="space-between" align="center">
            <h2 style={{ margin: "0px" }}>Thông tin khởi tạo</h2>
            <Button
              type="primary"
              onClick={() => {
                setOpen(true);
              }}
            >
              Thêm cây mới
            </Button>
          </Flex>
          <div>
            {/* <p>Ngày bắt đầu: {initData.startDate}</p> */}
            <p>Transaction hash: {initData.transaction_hash}</p>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {initData.seeds.map((seed) => (
              <Card
                style={{
                  width: "23%",
                  marginBottom: "1.5rem",
                  marginRight: "1.5rem",
                }}
                hoverable
                cover={<img alt="example" src={seed.img[0]} />}
              >
                <Meta
                  align={"center"}
                  style={{ fontStyle: "italic" }}
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Cây: {seed.name}</span>{" "}
                      <Tooltip title="Sửa/Cập nhật thông tin">
                        <EditFilled
                          style={{ color: "#476930" }}
                          onClick={() => {
                            setSeedDetail(seed);
                            setSelectedSeed({
                              ...seed,
                              startDate: new Date(seed.startDate),
                            });
                            setOpenEdit(true);
                          }}
                        />
                      </Tooltip>{" "}
                    </div>
                  }
                />
                <div style={{ textAlign: "left" }}>
                  <p>Hạt giống: {seed.seed || "Chưa có thông tin"}</p>
                  <p>Ngày bắt đầu: {seed.startDate || "Chưa có thông tin"}</p>
                  <p>Số lượng: {seed.amount || "Chưa có thông tin"}</p>
                </div>
              </Card>
            ))}
          </div>

          <CollectionEditForm
            open={openEdit}
            onCreate={onCreateEdit}
            onCancel={() => {
              setOpenEdit(false);
            }}
            seedDetail={seedDetail}
            seed={selectedSeed}
          />
          <CollectionCreateForm
            open={open}
            listPlant={listPlant}
            onCreate={onCreate}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default GardenProjectInput;

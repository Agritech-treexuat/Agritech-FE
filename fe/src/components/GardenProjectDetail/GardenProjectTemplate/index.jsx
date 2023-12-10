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
  Space,
} from "antd";
import { EditFilled, UploadOutlined, CloseOutlined } from "@ant-design/icons";
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
          agroChemicalItems: [
            {
              name: "name",
              amountPerHa: 12,
            },
            {
              name: "name",
              amountPerHa: 12,
            },
            {
              name: "name",
              amountPerHa: 12,
            },
            {
              name: "name",
              amountPerHa: 12,
            },
            {
              name: "name",
              amountPerHa: 12,
            },
            {
              name: "name",
              amountPerHa: 12,
            },
            {
              name: "name",
              amountPerHa: 12,
            },
            {
              name: "name",
              amountPerHa: 12,
            },
          ],
        },
        {
          time: "14h",
          note: "note",
          type: "type select",
          agroChemicalItems: [
            {
              name: "name",
              amountPerHa: 12,
            },
            {
              name: "name",
              amountPerHa: 12,
            },
          ],
        },
      ],
    },
    {
      id: "2",
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
          agroChemicalItems: [
            {
              name: "name",
              amountPerHa: 12,
            },
            {
              name: "name",
              amountPerHa: 12,
            },
          ],
        },
      ],
    },
    {
      id: "3",
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
          agroChemicalItems: [
            {
              name: "name",
              amountPerHa: 12,
            },
            {
              name: "name",
              amountPerHa: 12,
            },
          ],
        },
      ],
    },
    {
      id: "4",
      name: "cây 4",
      seed: "Hạt giống",
      startDate: "23/11/2023",
      amount: 1000,
      img: [
        "https://st.depositphotos.com/2632165/4026/i/450/depositphotos_40264933-stock-photo-young-plant.jpg",
      ],
      plan: [],
    },
    {
      id: "5",
      name: "cây 5",
      seed: "Hạt giống",
      startDate: "23/11/2023",
      amount: 1000,
      img: [
        "https://st.depositphotos.com/2632165/4026/i/450/depositphotos_40264933-stock-photo-young-plant.jpg",
      ],
      plan: [],
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
          <Select
            placeholder="Chọn template"
            options={[
              {
                value: "default",
                label: "Default",
              },
              {
                value: "none",
                label: "None",
              },
            ]}
          ></Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const CollectionTemplateForm = ({
  open,
  onCreate,
  onCancel,
  defaultTemplate,
  fetilizer,
  BVTV,
}) => {
  const [formTemplate] = Form.useForm();
  console.log(defaultTemplate);

  const BVTV_name = BVTV?.map((BVTV_item) => {
    return {
      value: BVTV_item.name,
      label: BVTV_item.name,
    };
  });

  const fetilizer_name = fetilizer?.map((fetilizer_item) => {
    return {
      value: fetilizer_item.name,
      label: fetilizer_item.name,
    };
  });

  useEffect(() => {
    formTemplate.setFieldsValue({
      items: defaultTemplate,
    });
  }, [formTemplate, defaultTemplate]);

  const handlePlantChange = (value) => {
    console.log(value);
  };
  return (
    <Modal
      open={open}
      title="Thêm cây mới"
      okText="Tạo mới"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => {
        formTemplate
          .validateFields()
          .then((values) => {
            formTemplate.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
      getContainer={false}
    >
      <Form
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 18,
        }}
        form={formTemplate}
        name="dynamic_form_complex"
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          items: defaultTemplate,
        }}
      >
        <Form.List name="items">
          {(fields, { add, remove }) => (
            <div
              style={{
                display: "flex",
                rowGap: 16,
                flexDirection: "column",
              }}
            >
              {fields?.map((field) => (
                <Card
                  size="small"
                  title={`Kế hoạch ${field.name + 1}`}
                  key={field.key}
                  extra={
                    <CloseOutlined
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  }
                >
                  <Form.Item label="Time" name={[field.name, "time"]}>
                    <Input />
                  </Form.Item>

                  <Form.Item label="Note" name={[field.name, "note"]}>
                    <Input />
                  </Form.Item>

                  <Form.Item label="Type" name={[field.name, "type"]}>
                    <Select
                      placeholder="Chọn loại"
                      options={[
                        {
                          label: "Phân bón",
                          value: "phân bón",
                        },
                        {
                          label: "BVTV",
                          value: "BVTV",
                        },
                      ]}
                    ></Select>
                  </Form.Item>

                  <Form.Item label="List">
                    <Form.List name={[field.name, "agroChemicalItems"]}>
                      {(subFields, subOpt) => (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            rowGap: 16,
                          }}
                        >
                          {subFields.map((subField) => (
                            <Space key={subField.key}>
                              <Form.Item noStyle name={[subField.name, "name"]}>
                                <Select
                                  placeholder="Chọn tên"
                                  options={
                                    formTemplate.getFieldValue([
                                      "items",
                                      field.name,
                                      "type",
                                    ]) == "phân bón"
                                      ? fetilizer_name
                                      : BVTV_name
                                  }
                                />
                              </Form.Item>
                              <Form.Item
                                noStyle
                                name={[subField.name, "amountPerHa"]}
                              >
                                <Input placeholder="Số lượng" type="number" />
                              </Form.Item>
                              <CloseOutlined
                                onClick={() => {
                                  subOpt.remove(subField.name);
                                }}
                              />
                            </Space>
                          ))}
                          <Button
                            type="dashed"
                            onClick={() => subOpt.add()}
                            block
                          >
                            + Thêm Sub Item
                          </Button>
                        </div>
                      )}
                    </Form.List>
                  </Form.Item>
                </Card>
              ))}

              <Button type="dashed" onClick={() => add()} block>
                + Add Item
              </Button>
            </div>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

const items = mainContent.seeds
  ?.filter((seed) => seed.plan.length > 0)
  .map((plant, index) => {
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
              <p style={{ fontSize: "16px", margin: "0 1rem" }}>
                <strong>
                  <Divider
                    orientation="left"
                    style={{ marginRight: "1rem", width: "80%" }}
                  >
                    <i>Chi tiết hoạt động </i>
                  </Divider>
                </strong>
              </p>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {p.agroChemicalItems.map((i) => (
                  <div
                    style={{
                      width: "25%",
                      backgroundColor: "#fff",
                      marginBottom: "1rem",
                    }}
                  >
                    <p>Tên: {i.name}</p>
                    <p>Số lượng trên ha: {i.amountPerHa}</p>
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
  const [defaultTemplate, setDefaultTemplate] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState("");
  const [fetilizer, setFetilizer] = useState([]);
  const [BVTV, setBVTV] = useState([]);
  const projectID = useParams();
  console.log("params: ", projectID);

  const [open, setOpen] = useState(false);
  const onCreate = (values) => {
    console.log("Received values of form: ", values);
    setSelectedPlant(values.plant);
    if (values.template === "default") {
      setDefaultTemplate(
        mainContent.seeds.find((s) => s.id === values.plant)?.plan
      );
      setBVTV([
        {
          name: "type 1",
        },
        {
          name: "type 2",
        },
      ]);

      setFetilizer([
        {
          name: "Fetilizer 1",
        },
        {
          name: "Fetilizer 2",
        },
      ]);
    } else setDefaultTemplate([]);
    console.log(defaultTemplate);
    setOpen(false);
    setOpenTemplate(true);
  };

  const [openTemplate, setOpenTemplate] = useState(false);
  const onCreateTemplate = (values) => {
    console.log("Received values of form: ", values);
    setOpenTemplate(false);
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
          <CollectionTemplateForm
            open={openTemplate}
            onCreate={onCreateTemplate}
            onCancel={() => {
              setOpenTemplate(false);
            }}
            defaultTemplate={defaultTemplate}
            fetilizer={fetilizer}
            BVTV={BVTV}
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

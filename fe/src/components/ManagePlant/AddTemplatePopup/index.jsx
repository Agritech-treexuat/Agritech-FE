import React from "react";
import { Modal, Select } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  Space,
  Typography,
  InputNumber,
  Col,
  Row,
} from "antd";
import "./style.css";
const AddTemplatePopup = ({ open, onCreate, onCancel, defaultTemplate }) => {
  const [form] = Form.useForm();
  console.log("defaultTemplate", defaultTemplate);
  const sampleData = {
    timeCultivates: [
      {
        start: 5,
        end: 5,
        _id: "659a69ca3fab5ca0a1002065",
      },
    ],
    cultivationActivities: [
      {
        name: "Alter patruus amissio attonbitus fugiat curiositas capillus caritas.",
        description: "Totam comptus cena cras id certus tam.",
        _id: "659a69ca3fab5ca0a1002066",
      },
    ],
    plantingActivity: {
      density: "Maxime unus audio cuppedia voluptates voco omnis.",
      description: "Vulgus caste velum.",
    },
    fertilizationActivities: [
      {
        fertilizationTime: "Voveo venio defaeco quos sordeo paulatim.",
        type: "baseFertilizer",
        description:
          "Acsi cinis corrumpo alo viriliter aspernatur concedo vester crudelis advenio.",
        _id: "659a69ca3fab5ca0a1002067",
      },
    ],
    pestAndDiseaseControlActivities: [
      {
        name: "Cornu capto varius colo in volo ascit.",
        type: "pest",
        symptoms: "Desipio vacuus patruus ara curo bonus.",
        description:
          "Campana vomito uxor aestus studio neque suspendo certus subito.",
        solution: [
          "Cavus thalassinus pecus adficio coniuratio barba cuius antiquus.",
        ],
        note: "Conatus utroque delibero.",
        _id: "659a69ca3fab5ca0a1002068",
      },
    ],
    bestTimeCultivate: {
      start: 9,
      end: 9,
    },
    farmingTime: 185,
    harvestTime: 21,
  };

  return (
    <Modal
      open={open}
      title="Thêm quy trình mới"
      okText="Thêm"
      cancelText="Hủy"
      style={{
        minWidth: 800,
      }}
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
      getContainer={false}
    >
      <Form
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        form={form}
        name="dynamic_form_complex"
        style={{
          minWidth: 700,
        }}
        initialValues={{
          items: defaultTemplate,
        }}
      >
        <Form.Item label="timeCultivates">
          <Form.List name="timeCultivates">
            {(fields, { add, remove }) => (
              <div
                style={{
                  display: "flex",
                  rowGap: 16,
                  flexDirection: "column",
                }}
              >
                {fields.map((field) => (
                  <Space>
                    <Row>
                    <Form.Item
                      noStyle
                      label="start"
                      name={[field.name, "start"]}
                    >
                      <InputNumber
                        min={0}
                        type="number"
                        placeholder="start"
                        style={{ width: "100%", marginBottom: '0.5rem' }}
                      />
                    </Form.Item>
                    <Form.Item noStyle label="end" name={[field.name, "end"]}>
                      <InputNumber
                        min={0}
                        type="number"
                        placeholder="end"
                        style={{ width: "100%", marginBottom: '0.5rem' }}
                      />
                    </Form.Item>
                    </Row>
                    <CloseOutlined
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  </Space>
                ))}

                <Button
                  type="dashed"
                  style={{ width: "80%" }}
                  onClick={() => add()}
                  block
                >
                  + Thêm thông tin
                </Button>
              </div>
            )}
          </Form.List>
        </Form.Item>

        <Form.Item label="cultivationActivities">
          <Form.List name="cultivationActivities">
            {(fields, { add, remove }) => (
              <div
                style={{
                  display: "flex",
                  rowGap: 16,
                  flexDirection: "column",
                }}
              >
                {fields.map((field) => (
                  <Space>
                    <Row>
                    <Form.Item noStyle label="name" name={[field.name, "name"]}>
                      <Input placeholder="name" style={{ width: "100%", marginBottom: '0.5rem' }} />
                    </Form.Item>
                    <Form.Item
                      noStyle
                      label="description"
                      name={[field.name, "description"]}
                    >
                      <Input
                        placeholder="description"
                        style={{ width: "100%", marginBottom: '0.5rem' }}
                      />
                    </Form.Item>
                    </Row>
                    <CloseOutlined
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  </Space>
                ))}

                <Button
                  type="dashed"
                  style={{ width: "80%" }}
                  onClick={() => add()}
                  block
                >
                  + Thêm thông tin
                </Button>
              </div>
            )}
          </Form.List>
        </Form.Item>
        <Row>
          <Col span={6}>
            <p style={{ float: "right" }}>plantingActivity</p>
          </Col>
        </Row>
        <Form.Item name={["plantingActivity", "density"]} label="Density">
          <Input placeholder="Density" style={{ width: "80%" }} />
        </Form.Item>
        <Form.Item
          name={["plantingActivity", "description"]}
          label="Description"
        >
          <Input placeholder="Description" style={{ width: "80%" }} />
        </Form.Item>

        <Form.Item label="fertilizationActivities">
          <Form.List name="fertilizationActivities">
            {(fields, { add, remove }) => (
              <div
                style={{
                  display: "flex",
                  rowGap: 16,
                  flexDirection: "column",
                }}
              >
                {fields.map((field) => (
                  <Space>
                    <Row>
                    <Form.Item
                      noStyle
                      label="fertilizationTime"
                      name={[field.name, "fertilizationTime  "]}
                    >
                      <Input
                        placeholder="fertilizationTime"
                        style={{ width: "100%", marginBottom: '0.5rem' }}
                      />
                    </Form.Item>
                    <Form.Item noStyle label="type" name={[field.name, "type"]}>
                      <Input placeholder="type" style={{ width: "100%", marginBottom: '0.5rem' }} />
                    </Form.Item>
                    <Form.Item
                      noStyle
                      label="description"
                      name={[field.name, "description"]}
                    >
                      <Input
                        placeholder="description"
                        style={{ width: "100%", marginBottom: '0.5rem' }}
                      />
                    </Form.Item>
                    </Row>
                  
                    <CloseOutlined
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  </Space>
                ))}

                <Button
                  type="dashed"
                  style={{ width: "80%" }}
                  onClick={() => add()}
                  block
                >
                  + Thêm thông tin
                </Button>
              </div>
            )}
          </Form.List>
        </Form.Item>

        <Form.Item label="pestAndDiseaseControlActivities">
          <Form.List name="pestAndDiseaseControlActivities">
            {(fields, { add, remove }) => (
              <div
                style={{
                  display: "flex",
                  rowGap: 16,
                  flexDirection: "column",
                }}
              >
                {fields.map((field) => (
                  <Space>
                    <Row>
                      <Form.Item
                        noStyle
                        label="name"
                        name={[field.name, "name  "]}
                      >
                        <Input
                          placeholder="name"
                          style={{ width: "100%", marginBottom: "0.5rem" }}
                        />
                      </Form.Item>
                      <Form.Item
                        noStyle
                        label="type"
                        name={[field.name, "type"]}
                      >
                        <Input
                          placeholder="type"
                          style={{ width: "100%", marginBottom: "0.5rem" }}
                        />
                      </Form.Item>
                      <Form.Item
                        noStyle
                        label="symptoms"
                        name={[field.name, "symptoms"]}
                      >
                        <Input
                          placeholder="symptoms"
                          style={{ width: "100%", marginBottom: "0.5rem" }}
                        />
                      </Form.Item>
                      <Form.Item
                        noStyle
                        label="description"
                        name={[field.name, "description"]}
                      >
                        <Input
                          placeholder="description"
                          style={{ width: "100%", marginBottom: "0.5rem" }}
                        />
                      </Form.Item>
                      <Form.Item>
                        <Form.List name={[field.name, "solution"]}>
                          {(field, { add, remove }) => (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                rowGap: 16,
                              }}
                            >
                          {field.map((item) => (
                                <Space key={item.key} style={{ width: "100%" }}>
                                  <Form.Item
                                    {...item}
                                    name={[item.name]}
                                    fieldKey={[item.fieldKey]}
                                    noStyle
                                  >
                                    <Input
                                      style={{ width: "100%" }}
                                      placeholder="solution"
                                    />
                                  </Form.Item>
                                  <CloseOutlined
                                    onClick={() => remove(item.name)}
                                  />
                                </Space>
                              ))}

                              <Button
                                type="dashed"
                                style={{ width: "100%" }}
                                onClick={() => add()}
                                block
                              >
                                + Thêm giải pháp
                              </Button>
                            </div>
                          )}
                        </Form.List>
                      </Form.Item>
                      <Form.Item
                        noStyle
                        label="note"
                        name={[field.name, "note"]}
                      >
                        <Input
                          placeholder="note"
                          style={{ width: "100%", marginBottom: "0.5rem" }}
                        />
                      </Form.Item>
                    </Row>
                    <CloseOutlined
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  </Space>
                ))}

                <Button
                  type="dashed"
                  style={{ width: "80%" }}
                  onClick={() => add()}
                  block
                >
                  + Thêm thông tin
                </Button>
              </div>
            )}
          </Form.List>
        </Form.Item>

        <Row>
          <Col span={6}>
            <p style={{ float: "right" }}>bestTimeCultivate</p>
          </Col>
        </Row>

        <Form.Item name={["bestTimeCultivate", "start"]} label="start">
          <InputNumber
                        min={0}
                        type="number"
                        placeholder="start"
                        style={{ width: "100%" }}
                      />
        </Form.Item>

        <Form.Item name={["bestTimeCultivate", "end"]} label="end">
          <InputNumber
                        min={0}
                        type="number"
                        placeholder="end"
                        style={{ width: "100%" }}
                      />
        </Form.Item>

        <Form.Item name={["farmingTime"]} label="farmingTime">
          <InputNumber
                        min={0}
                        type="number"
                        placeholder="farmingTime"
                        style={{ width: "100%" }}
                      />
        </Form.Item>

        <Form.Item name={["harvestTime"]} label="harvestTime">
          <InputNumber
                        min={0}
                        type="number"
                        placeholder="harvestTime"
                        style={{ width: "100%" }}
                      />
        </Form.Item>

        <Form.Item noStyle shouldUpdate>
          {() => (
            <Typography>
              <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
            </Typography>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTemplatePopup;

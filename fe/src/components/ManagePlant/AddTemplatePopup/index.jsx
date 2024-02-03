import React from 'react'
import { Modal, Select } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input } from 'antd'
import './style.css'
const AddTemplatePopup = ({ open, onCreate, onCancel, defaultTemplate }) => {
  const [form] = Form.useForm()
  console.log('defaultTemplate', defaultTemplate)

  return (
    <Modal
      open={open}
      title="Thêm quy trình mới"
      okText="Thêm"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields()
            onCreate(values)
          })
          .catch((info) => {
            console.log('Validate Failed:', info)
          })
      }}
      getContainer={false}
    >
      <Form
        labelCol={{
          span: 6
        }}
        wrapperCol={{
          span: 18
        }}
        form={form}
        name="dynamic_form_complex"
        style={{
          maxWidth: 600
        }}
        initialValues={{
          items: defaultTemplate
        }}
      >
        {/* with these sample data: "timeCultivates": [
                {
                    "start": 5,
                    "end": 5,
                    "_id": "659a69ca3fab5ca0a1002065"
                }
            ],
            "cultivationActivities": [
                {
                    "name": "Alter patruus amissio attonbitus fugiat curiositas capillus caritas.",
                    "description": "Totam comptus cena cras id certus tam.",
                    "_id": "659a69ca3fab5ca0a1002066"
                }
            ],
            "plantingActivity": {
                "density": "Maxime unus audio cuppedia voluptates voco omnis.",
                "description": "Vulgus caste velum."
            },
            "fertilizationActivities": [
                {
                    "fertilizationTime": "Voveo venio defaeco quos sordeo paulatim.",
                    "type": "baseFertilizer",
                    "description": "Acsi cinis corrumpo alo viriliter aspernatur concedo vester crudelis advenio.",
                    "_id": "659a69ca3fab5ca0a1002067"
                }
            ],
            "pestAndDiseaseControlActivities": [
                {
                    "name": "Cornu capto varius colo in volo ascit.",
                    "type": "pest",
                    "symptoms": "Desipio vacuus patruus ara curo bonus.",
                    "description": "Campana vomito uxor aestus studio neque suspendo certus subito.",
                    "solution": [
                        "Cavus thalassinus pecus adficio coniuratio barba cuius antiquus."
                    ],
                    "note": "Conatus utroque delibero.",
                    "_id": "659a69ca3fab5ca0a1002068"
                }
            ],
            "bestTimeCultivate": {
                "start": 9,
                "end": 9
            },
            "farmingTime": 185,
            "harvestTime": 21, 
          }
          create a form to add new template (add full data) */}
      </Form>
    </Modal>
  )
}

export default AddTemplatePopup

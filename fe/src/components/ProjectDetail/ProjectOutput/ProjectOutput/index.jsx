import React, { useState } from 'react';
import OutputItem from '../OutputItem'; // Import ProcessItem component
import AddOutputPopup from '../AddOutputPopup';
import FARM from '../../../../services/farmService';
import { useParams } from 'react-router';
import Loading from '../../../../pages/Loading';
import { useEffect } from 'react';
import { Space, Table, Tag, Button, Image, Modal } from 'antd';
import { formatDate } from '../../../../utils/helpers';
import EditOutputHistory from '../EditOutputHistory';
import UpdateOutputPopup from '../UpdateOutputPopup';

const { Column, ColumnGroup } = Table;


const ProjectOutput = () => {
  const [outputData, setOutputData] = useState([])
  const params = useParams()

  useEffect(() => {
    async function fetchData() {
      const data = await FARM.getOutput(params.id)
      console.log("Data: ", data.data)
      setOutputData(data.data.outputs)
    }
    fetchData();
    console.log("Output data: ", outputData)
  }, []);

  const handleQR = (output) => {
    // Xử lý logic xuất QR code ở đây
    handleExportQR(params.id, output._id)
  };

  const handleExportQR = async (projectId, outputId)=> {
    try {
      console.log("data to send: ", projectId, outputId)
      const res = await FARM.exportQR(projectId, outputId);
      console.log("res export qr: ", res)
      setOutputData(res.data.projectOutput)
      alert("Eport QR thanh cong")
    } catch (error) {
        console.error(error?.response?.data?.message);
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      {outputData? (
        <>
        <AddOutputPopup setOutputData={setOutputData} />
        <Table dataSource={outputData}>
          <Column title="Tx" dataIndex="tx" key="tx" />
          <Column
            title="Thời gian"
            key="time"
            render={(_, output) =>
              <p>
                {formatDate(output.time)}
              </p>
            }
          />
          <Column title="Lượng" dataIndex="amount" key="amount" />
          <Column title="Lượng trên 1 sản phẩm" dataIndex="amount_perOne" key="amount_perOne" />
          <Column
            title="Ảnh"
            key="images"
            render={(_, output) => (<>
              <Button onClick={showModal}>
                Xem Ảnh
              </Button>
              <Modal title="Ảnh" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                {output.images ? output.images.map((image) => <span>
                  <Image
                  class={'process-img'}
                  src={image}
                /></span>) : <span>Không có ảnh</span>}
              </Modal>
            </>)
            }
          />
          <Column
            title="Npp"
            key="npp"
            render={(_, output) =>(<>
              {
                output.npp ? output.npp.map((npp_item) => <div>
                  <p>{npp_item.name} cùng lượng {npp_item.amount}</p>
                  </div>) : <span>Không có npp</span>
              }
            </>)
            }
          />
          <Column
            title="Chỉnh sửa"
            key="action"
            render={(_, output) => (
              <Space size="middle">
                <UpdateOutputPopup output={output} disabled={output.exportQR} setOutputData={setOutputData}/>
                <> {output.isEdited ? <EditOutputHistory output={output}/> : <></>}</>
                <Button type="primary" onClick={() => handleQR(output)} disabled={output.exportQR}>
                Xuất QR
                </Button>
              </Space>
            )}
          />
        </Table>
        </>
        ) : <Loading />}
    </div>
  );
};

export default ProjectOutput;

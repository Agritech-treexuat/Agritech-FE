import React, { useState } from 'react';
import FARM from '../../../services/farmService';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import {Image} from 'antd';
import Loading from '../../../pages/Loading';
import UpdateInputPopup from './UpdateInputPopup';
import EditInputHistory from './EditInputHistory';
import { Col, Row } from 'antd';
import { formatDate } from '../../../utils/helpers';

const ProjectInput = () => {
  const [initData, setInitData] = useState(null)
  const projectID = useParams()
  console.log("params: ", projectID)

  useEffect(() => {
    async function fetchData() {
      const data = await FARM.getInit(projectID.id)
      console.log("Data: ", data.data)
      setInitData(data.data.input)
    }
    fetchData();
    console.log("Init data: ", initData)
  }, []);

  return (
    <div>
      {initData ?
      (<div>
        <Row >
        <Col span={4}><h2 style={{margin: "0px"}}>Thông tin khởi tạo</h2></Col>
        <Col span={2}></Col>
        <Col span={18} style={{display: "flex", justifyContent:"flex-end"}}>
          <UpdateInputPopup input={initData} setInitData={setInitData}/>
      <> {initData.isEdited ? <EditInputHistory input={initData}/> : <></>}</>
          </Col>
        </Row>
        <div>
          <label>Transaction hash: </label>
          <span>{initData.tx}</span>
        </div>
        <div>
          <label>Ngày bắt đầu: </label>
          <span>{formatDate(initData.initDate)}</span>
        </div>
        <div>
          <label>Hạt giống: </label>
          <span>{initData.seed}</span>
        </div>
        <div>
          <label>Lượng: </label>
          <span>{initData.amount}</span>
        </div>
        <div>
          <label>Ảnh: </label> <br />
          <Row>
          {initData.images.length > 0 ? initData.images.map((image) => <Col span={6}>
            <Image style={{width: "100%"}}
            src={image}
          /></Col>) : <span>Không có ảnh</span>}
          </Row>
        </div>
      </div>) : <Loading />
      }
    </div>
  );
};

export default ProjectInput;

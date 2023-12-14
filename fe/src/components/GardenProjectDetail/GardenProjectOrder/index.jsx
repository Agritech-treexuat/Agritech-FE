import React, { useState } from "react";
import FARM from "../../../services/farmService";
import { useParams } from "react-router";
import { useEffect } from "react";
import { Col, Row, Divider, Alert } from "antd";
import Loading from "../../../pages/Loading";
import { CalendarFilled } from "@ant-design/icons";
import SERVICE from "../../../services/serviceService";

const GardenProjectOrder = () => {
  const [initData, setInitData] = useState(null);
  const gardenId = useParams().id;
  const farmId = localStorage.getItem('id')
  console.log("params: ", gardenId);

  useEffect(() => {
    async function fetchData() {
      const data = await SERVICE.getGardenByGardenId(farmId, gardenId);
      console.log("data: ", data)
      if (data.data.garden) {
        setInitData(data.data.garden);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      {initData ? (
        <div>
          <div>
            <Alert
              style={{ fontWeight: "500", fontSize: "16px" }}
              message={`Ngày đặt hàng ${initData.startDate}`}
              showIcon
              icon={<CalendarFilled />}
              type="success"
            />
            <Divider orientationMargin={0} orientation="left">
              <h3>Thông tin khách hàng</h3>
            </Divider>
            <div>
              <p>
                <strong>Tên:</strong> {initData.client?.name ? initData.client.name : 'note have'}
              </p>
              <p><strong>SĐT:</strong> {initData.client?.phone ? initData.client.phone : 'note have'}</p>
              <p><strong>Địa chỉ:</strong> {initData.client?.address ? initData.client.address : 'note have'}</p>
            </div>

            <Divider orientationMargin={0} orientation="left">
              <h3>Mô hình yêu cầu</h3>
            </Divider>

            <p>
              <i>
                <strong>Template</strong>:{" "}
                <span>Diện tích: {initData.template?.square ? initData.template.square : 'none'} M2</span>
              </i>
            </p>
            <p>
              <strong>Giá: </strong>
              {initData.template?.price ? initData.template?.price.toLocaleString("it-IT", {
                style: "currency",
                currency: "VND",
              }) : 'none'}
            </p>
            <div style={{ textAlign: "right", width: "50%" }}>
              <div className="styleText">
                <p style={{ fontWeight: "600" }}>CHỦNG LOẠI GIEO TRỒNG</p>
              </div>
              <p>{initData.template.herbMax} Rau gia vị</p>
              {
                initData.herbList.map(herb => <p>{herb.name}</p>)
              }
              <p>{initData.template.leafyMax} Rau ăn lá</p>
              {
                initData.leafyList.map(leafy => <p>{leafy.name}</p>)
              }
              <p>{initData.template.rootMax} Củ, quả</p>
              {
                initData.rootList.map(root => <p>{root.name}</p>)
              }
              <div className="styleText">
                <p style={{ fontWeight: "600" }}>SẢN LƯỢNG DỰ KIẾN</p>
                <p>{initData.template.expectedOutput} kg/tháng</p>
              </div>
              <div className="styleText">
                <p style={{ fontWeight: "600" }}>SỐ LẦN GỬI RAU TỚI NHÀ</p>
                <p>{initData.template.expectDeliveryPerWeek} lần/ tuần</p>
              </div>
              <div className="styleText">
                <p style={{ fontWeight: "600" }}>SỐ Luong GỬI RAU TỚI NHÀ / lan</p>
                <p>{initData.template.expectDeliveryAmount} kg/ lan</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default GardenProjectOrder;

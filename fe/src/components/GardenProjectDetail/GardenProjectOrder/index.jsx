import React, { useState } from "react";
import FARM from "../../../services/farmService";
import { useParams } from "react-router";
import { useEffect } from "react";
import { Col, Row, Divider, Alert } from "antd";
import Loading from "../../../pages/Loading";
import { CalendarFilled } from "@ant-design/icons";

const GardenProjectOrder = () => {
  const [initData, setInitData] = useState(null);
  const projectID = useParams();
  console.log("params: ", projectID);

  useEffect(() => {
    setInitData({
      id: "1",
      date: "23/11/2023",
      startDate: "23/11/2023",
      name: "Duc Huy",
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
                <strong>Tên:</strong> {initData.name}
              </p>
              <p><strong>SĐT:</strong> {initData.phone}</p>
              <p><strong>Địa chỉ:</strong> {initData.address}</p>
            </div>

            <Divider orientationMargin={0} orientation="left">
              <h3>Mô hình yêu cầu</h3>
            </Divider>

            <p>
              <i>
                <strong>Template</strong>:{" "}
                <span>Diện tích: {initData.area} M2</span>
              </i>
            </p>
            <p>
              <strong>Giá: </strong>
              {initData.price.toLocaleString("it-IT", {
                style: "currency",
                currency: "VND",
              })}
            </p>
            <div style={{ textAlign: "right", width: "50%" }}>
              <div className="styleText">
                <p style={{ fontWeight: "600" }}>CHỦNG LOẠI GIEO TRỒNG</p>
                <p>{initData.rau_dinh_duong} Rau dinh dưỡng</p>
              </div>
              <p>{initData.rau_an_la} Rau ăn lá</p>
              <p>{initData.rau_gia_vi} Rau gia vị</p>
              <p>{initData.cu_qua} Củ, quả</p>
              <div className="styleText">
                <p style={{ fontWeight: "600" }}>SẢN LƯỢNG DỰ KIẾN</p>
                <p>{initData.san_luong_du_kien} kg/tháng</p>
              </div>
              <div className="styleText">
                <p style={{ fontWeight: "600" }}>SỐ LẦN GỬI RAU TỚI NHÀ</p>
                <p>{initData.san_luong_du_kien} lần/ tuần</p>
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

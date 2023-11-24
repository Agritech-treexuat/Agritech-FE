import React, { useState } from "react";
import FARM from "../../../services/farmService";
import { useParams } from "react-router";
import { useEffect } from "react";
import { Col, Row, Image, Card } from "antd";
import Loading from "../../../pages/Loading";

const { Meta } = Card;
const GardenProjectInput = () => {
  const [initData, setInitData] = useState(null);
  const projectID = useParams();
  console.log("params: ", projectID);

  useEffect(() => {
    setInitData({
      id: "1",
      transaction_hash: "adakdhakjdsas",
      startDate: "23/11/2023",
      seeds: [
        {
          name: "Hạt giống 1",
          amount: 1000,
          img: "https://st.depositphotos.com/2632165/4026/i/450/depositphotos_40264933-stock-photo-young-plant.jpg",
        },
        {
          name: "Hạt giống 2",
          amount: 1000,
          img: "https://st.depositphotos.com/2632165/4026/i/450/depositphotos_40264933-stock-photo-young-plant.jpg",
        },
        {
          name: "Hạt giống 3",
          amount: 1000,
          img: "https://st.depositphotos.com/2632165/4026/i/450/depositphotos_40264933-stock-photo-young-plant.jpg",
        },
        {
          name: "Hạt giống 4",
          amount: 1000,
          img: "https://st.depositphotos.com/2632165/4026/i/450/depositphotos_40264933-stock-photo-young-plant.jpg",
        },
        {
          name: "Hạt giống 5",
          amount: 1000,
          img: "https://st.depositphotos.com/2632165/4026/i/450/depositphotos_40264933-stock-photo-young-plant.jpg",
        },
        {
          name: "Hạt giống 6",
          amount: 1000,
          img: "https://st.depositphotos.com/2632165/4026/i/450/depositphotos_40264933-stock-photo-young-plant.jpg",
        },
      ],
    });
  }, []);

  return (
    <div>
      {initData ? (
        <div>
          <h2 style={{ margin: "0px" }}>Thông tin khởi tạo</h2>
          <div>
            <p>Ngày bắt đầu: {initData.startDate}</p>
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
                style={{ width: "23%", marginBottom: "1.5rem", marginRight: '1.5rem' }}
                hoverable
                cover={
                  <img
                    alt="example"
                    src={seed.img}
                  />
                }
              >
                <Meta
                  align={"center"}
                  style={{ fontStyle: "italic" }}
                  title={`Hạt giống: ${seed.name}`}
                />
                <div style={{ textAlign: "center" }}>
                  <p>Số lượng: {seed.amount}</p>
                </div>
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

export default GardenProjectInput;

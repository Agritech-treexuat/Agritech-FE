import React from "react";
import { Tabs } from "antd";
import { useParams } from "react-router-dom";
import {
  ProjectOutput,
  ProjectProcess,
  ProjectInput,
  ProjectExpect,
  ProjectTemplate,
} from "../../components";
import GardenProjectInput from "../../components/GardenProjectDetail/GardenProjectInput";
import Loading from "../Loading";
import GardenProjectOrder from "../../components/GardenProjectDetail/GardenProjectOrder";
import GardenProjectHistory from "../../components/GardenProjectDetail/GardenProjectHistory";
import GardenProjectTemplate from "../../components/GardenProjectDetail/GardenProjectTemplate";
const onChange = (key) => {
  console.log(key);
};

const GardenProjectDetail = () => {
  const { id } = useParams();
  console.log("id: ", id);

  const items = [
    {
      key: "1",
      label: "Thông tin đơn hàng",
      children: <GardenProjectOrder />,
    },
    {
      key: "2",
      label: "Đầu vào",
      children: <GardenProjectInput />,
    },
    {
      key: "3",
      label: "Template",
      children: <GardenProjectTemplate />,
    },
    {
      key: "4",
      label: "Quá trình canh tác",
      children: <GardenProjectHistory />,
    },
    {
      key: "5",
      label: "Dự kiến",
      children: <div>hello</div>,
    },
    {
      key: "6",
      label: "Đầu ra",
      children: <div>hello</div>,
    },
  ];
  return (
    <div>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
};
export default GardenProjectDetail;

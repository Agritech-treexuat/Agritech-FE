import React, { useEffect, useState } from 'react'
import { DesktopOutlined, PieChartOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import { Layout, Menu, theme } from 'antd'
import { Outlet, useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'

const { Content, Sider } = Layout

function getItem(label, key, icon, link) {
  return {
    key,
    icon,
    link,
    label
  }
}

const items = [
  getItem('Quản lý dự án', '1', <DesktopOutlined />, '/home'),
  getItem('Quản lý vườn TRH', '2', <DesktopOutlined />, '/manage-planting-garden'),
  getItem('Quản lý yêu cầu', '3', <DesktopOutlined />, '/manage-request'),
  getItem('Quản lý bản mẫu', '4', <DesktopOutlined />, '/manage-template'),
  getItem('Quản lý cây trồng', '5', <TeamOutlined />, '/manage-plant'),
  getItem('Thông tin khác', '6', <PieChartOutlined />, '/other-information'),
  getItem('Trang cá nhân', '7', <UserOutlined />, '/profile')
]

const App = () => {
  const location = useLocation()
  console.log(location.pathname)

  useEffect(() => {
    // Lấy path từ URL và chọn key tương ứng
    const path = window.location.pathname
    const selectedItem = items.find((item) => item.link === path)
    if (selectedItem) {
      setSelectedKey(selectedItem.key)
      console.log(selectedItem.key)
    }
  }, []) // Chạy một lần khi component mount

  const [collapsed, setCollapsed] = useState(false)
  const [selectedKey, setSelectedKey] = useState('1')

  const {
    token: { colorBgContainer }
  } = theme.useToken()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        style={{ position: 'fixed', height: '100%', left: 0, zIndex: 1 }}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu theme="dark" selectedKeys={[selectedKey]} mode="inline" defaultSelectedKeys={[selectedKey]}>
          {items.map((item) => (
            <Menu.Item key={item.key} onClick={() => setSelectedKey(item.key)}>
              {item.icon}
              <span>{item.label}</span>
              <Link to={item.link} />
            </Menu.Item>
          ))}
        </Menu>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Content
          style={{
            margin: '0 16px',
            overflow: 'auto' // Thêm thuộc tính overflow: auto để hiển thị thanh cuộn khi nội dung dài hơn kích thước của content
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default App

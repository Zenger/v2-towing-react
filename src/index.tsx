import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Link , Routes} from "react-router-dom";

import 'antd/dist/antd.css'

import { Layout, Menu } from 'antd';
import {HomeOutlined, UserOutlined, CarOutlined, EnvironmentOutlined, SettingOutlined} from '@ant-design/icons';

import Accounts from './pages/accounts/Accounts';
import Units from './pages/units/Units';
import Jobs from './pages/jobs/Jobs';
import JobView from "./pages/jobs/JobView";
import FleetUnits from "./pages/fleetunits/FleetUnits";
import Options from "./pages/options/Options";
import Users from "./pages/users/Users";


const { Content, Footer } = Layout;



ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        
        <Layout>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="horizontal">
            <Menu.Item key="1">
              <HomeOutlined />
              <span>Home</span>
              <Link to="/" />
            </Menu.Item>
            <Menu.Item key="2">
              <UserOutlined />
              <span>Accounts</span>
              <Link to="/accounts" />
            </Menu.Item>
            <Menu.Item key="3">
              <CarOutlined />
              <span>Units</span>
              <Link to="/units" />
            </Menu.Item>
            <Menu.Item key="4">
              <EnvironmentOutlined />
              <span>Jobs</span>
              <Link to="/jobs" />
            </Menu.Item>
            <Menu.Item key="5">
              <CarOutlined />
              <span>Fleet</span>
              <Link to="/fleet" />
            </Menu.Item>
            <Menu.Item key="6">
              <SettingOutlined />
              <span>Options</span>
              <Link to="/options" />
            </Menu.Item>
            <Menu.Item key="7">
              <UserOutlined />
              <span>Users</span>
              <Link to="/users" />
            </Menu.Item>
          </Menu>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
           
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/accounts/" element={<Accounts />}>
                 <Route path=":page" element={<Accounts />} />
              </Route>
              
              <Route path="/units" element={<Units />}>
                <Route path=":page" element={<Units />} />
              </Route>

              <Route path="/jobs" element={<Jobs />}>
                <Route path=":page" element={<Jobs />} />
              </Route>

              <Route path="/job/:id" element={<JobView />} />

             <Route path="/fleet/" element={<FleetUnits />}>
                 <Route path=":page" element={<FleetUnits />} />
              </Route>

              <Route path="/options" element={<Options />} />
              <Route path="/users" element={<Users />} />
            </Routes>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2016 Created by Ant UED
          </Footer>
        </Layout>

      </Layout>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

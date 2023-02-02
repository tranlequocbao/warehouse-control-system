
  import { Breadcrumb, Tooltip, Layout, Menu, Button } from 'antd';
  import {
    PieChartOutlined,
    UserOutlined,
    ExportOutlined,
    ImportOutlined,
    LogoutOutlined,
    DatabaseOutlined
  } from '@ant-design/icons';
  import Img from "../../assets/Images/LOGO.png"
  import React, { useState, useRef, useLayoutEffect,createContext, useContext } from 'react';
  import ParkingList from '../contents/ParkingList'
  import {Context} from '../../Router/control'
  import '../../Styles/navbar.css'

  const { Header, Content, Footer, Sider } = Layout;
  
  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }
  export const UserContext = createContext();
  const Navbar = () => {
    //get width of window
    const targetRef = useRef();
    const [checkExist,setCheckExist]=useContext(Context)
    const [collapsed, setCollapsed] = useState(false)
    const [page, setPage] = useState('parkingList')
    const [title, setTitle] = useState("Nhập Parking List")
    const  [dataExist,setdataExist]=useState([])
    const infoUser =JSON.parse(localStorage.getItem('username'))
  
    useLayoutEffect(() => {
        
      if (targetRef.current) {
        setResponsive(targetRef.current.offsetWidth)
      }
    }, [targetRef.current]);
  
    const setResponsive = (witdh) => {
      witdh <= 760 ? setCollapsed(true) : setCollapsed(false)
    }
    const components = {
      'parkingList': <ParkingList />,
    //   'import': <Import />,
    //   'export': <Export />,
    //   'layout': <Layouts />,
    //   'reportExport':<ReportExport/>,
    //   'reportImport':<ReportImport/>,
    }
    //console.log(components['exist'])
  
  
  const items = [
    getItem(
      <Tooltip placement="right" title="Báo cáo tồn kho" arrowPointAtCenter>Nhập Parking List</Tooltip>,
      'parkingList',
      <PieChartOutlined />
    ),
    getItem(
      <Tooltip placement="right" title="Báo cáo nhập xuất kho" arrowPointAtCenter>Nhập Kho</Tooltip>,
      'expImp',
      <PieChartOutlined />,
      [
        getItem(<Tooltip placement="right" title="Nhập Kho" arrowPointAtCenter>Nhập kho</Tooltip>, 'import', <ImportOutlined />),
        getItem(<Tooltip placement="right" title="Báo cáo Nhập kho" arrowPointAtCenter>Báo cáo Nhập kho</Tooltip>, 'reportImport', <ExportOutlined />)
      ]
    ),
    getItem(
      <Tooltip placement="right" title="Xuất Kho" arrowPointAtCenter>
        Xuất Kho
      </Tooltip>
      , 'sub1', <UserOutlined />, [
         getItem(<Tooltip placement="right" title="Xuất Kho" arrowPointAtCenter>Xuất kho</Tooltip>, 'export', <ImportOutlined />),
        getItem(<Tooltip placement="right" title="Báo cáo Xuất kho" arrowPointAtCenter>Báo cáo Xuất kho</Tooltip>, 'reportExport', <ExportOutlined />)
    ]),
     getItem(
      <Tooltip placement="right" title="Vị trí tại kho" arrowPointAtCenter>Khai báo vị trí</Tooltip>,
      'layout',
      <DatabaseOutlined />
    ),
  ];
    return (
      <UserContext.Provider value={{
        setPage,
        setdataExist,dataExist
        }}>
      <Layout
        style={{
          minHeight: '100vh',
        }}
        ref={targetRef}
      >
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div className="logo">
            {!collapsed && <img src={Img} alt="Hình banner" className='logoThaco' />}
          </div>
          <Menu
            theme="dark"
            defaultSelectedKeys={['1']}
            mode="inline"
            items={items}
            onClick={e => {
              const { innerText } = e.domEvent.target
              setPage(e.key)
              setTitle(innerText)
            }}
          />
        </Sider>
        <Layout className="site-layout">
          <Header
            className="site-layout-background"
            style={{
              padding: 0,
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <div className='title'>{title}</div>
            <div className='navMenu' style={{ marginRight: '10px',display:'flex',marginLeft:'10px' }}>
            <div>
            <UserOutlined style={{display:'inline-flex',marginRight:'5px'}}/>
            {` ${infoUser[0].FullName}`}
            </div>
              <a 
              className='logout'
              style={{ marginLeft: '10px', display: 'flex' }}
              onClick={()=>{
                localStorage.clear()
               setCheckExist(null)
                }}
                href='#'
              > 
              <div><LogoutOutlined style={{display:'inline-flex',marginRight:'5px'}}/></div> 
              Đăng xuất
              </a>
            </div>
          </Header>
          <Content
            style={{
              margin: '0 16px',
            }}
          >
            <Breadcrumb
              style={{
                margin: '16px 0',
              }}
            >
            </Breadcrumb>
            <div
              className="site-layout-background"
              style={{
                padding: 24,
                minHeight: 360,
              }}
            >
              {components[page]}
            </div>
          </Content>
          <Footer
            style={{
              textAlign: 'center',
            }}
          >
            Copyright 2022 © AS TEAM
          </Footer>
        </Layout>
      </Layout>
      </UserContext.Provider>
    )
  }
  export default Navbar;
  
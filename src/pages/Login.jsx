import React, { useState,useContext } from "react";
import "../Styles/login.css"
import {
  Form,
  Input,
  notification,
  Button,
  Tooltip,
} from "antd";
import {
  InfoCircleOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
  UserOutlined,
  MailOutlined ,
  KeyOutlined 
} from "@ant-design/icons";

import Logo from "../assets/Images/LOGO.png";
import Bgimg from "../assets/Images/BG.JPG";
import Titleimg from "../assets/Images/titleimg.png";
import axios from "axios";
import {Context} from '../Router/control'

var CryptoJS = require("crypto-js");
function Login() {
  const [form] = Form.useForm();
  const [checkExist,setCheckExist]=useContext(Context)
  const [checkRegister, setCheckRegister] = useState(false)
  const onFinish = (values) => {
    let user = values.username;
    let pass = values.password;
    let keycode = values.keycode;

    var url = "http://10.40.12.4:8089/api/Login";
    axios
      .post(url, {
        user: user,
        pass: pass,
      })
    
      .then((res) => {
        if (res.data.length !== 0) {
          var data = res.data
        
          var bytes = CryptoJS.AES.decrypt(data[0].Pass, "TMAC@25032018");
          var decryptedData =bytes.toString(CryptoJS.enc.Utf8);
         
         
          if (decryptedData === pass) {
           
            url = "http://10.40.12.4:8089/api/Login2";
            axios
              .post(url, {
                user: user,
                keycode: keycode,
              })
              .then((res) => {
          
                if (res.data.length !== 0) {
                  res.data[0].Pass=''
                  window.localStorage.setItem("username", JSON.stringify(res.data));
                  setCheckExist(JSON.parse(localStorage.getItem('username')))
                } else
                  notification.error({
                    message: "Thông Báo",
                    description: "Mã xác thực không đúng",
                  });
              });
          } else {
            notification.error({
              message: "Thông báo",
              description: "Thông tin đăng nhập không đúng",
            });
          }
        }
        else{
          notification.error({
            message: "Thông báo",
            description: "Thông tin đăng nhập không đúng",
          });
        }
      })
      .catch((error) => {
        console.log(error)
        notification.error({
          message: "Notification",
          description: "Unable to access server",
          placement: "bottomRight",
        });
      });
  };

  const handleKeycode = (e) => {
    e.preventDefault()
    // var passEncrypt = CryptoJS.AES.encrypt(
    //   JSON.stringify('021291'),
    //   "TMAC@25032018"
    // ).toString();
    // console.log(passEncrypt)
    let UID = form.getFieldValue("username")?form.getFieldValue("username"):'';
    let PWS = form.getFieldValue("password");
    if (UID.length !== 0) {
      var url = "http://10.40.12.4:8089/api/Login";
      axios
        .post(url, {
          user: UID,
          pass: PWS,
        })
        .then((res) => {
       
          if (res.data.length !== 0) {
            var bytes = CryptoJS.AES.decrypt(res.data[0].Pass, "TMAC@25032018");
            var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
            if (decryptedData === PWS) {
              url = "http://10.40.12.4:8089/api/Sendkeycode";
              axios
                .post(url, {
                  user: UID,
                })
                .then((res) => {
                  if (res.data === "OK") {
                    notification.success({
                      message: "Thông báo",
                      description: "Gửi mã xác thực thành công",
                    });
                  } else
                    notification.error({
                      message: "Thông Báo",
                      description: "Gửi mã xác thực thất bại",
                    });
                });
            } else {
              notification.error({
                message: "Thông báo",
                description: "Thông tin đăng nhập không đúng",
              });
            }
          }
          // if (res.data == "OK") {
          //   notification.success({
          //     message: "Thông báo",
          //     description: "Gửi mã xác thực thành công. Vui lòng kiểm tra mail!",
          //   });
          // } else
          //   notification.error({
          //     message: "Notification",
          //     description: "Change password failed",
          //     placement: "bottomRight",
          //   });
        })
        .catch((error) => {
          notification.error({
            message: "Notification",
            description: "Unable to access server",
            placement: "bottomRight",
          });
        });
    } else
      notification.error({
        message: "Thông báo",
        description: "Vui lòng nhập mã số nhân viên",
      });
  };
  const register = (values) => {

   var cryptoPass = CryptoJS.AES.encrypt(values.password,"TMAC@25032018").toString();
    values.pass = cryptoPass

     axios.post('http://10.40.12.4:8089/api/register',{values})
     .then(res=>{
       if(res.data==='ok'){
        notification.success({
          message:'Thông báo',
          description:'Đã tạo tài khoản thành công, Vui lòng kiểm tra hộp thư email để lấy mã đăng nhập!'
         })
         setCheckRegister(false)
         form.resetFields()
       }
    
       else if(res.data==='exist mail'){
        notification.error({
          message:'Thông báo',
          description:'Tạo tài khoản thất bại! Email đã được đăng kí'
         })
       }
       else if(res.data==='exist id'){
        notification.error({
          message:'Thông báo',
          description:'Tạo tài khoản thất bại! Mã số đã được đăng kí'
         })
       }
       else {
        notification.error({
          message:'Thông báo',
          description:'Tạo tài khoản thất bại! Vui lòng liên hệ IT để xử lý'
         })
       }
      
     })
  }
  return (
    <div className="login-page">

        {checkRegister&&
        <Form
          name="signUp-form"
          form={form}
          initialValues={{ remember: true }}
          onFinish={register}
          className='formLogin'
         
        >
          <div className="loginimage signUp">
            <img src={Logo}  />
            <h2 className="form-title">QUẢN TRỊ KHO</h2>
            <h3>Đăng ký người dùng</h3>
          </div>
          <div className="Imgtitle">
            <img src={Titleimg} alt='hinh anh' />
          </div>
          <div className="inputInfo">
          <Form.Item
              name="UID"
              rules={[
                { required: true, message: "Vui lòng nhập mã số nhân viên!" },
              ]}
              className='input'
            >
              <Input placeholder="Nhập mã số nhân viên"
                suffix={
                  <Tooltip title="Mã số công ty cấp cho bạn">
                    <KeyOutlined 
                      style={{
                        color: "rgba(0,0,0,.45",
                      }} />

                  </Tooltip>
                }
              />
            </Form.Item>
            <Form.Item
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập họ và tên!" },
              ]}
              className='input'
            >
              <Input placeholder="Nhập họ tên"
                suffix={
                  <Tooltip title="Tên đầy đủ của bạn">
                    <UserOutlined 
                      style={{
                        color: "rgba(0,0,0,.45",
                      }} />

                  </Tooltip>
                }
              />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập tài khoản email của bạn!",type:'email' },
              ]}
              className='input'
            >
              <Input placeholder="Nhập email"
                suffix={
                  <Tooltip title="Sử dụng email công ty (...@thaco.com.vn)">
                    <MailOutlined 
                      style={{
                        color: "rgba(0,0,0,.45",
                      }} />

                  </Tooltip>
                }
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              className='input'
              dependencies={['password']}
              hasFeedback
            >
              <Input.Password
                placeholder="Nhập mật khẩu"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            <Form.Item
              name="confirm"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Vui lòng nhập trùng Password'));
                },
              }),
              ]}
              className='input'
              dependencies={['password']}
            >
              <Input.Password
                placeholder="Nhập lại mật khẩu"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
          </div>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Đăng Ký
            </Button>
          </Form.Item>
          <div className="changeForm">
            <div className="register"><button style={{ fontStyle: 'italic', width: 'fit-content', border: 0, background: 'transparent', textDecoration: 'underline' }} onClick={()=>setCheckRegister(false)} href="#">Đăng Nhập</button></div>
          </div>
        </Form>
      }
      <div className="background">
        <img src={Bgimg} alt="Login" />
      </div>
      {!checkRegister&&
      <Form
        name="login-form"
        form={form}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        className='formLogin'
      
      >
        <div className="loginimage">
          <img src={Logo} />
          <h2 className="form-title">QUẢN TRỊ KHO</h2>
          <h3>Đăng nhập ứng dụng</h3>
        </div>
        <div className="Imgtitle">
          <img src={Titleimg} alt='hinh anh' />
        </div>

        <div className="inputInfo">
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Vui lòng nhập mã số nhân viên!" },
            ]}
            className='input'
          >
            <Input placeholder="Nhập mã số nhân viên"
              suffix={
                <Tooltip title="Mã số nhân viên tại công ty">
                  <UserOutlined
                    style={{
                      color: "rgba(0,0,0,.45",
                    }} />

                </Tooltip>
              }
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            className='input'
          >
            <Input.Password
              placeholder="Nhập mật khẩu"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item
            name="keycode"
            rules={[{ required: true, message: "Vui lòng nhập mã đăng nhập!" }]}
            className='input'
          >
            <Input
              placeholder="Nhập mã đăng nhập"
              suffix={
                <Tooltip title="Mã được gửi về mail của bạn">
                  <InfoCircleOutlined
                    style={{
                      color: "rgba(0,0,0,.45",
                    }}
                  />
                </Tooltip>
              }
            />
          </Form.Item>
        </div>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Đăng nhập
          </Button>
        </Form.Item>
        <div className="changeForm">
          <button style={{ display: 'flex', justifyContent: 'center', margin: '0 auto', width: 'fit-content', border: 0, background: 'transparent', textDecoration: 'underline' }} onClick={handleKeycode} href="#">Nhận mã xác thực</button>
          <div className="register"><button style={{ fontStyle: 'italic', width: 'fit-content', border: 0, background: 'transparent', textDecoration: 'underline' }} onClick={()=>setCheckRegister(true)} href="#">Đăng ký</button></div>
        </div>
      </Form>
    }
    </div>
  );
}

export default Login;

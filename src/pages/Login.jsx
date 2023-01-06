import React, { useState } from "react";
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
  UserOutlined
} from "@ant-design/icons";

import Logo from "../assets/Images/LOGO.png";
import Bgimg from "../assets/Images/BG.JPG";
import axios from "axios";
import Titleimg from "../assets/Images/titleimg.png";
//import Context from "../../Data/Context";
//import { useNavigate } from "react-router-dom";
var CryptoJS = require("crypto-js");
function Login() {
  const [form] = Form.useForm();
  //const { setUsername } = React.useContext(Context);
  //let navigate = useNavigate();
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
          var bytes = CryptoJS.AES.decrypt(res.data[0].Pass, "TMAC@25032018");
          var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          if (decryptedData === pass) {
            url = "http://10.40.12.4:8089/api/Login2";
            axios
              .post(url, {
                user: user,
                keycode: keycode,
              })
              .then((res) => {
                if (res.data.length !== 0) {
                  window.localStorage.setItem("username", JSON.stringify(res.data));
                  //setUsername(res.data);
                  //navigate("/Home");
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
      })
      .catch((error) => {
        notification.error({
          message: "Notification",
          description: "Unable to access server",
          placement: "bottomRight",
        });
      });
  };
  const handleKeycode = () => {
    // var passEncrypt = CryptoJS.AES.encrypt(
    //   JSON.stringify('021291'),
    //   "TMAC@25032018"
    // ).toString();
    // console.log(passEncrypt)
    let UID = form.getFieldValue("username");
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
            var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
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
  return (
    <div className="login-page">
      <div className="background">
        <img src={Bgimg} alt="Login" />
      </div>

      <Form
        name="login-form"
        form={form}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        className='formLogin'
      >
        <div className="loginimage">
          <img src={Logo} className='logo' />
          <h2 className="form-title">QUẢN TRỊ KHO</h2>
          <h3>Đăng nhập ứng dụng</h3>
        </div>
        <div className="Imgtitle">
          <img src={Titleimg} alt='hinh anh' />
        </div>

        <div class="inputInfo">
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
        <div className="keycode">
          <button style={{ display: 'flex', justifyContent: 'center', margin: '0 auto', width: 'fit-content', border: 0, background: 'transparent', textDecoration: 'underline' }} onClick={handleKeycode} href="#">Nhận mã xác thực</button>
        </div>
      </Form>
    </div>
  );
}

export default Login;

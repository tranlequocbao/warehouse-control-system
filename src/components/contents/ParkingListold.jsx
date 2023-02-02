import React, { useState } from 'react'
import { InboxOutlined } from '@ant-design/icons'
import { message, Upload } from 'antd'
import axios from 'axios'
import * as XLSX from 'xlsx'
export default function ParkingList() {
  const { Dragger } = Upload
  const [data, setData] = useState({})
  const [statusUp, setStatusUp] = useState('uploading')
  const props = {

    name: 'file',
    multiple: false,
    //action: 'http://10.40.12.4:8089/api/uploadParkinglist',
    headers: {
      authorization: "authorization-text",
      contentType: "multipart/form-data"
    },
    beforeUpLoad(info){
      const { status } = info.file;
      console.log(info.file.status)
      let fileName = info.file.name
      var arrTemp = fileName.split(".")
      console.log(info.file)
      if (arrTemp[arrTemp.length - 1] === 'xlsx') {
          var file = info.file.originFileObj;
          delete file["uid"];
          let promise = new Promise((resolve, reject) => {
            const fileread = new FileReader();
            fileread.readAsArrayBuffer(file);
            fileread.onload = (e) => {
              const buffarray = e.target.result;
              const wb = XLSX.read(buffarray, { type: "buffer" }) && XLSX.read(buffarray, { type: "buffer" });
              const wsname = wb.SheetNames[5];
              const ws = wb.Sheets[wsname];
              const data = XLSX.utils.sheet_to_json(ws);
              resolve(data);
            };
            fileread.onerror = (error) => {
              reject(error);
            };
          });
          promise.then((d) => {
            setData(d)
            console.log(d)
            return true
            // axios.post('http://10.40.12.4:8089/api/uploadParkinglist', { d: d, name: file.name })
            //   .then((req, res) => {
            //     console.log(res)
            //     if (req.status == 200) {
                
            //       // message.success(`${file.name} file uploaded successfully.`);
            //       setData(d)
            //       return true
            //     }
            //   })
            //   .catch(error => {
            //     return false
            //     // message.success(`${file.name} file uploaded successfully.`);
            //   })
          });
      }
      else message.error('Vui lòng chọn đúng file Excel có định dạng xlsx')
    },
    onChange(info) {
      if(data!=={}){
        let fileName = info.file.name
        axios.post('http://10.40.12.4:8089/api/uploadParkinglist', { d: data, name: fileName })
              .then((req, res) => {
                console.log(res)
                if (req.status == 200) { 
                   message.success(`${fileName} file uploaded successfully.`);
                }
              })
              .catch(error => {
                message.success(`${fileName} file uploaded successfully.`);
              })
      }
      // const {status}=info.file
      // var file = info.file.originFileObj;
      // if(status!=='uploading'){
      //   console.log('ok')
      // }
      // if(status==='done'){
      //   message.success(`${file.name} file uploaded successfully.`);
      // }
      // if(status==='error'){
      //   message.error(`${file.name} file uploaded failed.`);
      // }
     
    },
  
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  }

  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Chọn hoặc thả các tệp vào vùng này</p>
      <p className="ant-upload-hint">
        Hỗ trợ tải nhiều tệp cùng một lúc. Nghiêm cấm tải các tệp tài liệu không được pháp luật cho phép
      </p>
    </Dragger>
  )
}

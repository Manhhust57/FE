import React from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import "./contact.css";

const Contact: React.FC = () => {
  const [form] = Form.useForm();

  // Configure message globally
  message.config({
    top: 80,
    duration: 3,
    maxCount: 1,
  });

  const onFinish = async (values: any) => {
    try {
      await axios.post("https://anstay.com.vn/api/contacts", {
        name: values.name,
        email: values.email,
        phone: values.phone,
        message: values.hobbies,
      });

      message.success({
        content: "Gửi tin thành công!",
        className: "custom-message",
        style: {
          fontSize: "16px",
          fontWeight: "bold",
        },
      });
      form.resetFields();
    } catch (error) {
      message.error({
        content: "Có lỗi xảy ra khi gửi tin!",
        className: "custom-message",
        style: {
          fontSize: "16px",
          fontWeight: "bold",
        },
      });
    }
  };

  return (
    <div className="main-contact">
      {/* <div className="img-contact">
        <img
          src="https://i.ibb.co/7drwxYbK/35250.jpg"
          alt="img-contact"
          className="img-back-contact"
        />
      </div> */}
      <div className="form-contact">
        <div className="contact-left">
          <h1>Liên hệ</h1>
          <div className="text-contact">
            <p>ANSTAY RESIDENCE</p>
            <p>Địa chỉ : Tòa Star Lake DeaWoo, khu đô thị Tây Hồ Tây, Hà Nội</p>
            <p>Số điện thoại : 0916612772</p>
            <p>Email : anstayresidence@gmail.com</p>
          </div>
        </div>
        <div className="contact-right">
          <Form
            form={form}
            layout="vertical"
            className="custom-form"
            onFinish={onFinish}
          >
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
            >
              <Input placeholder="Họ và Tên" />
            </Form.Item>
            <Form.Item
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input placeholder="SĐT" />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input type="email" placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="hobbies"
              rules={[{ required: true, message: "Vui lòng nhập tin nhắn!" }]}
            >
              <Input.TextArea placeholder="Tin nhắn" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="send-button">
                <span style={{ color: "white" }}>GỬI TIN</span>
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Contact;

import axios from 'axios';
import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // 引入提示框组件

import 'react-toastify/dist/ReactToastify.css'; // 引入提示组件样式 否则提示框不可见
import { registerRoute } from '../utils/APIRoutes';

import Logo from '../asstes/logo.svg';

// 定义样式组件
const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem; // 行与列之间的间隙
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    img {
      height: 5rem;
    }
    h1 {
      color: #fff;
      text-transform: uppercase;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
    input {
      background-color: transparent;
      padding: 1rem;
      border: 0.1rem solid #4e0eff;
      border-radius: 0.4rem;
      color: #fff;
      width: 100%;
      font-size: 1rem;
      &:focus {
        border: 0.1rem solid #997af0;
        outline: none;
      }
    }
    button {
      background-color: #997af0;
      color: #fff;
      padding: 1rem 2rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 0.4rem;
      font-size: 1rem;
      text-transform: uppercase;
      transition: all 0.5s ease-in-out;
      &:hover {
        background-color: #4e0eff;
      }
    }
    span {
      color: #fff;
      text-transform: uppercase;
      a {
        color: #4e0eff;
        text-decoration: none;
        font-weight: bold;
      }
    }
  }
`;

export default function Register() {
  const navigate = useNavigate();

  // 使用状态管理处理表单值对象
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // 提示框设置对象
  const toastOptions = {
    position: 'bottom-right',
    autoClose: 5000,
    draggable: true,
    theme: 'dark',
  };

  useEffect(() => {
    if (localStorage.getItem('chat-app-user')) {
      navigate('/');
    }
  }, []);

  // 表单提交事件
  const handleSubmit = async e => {
    // 阻止默认事件并触发校验事件
    e.preventDefault();
    if (handleValidation()) {
      const { password, username, email } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });
      if (!data.status) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status) {
        localStorage.setItem('chat-app-user', JSON.stringify(data.user));
        navigate('/');
      }
    }
  };

  // 表单校验事件
  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error(
        'password and confirm password should be same.',
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error('Username should be greater than 3 characters', toastOptions);
      return false;
    } else if (password.length < 6) {
      toast.error(
        'Password should be equal or greater than 6 characters',
        toastOptions
      );
      return false;
    } else if (email === '') {
      toast.error('email is required', toastOptions);
      return false;
    }
    return true;
  };

  // 输入框输入事件
  const handleChange = e => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={e => handleSubmit(e)}>
          <div className="brand">
            <img src={Logo} alt="" />
            <h1>snappy</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={e => handleChange(e)}
          />
          <input
            type="text"
            placeholder="Email"
            name="email"
            onChange={e => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={e => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={e => handleChange(e)}
          />
          <button type="submit">Create User</button>
          <span>
            Already have an account ? <Link to="/login">Login</Link>
          </span>
        </form>
      </FormContainer>
      {/* 提示框组件 */}
      <ToastContainer />
    </>
  );
}

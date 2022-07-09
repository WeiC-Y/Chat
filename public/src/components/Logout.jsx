import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BiPowerOff } from 'react-icons/bi';

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  background-color: #9a86f3;
  border: none;
  border-radius: .5rem;
  cursor: pointer;
  border: none;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;

export default function Logout() {
  const navigate = useNavigate();

  // 注销按钮点击事件
  const handleClick = async () => {
    localStorage.clear(); // 清空登录用户信息
    navigate('/login'); // 返回登录页
  };

  return (
    <Button onClick={handleClick}>
      <BiPowerOff />
    </Button>
  );
}

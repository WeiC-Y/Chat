import axios from 'axios';
import { Buffer } from 'buffer';
import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; // 引入提示框组件

import 'react-toastify/dist/ReactToastify.css'; // 引入提示组件样式 否则提示框不可见
import { setAvatarRoute } from '../utils/APIRoutes';

import loader from '../asstes/loader.gif';

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: #fff;
    }
  }

  .avatars {
    display: flex;
    gap: 2rem;
    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        cursor: pointer;
      }
    }

    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
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
`;

export default function SetAvatar() {
  const api = 'https://api.multiavatar.com/45678945'; // 生成随机头像API地址
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]); // 头像数组
  const [isLoading, setIsLoading] = useState(true); // 是否加载中
  const [selectedAvatar, setSelectedAvatar] = useState(undefined); // 选定的头像

  // 提示框设置对象
  const toastOptions = {
    position: 'bottom-right',
    pauseOnHover: true,
    autoClose: 5000,
    draggable: true,
    theme: 'dark',
  };

  useEffect(() => {
    if (!localStorage.getItem('chat-app-user')) {
      navigate('/login');
    }
  }, []);

  // 设置用户头像
  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      // 未选择头像提示错误
      toast.error('Please select an avatar', toastOptions);
    } else {
      const user = await JSON.parse(localStorage.getItem('chat-app-user'));
      // 发起网络请求 根据当前登录用户id 将选择的头像地址传入后台保存
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });
      if (data.isSet) { // 判断是否设置头像成功
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem('chat-app-user', JSON.stringify(user));
        navigate('/');
      } else {
        toast.error('Error setting avatar, Please try again.', toastOptions);
      }
    }
  };

  useEffect(() => {
    // 组件挂载时发起请求获取图片
    const func = async () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}`
        ); // 数字表示随机
        const buffer = new Buffer(image.data);
        data.push(buffer.toString('base64'));
      }
      setAvatars(data);
      setIsLoading(false); // 图片加载完毕后取消加载状态
    };
    func();
  }, []);

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, i) => {
              return (
                <div
                  key={i}
                  className={`avatar ${selectedAvatar === i ? 'selected' : ''}`}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    onClick={() => setSelectedAvatar(i)}
                  />
                </div>
              );
            })}
          </div>
          <button className="submit-btn" onClick={setProfilePicture}>
            Set as Profile Picture
          </button>
        </Container>
      )}
      <ToastContainer />
    </>
  );
}

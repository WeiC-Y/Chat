import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { allUsersRoute, host } from '../utils/APIRoutes';

import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import { io } from 'socket.io-client';

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default function Chat() {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState();
  const [currentChat, setCurrentChat] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 不存在当前登录用户 返回登陆界面
    if (!localStorage.getItem('chat-app-user')) {
      navigate('/login');
    } else {
      setCurrentUser(JSON.parse(localStorage.getItem('chat-app-user')));
      setIsLoading(true);
    }
  }, []);

  // currentUser改变时, 若用户在线则触发 socket 的 add-user
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit('add-users', currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    // 获取联系人列表
    const func = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          // 查看是否有登录用户 且该用户已设置头像
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
        } else {
          // 未设置头像则跳转头像设置界面
          navigate('/setAvatar');
        }
      }
    };
    func();
  }, [currentUser]);

  const handleChatChange = chat => {
    setCurrentChat(chat);
  };

  return (
    <Container>
      <div className="container">
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
        />
        {isLoading && currentChat === undefined ? (
          <Welcome currentUser={currentUser} />
        ) : (
          <ChatContainer
            currentChat={currentChat}
            currentUser={currentUser}
            socket={socket}
          />
        )}
      </div>
    </Container>
  );
}

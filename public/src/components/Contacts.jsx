import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// LOGO图片
import Logo from '../asstes/logo.svg';

// 容器组件样式
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;
  .brand {
    // 图标
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    img {
      height: 2rem;
    }
    h3 {
      color: #fff;
      text-transform: uppercase;
    }
  }
  .contacts {
    // 联系人列表
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      // 单个联系人
      display: flex;
      align-items: center;
      min-height: 5rem;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      gap: 1rem;
      transition: 0.5s ease-in-out;
      background-color: #ffffff39;
      cursor: pointer;
      .avatar {
        // 头像
        img {
          height: 3rem;
        }
      }
      .username {
        // 用户名
        overflow: hidden;
        h3 {
          color: #fff;
        }
      }
    }
    .selected {
      // 被选中的联系人
      background-color: #9186f3;
    }
  }
  .current-user {
    // 当前登录用户www
    background-color: #0d0d30;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: #fff;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;

export default function Contacts({ contacts, currentUser, changeChat }) {
  const [currentUserName, setCurrentName] = useState();
  const [currentUserImage, setCurrentUserImage] = useState();
  const [currentSelected, setCurrentSelected] = useState();

  useEffect(() => {
    // 保存当前登录用户的信息
    if (currentUser) {
      setCurrentUserImage(currentUser.avatarImage);
      setCurrentName(currentUser.username);
    }
  }, [currentUser]);

  const changeCurrentChat = (i, contact) => {
    setCurrentSelected(i);
    changeChat(contact);
  };

  return (
    <>
      {currentUserImage && currentUserName && (
        <Container>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>snappy</h3>
          </div>
          <div className="contacts">
            {contacts.map((contact, i) => {
              return (
                <div
                  className={`contact ${
                    i === currentSelected ? 'selected' : ''
                  }`}
                  key={i}
                  onClick={() => changeCurrentChat(i, contact)}
                >
                  <div className="avatar">
                    <img
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                      alt="avatar"
                    />
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}

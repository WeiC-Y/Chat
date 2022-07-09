import React from 'react';
import styled from 'styled-components';
import Robot from '../asstes/robot.gif';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #fff;
  img {
    height: 20rem;
  }
  span {
    color: #4e00ff;
  }
`;

export default function Welcome({ currentUser }) {
  return (
    <Container>
      <img src={Robot} alt="Robot" />
      <h1>
        Welcome, <span>{currentUser.username}!</span>
      </h1>
      <h3>Please select a chat to Start Chating!</h3>
    </Container>
  );
}

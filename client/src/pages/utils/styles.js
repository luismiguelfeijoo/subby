import styled from 'styled-components';

export const Form = styled.form`
  margin-top: 10px;
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
`;

export const Button = styled.button`
  border-radius: 5px;
  padding: 10px;
  width: 100%;
  align-self: center;
  margin: 10px 0;
  color: #f7fff7;
  border-color: #4ecdc4;
  background-color: #4ecdc4;
  border-style: solid;
`;

export const formItemLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16, offset: 4 }
  }
};

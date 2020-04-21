import React, { useEffect, useContext, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { UserContext, getClients } from '../../lib/auth.api';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { Typography, List, Skeleton } from 'antd';
import { Chat } from '../components/Chat/Index';
import { withTypeUser } from '../../lib/protectedTypeUser';
import { SiderMenu } from '../components/Layout/Menu';

export const SingleChatPage = withProtected(
  withTypeUser(
    withRouter(({ history, match }) => {
      const { user } = useContext(UserContext);
      const [spinner, setSpinner] = useState(true);

      return (
        <LayoutTemplate sider menu={<SiderMenu currentPage='chat' />}>
          <Chat id={match.params.id}></Chat>
        </LayoutTemplate>
      );
    }),
    { type: 'coordinator' }
  )
);

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ChatPage } from '../pages/Chat.page';
import { SingleChatPage } from '../pages/SingleChat.page';

export const ChatRouter = ({ match }) => {
  return (
    <Switch>
      <Route
        path={`${match.url}`}
        exact
        component={(props) => <ChatPage {...props} />}
      />
      <Route
        path={`${match.url}/:id`}
        component={(props) => <SingleChatPage {...props} />}
      />
    </Switch>
  );
};

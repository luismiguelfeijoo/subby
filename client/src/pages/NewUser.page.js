import React, { useState, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { UserContext } from '../../lib/auth.api';
import { useForm, FormContext } from 'react-hook-form';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { Input, Select } from '../components/Input';
import { Button, Form } from './utils/styles';
import { withTypeUser } from '../../lib/protectedTypeUser';

export const NewUserPage = withProtected(
  withTypeUser(
    withRouter(({ history }) => {
      const { setLoading } = useContext(UserContext);
      const [type, setType] = useState();

      const methods = useForm({
        mode: 'onBlur',
        defaultValue: {
          password: '',
          firstName: '',
          lastName: ''
        }
      });

      const { register, handleSubmit, errors } = methods;

      const onSubmit = async data => {
        console.log(data);
        //console.log(data);
        setType({ type });
      };

      return (
        <LayoutTemplate sider={true}>
          <FormContext {...methods}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Select
                name='type'
                ref={register({
                  validate: value => {
                    return value !== '';
                  }
                })}
                onChange={event => setType(event.target.value)}
                options={['User', 'Subscription']}
              />
            </Form>
            {type && <h1>{type}</h1>}
          </FormContext>
        </LayoutTemplate>
      );
    }),
    {
      type: 'admin',
      redirectTo: '/login'
    }
  )
);

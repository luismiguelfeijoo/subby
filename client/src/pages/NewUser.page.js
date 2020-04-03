import React, { useState, useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import {
  UserContext,
  askUserToken,
  createSubscription
} from '../../lib/auth.api';
import { useForm, FormContext } from 'react-hook-form';
import { withProtected } from '../../lib/protectedRoute';
import { LayoutTemplate } from '../components/Layout';
import { Input, Select, SimpleSelect } from '../components/Input';
import { Button, Form } from './utils/styles';
import { withTypeUser } from '../../lib/protectedTypeUser';

export const NewUserPage = withProtected(
  withTypeUser(
    withRouter(({ history }) => {
      const { user, setLoading } = useContext(UserContext);
      const [type, setType] = useState();

      useEffect(() => {
        // Retrieve all the active plans calling the API
      }, []);

      const methods = useForm({
        mode: 'onBlur'
      });

      const { register, handleSubmit, errors } = methods;

      const onSubmitUser = async data => {
        setLoading(true);
        try {
          const response = await askUserToken(data);
          history.push('/new-user');
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

      const onSubmitSub = async data => {
        setLoading(true);
        try {
          const response = await createSubscription(data);
          history.push('/new-user');
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

      return (
        <LayoutTemplate sider={true}>
          <SimpleSelect
            name='type'
            ref={register({
              validate: value => {
                return value !== '';
              }
            })}
            onChange={event => setType(event.target.value)}
            options={['User', 'Subscription']}
            def='What are you going to add?'
          />

          {type === 'user' ? (
            <FormContext {...methods}>
              <Form onSubmit={handleSubmit(onSubmitUser)}>
                <Input
                  name='username'
                  placeholder='Email'
                  ref={register({
                    required: 'Required *',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: 'invalid email address'
                    }
                  })}
                  type='text'
                />
                <Select
                  name='type'
                  ref={register({
                    validate: value => {
                      return value !== '';
                    }
                  })}
                  options={['client', 'coordinator', 'admin']}
                  def='Select the type of user you want to create!'
                />
                <Button type='submit'>Create User</Button>
              </Form>
            </FormContext>
          ) : type ? (
            <FormContext {...methods}>
              <Form onSubmit={handleSubmit(onSubmitSub)}>
                <Input
                  name='username'
                  placeholder='Client username'
                  ref={register({
                    required: 'Required *',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: 'invalid email address'
                    }
                  })}
                  type='text'
                />
                <Input
                  name='firstName'
                  placeholder='First Name'
                  ref={register({
                    required: 'Required *'
                  })}
                />
                <Input
                  name='lastName'
                  placeholder='Last Name'
                  ref={register({
                    required: 'Required *'
                  })}
                />
                <Select
                  name='plan'
                  ref={register({
                    validate: value => {
                      return value !== '';
                    }
                  })}
                  options={['client', 'coordinator', 'admin']}
                  def='Select the plan you want to add'
                />
                <Input
                  name='date'
                  type='date'
                  ref={register({
                    required: true
                  })}
                  min='2019-12-31'
                />
                <Button type='submit'>Create Sub</Button>
              </Form>
            </FormContext>
          ) : (
            ''
          )}
        </LayoutTemplate>
      );
    }),
    {
      type: 'admin',
      redirectTo: '/login'
    }
  )
);

import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Form, Input, Button, notification } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { loginUser } from '../../../services/authService';
import { DataContext } from '../../helpers/DataContext';
import ChangePass from './ChangPass';

const Login = () => {
  const { handleStoreUser } = useContext(DataContext);
  const navigate = useNavigate();

  const [isChangePassOpen, setChangePassOpen] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email is required')
      .email('Email should be valid'),
    password: Yup.string().required('Password is required'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await loginUser(data);
      if (result.status === 200) {
        handleStoreUser(result.data);
        navigate('/');
      } else if (result.status === 400) {
        notification.error({
          message: 'Login Failed',
          description: result.message || 'Invalid input.',
        });
      } else if (result.status === 404) {
        notification.error({
          message: 'Login Failed',
          description: 'Invalid credentials!!',
        });
      } else {
        notification.error({
          message: 'Login Failed',
          description: 'Unexpected error occurred.',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Login Error',
        description: 'Oops, something went wrong!!',
      });
    }
  };

  return (
    <section id="services" style={{ padding: '50px 0', textAlign: 'center' }}>
      <div className="container">
        <div className="logo" style={{ marginBottom: '30px' }}>
          <div className="logo-name">
            <h1>
              <span style={{ color: '#1890ff' }}>LO</span>GIN
            </h1>
          </div>
        </div>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
            <Form.Item
              label="Email"
              validateStatus={errors.email ? 'error' : ''}
              help={errors.email && errors.email.message}
            >
              <Input
                placeholder="Enter your email"
                {...register('email')}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              validateStatus={errors.password ? 'error' : ''}
              help={errors.password && errors.password.message}
            >
              <Input.Password
                placeholder="Enter your password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                {...register('password')}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Login
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <span
                style={{
                  cursor: 'pointer',
                  color: '#1890ff',
                  textDecoration: 'underline',
                }}
                onClick={() => setChangePassOpen(true)}
              >
                Forgot your password?
              </span>
            </div>
          </Form>
        </div>
        <ChangePass
          isChangePassOpen={isChangePassOpen}
          setChangePassOpen={setChangePassOpen}
        />
      </div>
    </section>
  );
};

export default Login;


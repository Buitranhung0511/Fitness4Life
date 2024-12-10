import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Form, Input, Button, Radio, notification } from 'antd';
import { registerUser } from '../../../services/authService';

const Registration = () => {
  const [loading, setLoading] = useState(false);

  // Schema validation với Yup
  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string()
      .required('Email is required')
      .email('Email should be valid'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters long'),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
    gender: Yup.string().required('Gender is required'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    const newData = { ...data, role: 'USER' };
    try {
      setLoading(true);
      const result = await registerUser(newData);

      if (result.status === 201) {
        reset();
        notification.success({
          message: 'Success',
          description: 'Registration successful!',
        });
      } else if (result.status === 400) {
        notification.error({
          message: 'Registration Failed',
          description: result.message,
        });
      }
    } catch (error) {
      notification.error({
        message: 'Registration Error',
        description: 'Oops, something went wrong!',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', textAlign: 'center' }}>
      <h1 style={{ color: '#1890ff' }}>Register</h1>
      <Form
        layout="vertical"
        onFinish={handleSubmit(onSubmit)}
        style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
      >
        {/* Full Name */}
        <Form.Item
          label="Full Name"
          validateStatus={errors.fullName ? 'error' : ''}
          help={errors.fullName?.message}
        >
          <Input placeholder="Enter your full name" {...register('fullName')} />
        </Form.Item>

        {/* Email */}
        <Form.Item
          label="Email Address"
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email?.message}
        >
          <Input placeholder="Enter your email" {...register('email')} />
        </Form.Item>

        {/* Password */}
        <Form.Item
          label="Password"
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password?.message}
        >
          <Input.Password placeholder="Enter your password" {...register('password')} />
        </Form.Item>

        {/* Confirm Password */}
        <Form.Item
          label="Confirm Password"
          validateStatus={errors.confirmPassword ? 'error' : ''}
          help={errors.confirmPassword?.message}
        >
          <Input.Password placeholder="Confirm your password" {...register('confirmPassword')} />
        </Form.Item>

        {/* Gender */}
        <Form.Item
          label="Gender"
          validateStatus={errors.gender ? 'error' : ''}
          help={errors.gender?.message}
        >
          <Radio.Group {...register('gender')}>
            <Radio value="MALE">Male</Radio>
            <Radio value="FEMALE">Female</Radio>
            <Radio value="OTHER">Other</Radio>
          </Radio.Group>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Registration;


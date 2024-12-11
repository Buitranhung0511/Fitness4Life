// import React from 'react';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as Yup from 'yup';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { changePassword } from '../../../services/authService';

// const ChangePassword = () => {
//     // Validation schema với Yup
//     const validationSchema = Yup.object().shape({
//         email: Yup.string()
//             .required("Email is required")
//             .email("Email should be valid"),
//         oldPassword: Yup.string()
//             .required("Old password is required"),
//         newPassword: Yup.string()
//             .required("New password is required")
//             .min(6, "New password must be at least 6 characters"),
//         confirmPassword: Yup.string()
//             .required("Confirm password is required")
//             .oneOf([Yup.ref('newPassword')], 'Passwords must match')
//     });

//     const { register, handleSubmit, reset, formState: { errors } } = useForm({
//         resolver: yupResolver(validationSchema)
//     });

//     const onSubmit = async (data) => {
//         console.log(data);
//         try {
//             let result = await changePassword(data)
//             if (result.status == 200) {
//                 toast.success("Change password successful!");
//                 reset()
//             } else {
//                 toast.error("Opp something went wrong!!");
//             }

//         } catch (error) {
//             toast.error("Opp something went wrong!!");
//         }
//     };

//     return (
//         <div className="container">
//             <h2 className="text-center">Change Password</h2>
//             <form onSubmit={handleSubmit(onSubmit)}>
//                 <div className="row">
//                     {/* Email */}
//                     <div className="col-md-6 mb-3">
//                         <label htmlFor="email" className="form-label">Email</label>
//                         <input
//                             type="email"
//                             className={`form-control ${errors.email ? 'is-invalid' : ''}`}
//                             id="email"
//                             {...register('email')}
//                             placeholder="Enter your email"
//                         />
//                         <div className="invalid-feedback">{errors.email?.message}</div>
//                     </div>

//                     {/* Old Password */}
//                     <div className="col-md-6 mb-3">
//                         <label htmlFor="oldPassword" className="form-label">Old Password</label>
//                         <input
//                             type="password"
//                             className={`form-control ${errors.oldPassword ? 'is-invalid' : ''}`}
//                             id="oldPassword"
//                             {...register('oldPassword')}
//                             placeholder="Enter your old password"
//                         />
//                         <div className="invalid-feedback">{errors.oldPassword?.message}</div>
//                     </div>
//                 </div>

//                 <div className="row">
//                     {/* New Password */}
//                     <div className="col-md-6 mb-3">
//                         <label htmlFor="newPassword" className="form-label">New Password</label>
//                         <input
//                             type="password"
//                             className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
//                             id="newPassword"
//                             {...register('newPassword')}
//                             placeholder="Enter your new password"
//                         />
//                         <div className="invalid-feedback">{errors.newPassword?.message}</div>
//                     </div>

//                     {/* Confirm Password */}
//                     <div className="col-md-6 mb-3">
//                         <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
//                         <input
//                             type="password"
//                             className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
//                             id="confirmPassword"
//                             {...register('confirmPassword')}
//                             placeholder="Confirm your new password"
//                         />
//                         <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
//                     </div>
//                 </div>

//                 {/* Submit Button */}
//                 <div className="text-center">
//                     <button type="submit" className="btn btn-primary">Change Password</button>
//                 </div>
//             </form>
//             <ToastContainer
//                 position="top-right"
//                 autoClose={5000}
//                 hideProgressBar={false}
//                 newestOnTop={false}
//                 closeOnClick
//                 rtl={false}
//                 pauseOnFocusLoss
//                 draggable
//                 pauseOnHover
//                 theme="light"
//             />
//         </div>
//     );
// };

// export default ChangePassword;


// import React from 'react';
// import { Modal, Form, Input, Button } from 'antd';
// import * as Yup from 'yup';
// import { useFormik } from 'formik';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { changePassword } from '../../../services/authService';

// const ChangePasswordModal = ({ visible, onClose, email }) => {
//     const validationSchema = Yup.object().shape({
//         oldPassword: Yup.string().required('Old password is required'),
//         newPassword: Yup.string()
//             .required('New password is required')
//             .min(6, 'New password must be at least 6 characters'),
//         confirmPassword: Yup.string()
//             .required('Confirm password is required')
//             .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
//     });

//     const formik = useFormik({
//         initialValues: {
//             email: email || '',
//             oldPassword: '',
//             newPassword: '',
//             confirmPassword: '',
//         },
//         validationSchema,
//         onSubmit: async (values, { resetForm }) => {
//             try {
//                 const result = await changePassword(values);
//                 if (result.status === 200) {
//                     toast.success('Change password successful!');
//                     resetForm();
//                     onClose();
//                 } else {
//                     toast.error('Something went wrong!');
//                 }
//             } catch (error) {
//                 toast.error('Something went wrong!');
//             }
//         },
//     });

//     return (
//         <Modal
//             title="Change Password"
//             open={visible}
//             onCancel={onClose}
//             footer={null}
//         >
//             <Form layout="vertical" onFinish={formik.handleSubmit}>
//                 <Form.Item label="Email">
//                     <Input
//                         name="email"
//                         value={formik.values.email}
//                         disabled
//                         placeholder="Email"
//                     />
//                 </Form.Item>
//                 <Form.Item
//                     label="Old Password"
//                     validateStatus={formik.errors.oldPassword && formik.touched.oldPassword ? 'error' : ''}
//                     help={formik.touched.oldPassword && formik.errors.oldPassword}
//                 >
//                     <Input.Password
//                         name="oldPassword"
//                         value={formik.values.oldPassword}
//                         onChange={formik.handleChange}
//                         placeholder="Enter old password"
//                     />
//                 </Form.Item>
//                 <Form.Item
//                     label="New Password"
//                     validateStatus={formik.errors.newPassword && formik.touched.newPassword ? 'error' : ''}
//                     help={formik.touched.newPassword && formik.errors.newPassword}
//                 >
//                     <Input.Password
//                         name="newPassword"
//                         value={formik.values.newPassword}
//                         onChange={formik.handleChange}
//                         placeholder="Enter new password"
//                     />
//                 </Form.Item>
//                 <Form.Item
//                     label="Confirm New Password"
//                     validateStatus={formik.errors.confirmPassword && formik.touched.confirmPassword ? 'error' : ''}
//                     help={formik.touched.confirmPassword && formik.errors.confirmPassword}
//                 >
//                     <Input.Password
//                         name="confirmPassword"
//                         value={formik.values.confirmPassword}
//                         onChange={formik.handleChange}
//                         placeholder="Confirm new password"
//                     />
//                 </Form.Item>
//                 <Form.Item>
//                     <Button type="primary" htmlType="submit" block>
//                         Change Password
//                     </Button>
//                 </Form.Item>
//             </Form>
//             <ToastContainer />
//         </Modal>
//     );
// };

// export default ChangePasswordModal;


import React, { useState } from 'react';
import { Modal, Form, Input, Button, notification } from 'antd';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { changePassword } from '../../../services/authService';
import { useNavigate } from 'react-router-dom'; // Dùng để chuyển hướng

const ChangePasswordModal = ({ open, onClose, email }) => {
    const navigate = useNavigate(); // Điều hướng đến trang đăng nhập
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Email must be a valid email')
            .required('Email is required'),
        oldPassword: Yup.string().required('Old password is required'),
        newPassword: Yup.string()
            .required('New password is required')
            .min(6, 'New password must be at least 6 characters'),
        confirmPassword: Yup.string()
            .required('Confirm password is required')
            .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
    });

    const formik = useFormik({
        initialValues: {
            email: email || '',
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                const result = await changePassword(values);
                if (result.status === 200) {
                    setIsSuccessModalVisible(true); // Hiển thị modal xác nhận thành công
                } else {
                    notification.error({ message: 'Something went wrong!' });
                }
            } catch (error) {
                notification.error({ message: 'Something went wrong!' });
            }
        },
    });

    const handleSuccessOk = () => {
        setIsSuccessModalVisible(false); // Ẩn modal thành công
        onClose(); // Đóng modal
        navigate('/login'); // Chuyển hướng đến trang đăng nhập
    };

    return (
        <>
            <Modal title="Change Password" open={open} onCancel={onClose} footer={null}>
                <Form layout="vertical" onFinish={formik.handleSubmit}>
                    <Form.Item
                        label="Email"
                        validateStatus={formik.errors.email && formik.touched.email ? 'error' : ''}
                        help={formik.touched.email && formik.errors.email}
                    >
                        <Input
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            placeholder="Enter your email"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Old Password"
                        validateStatus={formik.errors.oldPassword && formik.touched.oldPassword ? 'error' : ''}
                        help={formik.touched.oldPassword && formik.errors.oldPassword}
                    >
                        <Input.Password
                            name="oldPassword"
                            value={formik.values.oldPassword}
                            onChange={formik.handleChange}
                            placeholder="Enter old password"
                        />
                    </Form.Item>
                    <Form.Item
                        label="New Password"
                        validateStatus={formik.errors.newPassword && formik.touched.newPassword ? 'error' : ''}
                        help={formik.touched.newPassword && formik.errors.newPassword}
                    >
                        <Input.Password
                            name="newPassword"
                            value={formik.values.newPassword}
                            onChange={formik.handleChange}
                            placeholder="Enter new password"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Confirm New Password"
                        validateStatus={formik.errors.confirmPassword && formik.touched.confirmPassword ? 'error' : ''}
                        help={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    >
                        <Input.Password
                            name="confirmPassword"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            placeholder="Confirm new password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Change Password
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Password Changed Successfully"
                open={isSuccessModalVisible}
                onOk={handleSuccessOk}
                cancelButtonProps={{ style: { display: 'none' } }}
            >
                <p>Your password has been updated. Please log in again to continue.</p>
            </Modal>
        </>
    );
};

export default ChangePasswordModal;
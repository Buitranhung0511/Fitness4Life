import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { changePassword } from '../../../services/authService';

const ChangePassword = () => {
    // Validation schema với Yup
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .required("Email is required")
            .email("Email should be valid"),
        oldPassword: Yup.string()
            .required("Old password is required"),
        newPassword: Yup.string()
            .required("New password is required")
            .min(6, "New password must be at least 6 characters"),
        confirmPassword: Yup.string()
            .required("Confirm password is required")
            .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const onSubmit = async (data) => {
        console.log(data);
        try {
            let result = await changePassword(data)
            if (result.status == 200) {
                toast.success("Change password successful!");
                reset()
            } else {
                toast.error("Opp something went wrong!!");
            }

        } catch (error) {
            toast.error("Opp something went wrong!!");
        }
    };

    return (
        <div className="container">
            <h2 className="text-center">Change Password</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    {/* Email */}
                    <div className="col-md-6 mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            id="email"
                            {...register('email')}
                            placeholder="Enter your email"
                        />
                        <div className="invalid-feedback">{errors.email?.message}</div>
                    </div>

                    {/* Old Password */}
                    <div className="col-md-6 mb-3">
                        <label htmlFor="oldPassword" className="form-label">Old Password</label>
                        <input
                            type="password"
                            className={`form-control ${errors.oldPassword ? 'is-invalid' : ''}`}
                            id="oldPassword"
                            {...register('oldPassword')}
                            placeholder="Enter your old password"
                        />
                        <div className="invalid-feedback">{errors.oldPassword?.message}</div>
                    </div>
                </div>

                <div className="row">
                    {/* New Password */}
                    <div className="col-md-6 mb-3">
                        <label htmlFor="newPassword" className="form-label">New Password</label>
                        <input
                            type="password"
                            className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                            id="newPassword"
                            {...register('newPassword')}
                            placeholder="Enter your new password"
                        />
                        <div className="invalid-feedback">{errors.newPassword?.message}</div>
                    </div>

                    {/* Confirm Password */}
                    <div className="col-md-6 mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                        <input
                            type="password"
                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                            id="confirmPassword"
                            {...register('confirmPassword')}
                            placeholder="Confirm your new password"
                        />
                        <div className="invalid-feedback">{errors.confirmPassword?.message}</div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                    <button type="submit" className="btn btn-primary">Change Password</button>
                </div>
            </form>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default ChangePassword;

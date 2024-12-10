import React, { createContext, useState } from 'react';

export const DataContext = createContext();
let userData = localStorage.getItem("user")
export const DataProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // xác định trạng thái 
    const [user, setUser] = useState(JSON.parse(userData) || null); // lưu thông tin người dùng
    const [notificationMessage, setNotificationMessage] = useState(''); // lưu thông báo để hiển thị ui
    function handleStoreUser(data) {
        localStorage.setItem("user", JSON.stringify(data))
        setUser(data)
        setIsLoggedIn(true)
        setNotificationMessage('Login successful!'); // Đặt thông báo
    }
    function handleLogout() {
        localStorage.removeItem("user")
        setUser(null)
        setIsLoggedIn(false)
    }

    const clearNotification = () => setNotificationMessage(''); // Để reset thông báo

    let value = {
        user,
        setUser,
        isLoggedIn, setIsLoggedIn,
        handleStoreUser,
        handleLogout,
        notificationMessage,
        setNotificationMessage,
        clearNotification,
    }

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

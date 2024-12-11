// import React, { createContext, useState } from 'react';

// export const DataContext = createContext();

// let userData = localStorage.getItem("user")

// export const DataProvider = ({ children }) => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false); // xác định trạng thái 
//     const [user, setUser] = useState(JSON.parse(userData) || null); // lưu thông tin người dùng
//     const [notificationMessage, setNotificationMessage] = useState(''); // lưu thông báo để hiển thị ui

//     function handleStoreUser(data) {
//         localStorage.setItem("user", JSON.stringify(data))
//         setUser(data)
//         // console.log("user: ", user);
//         setIsLoggedIn(true)
//         setNotificationMessage('Login successful!'); // Đặt thông báo
//     }
//     function handleLogout() {
//         localStorage.removeItem("user")
//         setUser(null)
//         setIsLoggedIn(false)
//     }

//     const clearNotification = () => setNotificationMessage(''); // Để reset thông báo

//     let value = {
//         user,
//         setUser,
//         isLoggedIn, setIsLoggedIn,
//         handleStoreUser,
//         handleLogout,
//         notificationMessage,
//         setNotificationMessage,
//         clearNotification,
//     }

//     return (
//         <DataContext.Provider value={value}>
//             {children}
//         </DataContext.Provider>
//     );
// };

import React, { createContext, useState, useEffect } from 'react';

export const DataContext = createContext();

let userData = localStorage.getItem("user");

export const DataProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!userData); // Khởi tạo từ localStorage
    const [user, setUser] = useState(JSON.parse(userData) || null); // Lưu thông tin người dùng
    const [notificationMessage, setNotificationMessage] = useState(''); // Lưu thông báo để hiển thị UI

    useEffect(() => {
        // Kiểm tra trạng thái user mỗi khi component được render
        if (localStorage.getItem("user")) {
            setIsLoggedIn(true);
        }
    }, []);

    function handleStoreUser(data) {
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        console.log("user: ", user);
        setIsLoggedIn(true);
        setNotificationMessage('Login successful!'); // Đặt thông báo
    }

    function handleLogout() {
        localStorage.removeItem("user");
        setUser(null);
        setIsLoggedIn(false);
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
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};


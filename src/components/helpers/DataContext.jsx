import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios'; // Make sure to import axios

export const DataContext = createContext();

// Helper functions for token handling
const getToken = () => {
    const tokenData = localStorage.getItem("tokenData");
    if (!tokenData) return null;
    try {
        const { access_token } = JSON.parse(tokenData);
        return access_token;
    } catch (error) {
        console.error("Token parsing error:", error);
        return null;
    }
};

const createAuthConfig = () => {
    const token = getToken();
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

export const DataProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());
    const [user, setUser] = useState(null);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Hàm gán giá trị mặc định cho profileDTO nếu null
    const ensureProfileDTO = (user) => {
        if (!user || !user.profileDTO) {
            return {
                ...user,
                profileDTO: {
                    hobbies: null,
                    address: null,
                    age: null,
                    heightValue: null,
                    description: null,
                    maritalStatus: null,
                    avatar: null,
                },
            };
        }
        return user;
    };

    // Fetch user data from API using token
    const fetchUserData = async () => {
        try {
            const token = getToken();
            if (!token) {
                setIsLoading(false);
                return;
            }

            const response = await axios.get('/api/user/profile', createAuthConfig());
            const userData = ensureProfileDTO(response.data);
            setUser(userData);
            setIsLoggedIn(true);
        } catch (error) {
            console.error("Error fetching user data:", error);
            handleLogout();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    function handleStoreUser(tokenData) {
        try {
            // Store token
            localStorage.setItem("tokenData", JSON.stringify(tokenData));
            // Fetch user data using the new token
            fetchUserData();
            setNotificationMessage('Login successful!');
        } catch (error) {
            console.error("Error storing user data:", error);
            setNotificationMessage('Login failed. Please try again.');
        }
    }

    function handleLogout() {
        localStorage.removeItem("tokenData");
        setUser(null);
        setIsLoggedIn(false);
        setNotificationMessage('Logged out successfully!');
    }

    const clearNotification = () => setNotificationMessage('');

    // Refresh user data function
    const refreshUserData = () => {
        fetchUserData();
    };

    let value = {
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        handleStoreUser,
        handleLogout,
        notificationMessage,
        setNotificationMessage,
        clearNotification,
        refreshUserData,
        isLoading
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
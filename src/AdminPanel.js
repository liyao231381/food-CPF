// AdminPanel.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './AdminPanel.css';
import FoodDataEditor from './FoodDataEditor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css';

function AdminPanel() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const storedPassword = localStorage.getItem('adminPassword');
        if (storedPassword === process.env.REACT_APP_ADMIN_PASSWORD) {
            setIsLoggedIn(true);
        }
    }, []);

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleLogin = () => {
        if (password === process.env.REACT_APP_ADMIN_PASSWORD) {
            setIsLoggedIn(true);
            localStorage.setItem('adminPassword', password);
            navigate('/admin');
        } else {
            alert('密码错误！');
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('adminPassword');
        navigate('/admin');
    };

    if (!isLoggedIn) {
        return (
            <div className="admin-panel">
                <header className="admin-header">
                <Link to="/" className="home-button">
                    <FontAwesomeIcon icon={faArrowLeft} />
                    </Link>
                    <h1>管理面板登录</h1>
                </header>
                <main className="admin-main">
                    <p>请输入管理员密码：</p>
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        onKeyDown={handleKeyDown}
                    />
                    <button onClick={handleLogin}>登录</button>
                </main>
                <footer className="admin-footer">
                    <p>&copy; 2024 您的应用程序</p>
                </footer>
            </div>
        );
    }

    return (
        <div className="admin-panel">
            <header className="admin-header">
                <div className="header-container">
                    <Link to="/" className="home-button">
                    <FontAwesomeIcon icon={faArrowLeft} />
                    </Link>
                    <h1 className="header-title">管理面板</h1>
                    <button onClick={handleLogout} className="logout-button">
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    </button>
                </div>
            </header>
            <div className="content-container">
                <Tabs>
                    <TabList>
                        <Tab>食材数据管理</Tab>
                        <Tab>消息管理</Tab>
                        <Tab>用户管理</Tab>
                    </TabList>

                    <TabPanel>
                        <FoodDataEditor />
                    </TabPanel>
                    <TabPanel>
                        <p>消息管理内容</p>
                    </TabPanel>
                    <TabPanel>
                        <p>用户管理内容</p>
                    </TabPanel>
                </Tabs>
            </div>
            <footer className="admin-footer">
                <p>&copy; 2025 @李瑶瑶种太阳 独立开发</p>
            </footer>
        </div>
    );
}

export default AdminPanel;

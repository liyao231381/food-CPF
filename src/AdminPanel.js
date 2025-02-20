// AdminPanel.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // 引入 Link
import './AdminPanel.css'; // 引入管理面板的独立样式文件

function AdminPanel() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // 检查是否已登录
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
            // 保存密码到 localStorage
            localStorage.setItem('adminPassword', password);
        } else {
            alert('密码错误！');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        // 清除 localStorage 中的密码
        localStorage.removeItem('adminPassword');
        navigate('/admin'); // 跳转到登录页面
    };

    if (!isLoggedIn) {
        return (
            <div className="admin-panel">
                <header className="admin-header">
                    <h1>管理面板登录</h1>
                </header>
                <main className="admin-main">
                    <p>请输入管理员密码：</p>
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
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
                {/* 使用 flex 布局，两端对齐 */}
                <div className="header-container">
                    {/* 返回主页按钮 */}
                    <Link to="/" className="home-button">
                        返回主页
                    </Link>
                    <h1>欢迎来到管理面板</h1>
                    {/* 退出登录按钮 */}
                    <button onClick={handleLogout} className="logout-button">
                        退出登录
                    </button>
                </div>
            </header>
            <main className="admin-main">
                <p>在这里，您可以管理和维护您的应用程序。</p>
                {/* 在这里添加管理面板的具体内容 */}
            </main>
            <footer className="admin-footer">
                <p>&copy; 2024 您的应用程序</p>
            </footer>
        </div>
    );
}

export default AdminPanel;

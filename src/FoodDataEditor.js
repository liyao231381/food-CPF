// FoodDataEditor.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import foodData from './foodData';
import './FoodDataEditor.css';

const FoodDataEditor = () => {
    const [password, setPassword] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [newFood, setNewFood] = useState({
        foodname: '',
        carbon: '',
        protein: '',
        fat: '',
        foodType: 'carbon' // 新增：食材类型
    });
    const navigate = useNavigate();

    useEffect(() => {
        // 检查是否已经授权
        const storedAuth = localStorage.getItem('isAuthorized');
        if (storedAuth === 'true') {
            setIsAuthorized(true);
        }
    }, []);

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        const correctPassword = process.env.REACT_APP_ADMIN_PASSWORD; // 从环境变量获取密码

        if (password === correctPassword) {
            setIsAuthorized(true);
            localStorage.setItem('isAuthorized', 'true'); // 存储授权状态
        } else {
            alert('密码错误!');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFood(prevFood => ({
            ...prevFood,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // 验证数据是否完整
        if (!newFood.foodname || !newFood.carbon || !newFood.protein || !newFood.fat) {
            alert('请填写所有字段!');
            return;
        }

        // 转换为数字
        const carbon = parseFloat(newFood.carbon);
        const protein = parseFloat(newFood.protein);
        const fat = parseFloat(newFood.fat);

        if (isNaN(carbon) || isNaN(protein) || isNaN(fat)) {
            alert('碳水、蛋白质和脂肪含量必须是数字!');
            return;
        }

        // 创建新的食物条目
        const newFoodItem = {
            foodname: newFood.foodname,
            carbon: carbon,
            protein: protein,
            fat: fat
        };

        // 根据选择的食材类型，将新条目添加到 foodData 对应的数组中
        switch (newFood.foodType) {
            case 'carbon':
                foodData.carbon.push(newFoodItem);
                break;
            case 'protein':
                foodData.protein.push(newFoodItem);
                break;
            case 'fat':
                foodData.fat.push(newFoodItem);
                break;
            default:
                alert('无效的食材类型!');
                return;
        }

        // 清空表单
        setNewFood({
            foodname: '',
            carbon: '',
            protein: '',
            fat: '',
            foodType: 'carbon'
        });

        alert('数据已成功添加!');
        console.log('Updated foodData:', foodData); // 打印更新后的 foodData (用于调试)
    };

    const handleGoBack = () => {
        navigate('/');
    };

    if (!isAuthorized) {
        return (
            <div className="food-data-editor-container">
                <h2>需要管理员权限</h2>
                <form onSubmit={handlePasswordSubmit} className="password-form">
                    <label htmlFor="password">密码:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">登录</button>
                </form>
            </div>
        );
    }

    return (
        <div className="food-data-editor-container">
            <button className="go-back-button" onClick={handleGoBack}>
                返回主页
            </button>
            <h2>添加新食材</h2>
            <form onSubmit={handleSubmit} className="food-form">
                {/* 新增：食材类型选择器 */}
                <label htmlFor="foodType">食材类型:</label>
                <select
                    id="foodType"
                    name="foodType"
                    value={newFood.foodType}
                    onChange={handleInputChange}
                >
                    <option value="carbon">碳水来源</option>
                    <option value="protein">蛋白质来源</option>
                    <option value="fat">脂肪来源</option>
                </select>

                <label htmlFor="foodname">食材名称:</label>
                <input
                    type="text"
                    id="foodname"
                    name="foodname"
                    value={newFood.foodname}
                    onChange={handleInputChange}
                />

                <label htmlFor="carbon">碳水含量:</label>
                <input
                    type="number"
                    id="carbon"
                    name="carbon"
                    value={newFood.carbon}
                    onChange={handleInputChange}
                />

                <label htmlFor="protein">蛋白质含量:</label>
                <input
                    type="number"
                    id="protein"
                    name="protein"
                    value={newFood.protein}
                    onChange={handleInputChange}
                />

                <label htmlFor="fat">脂肪含量:</label>
                <input
                    type="number"
                    id="fat"
                    name="fat"
                    value={newFood.fat}
                    onChange={handleInputChange}
                />

                <button type="submit">添加食材</button>
            </form>
        </div>
    );
};

export default FoodDataEditor;

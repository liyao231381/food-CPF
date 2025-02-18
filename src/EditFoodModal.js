// EditFoodModal.js
import React, { useState, useEffect } from 'react';
import './EditFoodModal.css';

const EditFoodModal = ({ isOpen, onClose, selectedFood }) => {
    const [password, setPassword] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [foodData, setFoodData] = useState({
        foodname: '',
        type: '碳水来源',
        carbon: '',
        protein: '',
        fat: ''
    });

    useEffect(() => {
        // 当 selectedFood 改变时，更新 foodData 的状态
        if (selectedFood) {
            setFoodData({
                foodname: selectedFood.foodname || '',
                type: selectedFood.type || '碳水来源',
                carbon: selectedFood.carbon || '',
                protein: selectedFood.protein || '',
                fat: selectedFood.fat || ''
            });
        }
    }, [selectedFood]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFoodData(prevFood => ({
            ...prevFood,
            [name]: value
        }));
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        const correctPassword = process.env.REACT_APP_ADMIN_PASSWORD; // 从环境变量获取密码

        if (password === correctPassword) {
            setIsAuthorized(true);
        } else {
            alert('密码错误!');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAuthorized) {
            alert('需要管理员权限!');
            return;
        }

        // 验证数据是否完整
        if (!foodData.foodname || !foodData.carbon || !foodData.protein || !foodData.fat) {
            alert('请填写所有字段!');
            return;
        }

        // 转换为数字
        const carbon = parseFloat(foodData.carbon);
        const protein = parseFloat(foodData.protein);
        const fat = parseFloat(foodData.fat);

        if (isNaN(carbon) || isNaN(protein) || isNaN(fat)) {
            alert('碳水、蛋白质和脂肪含量必须是数字!');
            return;
        }

        try {
            const response = await fetch('/api/editFood', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(foodData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.error === '请检查名称') {
                    alert('请检查名称');
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return;
            }

            alert('食材已成功修改!');
            onClose(); // 关闭模态框
        } catch (error) {
            console.error("Could not edit food:", error);
            alert('修改食材时出错!');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>修改食材</h2>

                {!isAuthorized && (
                    <form onSubmit={handlePasswordSubmit} className="password-form">
                        <label htmlFor="password">管理员密码:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit">验证</button>
                    </form>
                )}

                {isAuthorized && (
                    <form onSubmit={handleSubmit} className="food-form">
                        <label htmlFor="foodname">食材名称:</label>
                        <input
                            type="text"
                            id="foodname"
                            name="foodname"
                            value={foodData.foodname}
                            onChange={handleInputChange}
                        />

                        <label htmlFor="type">食材类型:</label>
                        <select
                            id="type"
                            name="type"
                            value={foodData.type}
                            onChange={handleInputChange}
                        >
                            <option>碳水来源</option>
                            <option>蛋白质来源</option>
                            <option>脂肪来源</option>
                        </select>

                        <label htmlFor="carbon">碳水含量:</label>
                        <input
                            type="number"
                            id="carbon"
                            name="carbon"
                            value={foodData.carbon}
                            onChange={handleInputChange}
                        />

                        <label htmlFor="protein">蛋白质含量:</label>
                        <input
                            type="number"
                            id="protein"
                            name="protein"
                            value={foodData.protein}
                            onChange={handleInputChange}
                        />

                        <label htmlFor="fat">脂肪含量:</label>
                        <input
                            type="number"
                            id="fat"
                            name="fat"
                            value={foodData.fat}
                            onChange={handleInputChange}
                        />

                        <div className="buttons">
                            <button type="submit">修改</button>
                            <button type="button" onClick={onClose}>取消</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EditFoodModal;

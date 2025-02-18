// AddFoodModal.js
import React, { useState } from 'react';
import './AddFoodModal.css';

const AddFoodModal = ({ isOpen, onClose }) => {
    const [newFood, setNewFood] = useState({
        foodname: '',
        type: '碳水来源',
        carbon: '',
        protein: '',
        fat: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFood(prevFood => ({
            ...prevFood,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
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

        try {
            const response = await fetch('/api/addFood', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newFood)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            alert('食材已成功添加!');
            onClose(); // 关闭模态框
        } catch (error) {
            console.error("Could not add food:", error);
            alert('添加食材时出错!');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>添加新食材</h2>
                <form onSubmit={handleSubmit} className="food-form">
                    <label htmlFor="foodname">食材名称:</label>
                    <input
                        type="text"
                        id="foodname"
                        name="foodname"
                        value={newFood.foodname}
                        onChange={handleInputChange}
                    />

                    <label htmlFor="type">食材类型:</label>
                    <select
                        id="type"
                        name="type"
                        value={newFood.type}
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

                    <div className="buttons">
                        <button type="submit">添加</button>
                        <button type="button" onClick={onClose}>取消</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddFoodModal;

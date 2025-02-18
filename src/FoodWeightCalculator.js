// FoodWeightCalculator.js
import React, { useState, useEffect } from 'react';
import './FoodWeightCalculator.css';
import AddFoodModal from './AddFoodModal';
import EditFoodModal from './EditFoodModal';

const FoodWeightCalculator = () => {
    const [nutrientAmount, setNutrientAmount] = useState(50);
    const [foodType, setFoodType] = useState('carbon');
    const [results, setResults] = useState([]);
    const [foodData, setFoodData] = useState({ carbon: [], protein: [], fat: [] });
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // 添加加载状态

    useEffect(() => {
        const fetchFoodData = async () => {
            setIsLoading(true); // 开始加载时设置状态为 true
            try {
                const response = await fetch('/api/foodData');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                const groupedData = {
                    carbon: data.filter(item => item.type === '碳水来源'),
                    protein: data.filter(item => item.type === '蛋白质来源'),
                    fat: data.filter(item => item.type === '脂肪来源')
                };

                setFoodData(groupedData);
            } catch (error) {
                console.error("Could not fetch food data:", error);
                // 可以在这里设置一个错误状态，并在界面上显示错误信息
            } finally {
                setIsLoading(false); // 无论成功与否，加载完成后都设置为 false
            }
        };

        fetchFoodData();
    }, []); // 移除 isAddModalOpen 和 isEditModalOpen 依赖项

    const calculateWeight = () => {
        setIsLoading(true);
        try {
            const selectedFoodList = foodData[foodType];
            if (!selectedFoodList) {
                setResults([{ foodname: '', weight: '未找到该类型的食物数据。' }]);
                return;
            }

            if (isNaN(nutrientAmount)) {
                setResults([{ foodname: '', weight: '请输入有效的营养素需求量。' }]);
                return;
            }

            const newResults = selectedFoodList.map(food => {
                let nutrientContent;
                switch (foodType) {
                    case "carbon":
                        nutrientContent = food.carbon;
                        break;
                    case "protein":
                        nutrientContent = food.protein;
                        break;
                    case "fat":
                        nutrientContent = food.fat;
                        break;
                    default:
                        nutrientContent = 0;
                }

                let weight = '无法提供';
                if (nutrientContent > 0) {
                    weight = ((nutrientAmount / nutrientContent) * 100).toFixed(2);
                }

                return { foodname: food.foodname, weight: weight };
            });

            setResults(newResults);
        } catch (error) {
            console.error("计算重量失败:", error);
            setResults([{ foodname: '', weight: '计算重量时出错。' }]); // 设置错误信息
        } finally {
            setIsLoading(false); // 确保在计算完成后停止加载
        }
    };

    const handleOpenAddModal = () => {
        setIsAddModalOpen(true);
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
    };

    const handleOpenEditModal = (food) => {
        setSelectedFood(food);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setSelectedFood(null);
        setIsEditModalOpen(false);
    };

    return (
        <div className="food-weight-calculator-container">
            <h2>食材重量计算器</h2>
            <div className="input-all">
                <div className="input-area">
                    <label htmlFor="foodType">选择食材类型:</label>
                    <select id="foodType" value={foodType} onChange={e => setFoodType(e.target.value)}>
                        <option value="carbon">碳水来源</option>
                        <option value="protein">蛋白质来源</option>
                        <option value="fat">脂肪来源</option>
                    </select>
                </div>

                <div className="input-area">
                    <label htmlFor="nutrientAmount">请输入营养素需求量 (克):</label>
                    <input
                        type="number"
                        id="nutrientAmount"
                        placeholder="例如: 50"
                        value={nutrientAmount}
                        onChange={e => setNutrientAmount(parseFloat(e.target.value))}
                    />
                </div>
            </div>

            <div className="button-row">
                <button className="calculate-button" onClick={calculateWeight} disabled={isLoading}>
                    {isLoading ? '查询中...' : '查询'}
                </button>
                <div className="right-buttons">
                    <button className="add-food-button small-button" onClick={handleOpenAddModal}>添加食材</button>
                    <button
                        className="edit-food-button small-button"
                        onClick={() =>
                            results.length > 0 ? handleOpenEditModal(results[0]) : alert("请先查询结果")
                        }
                        disabled={isLoading}
                    >
                        修改食材
                    </button>
                </div>
            </div>

            <h3>计算结果</h3>
            {isLoading ? (
                <p>加载中...</p>
            ) : (
                <table className="result-table">
                    <thead>
                        <tr>
                            <th>食材名称</th>
                            <th>所需重量 (克)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result, index) => (
                            <tr key={index} onClick={() => handleOpenEditModal(result)}>
                                <td>{result.foodname}</td>
                                <td>{result.weight}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <AddFoodModal isOpen={isAddModalOpen} onClose={handleCloseAddModal} />
            <EditFoodModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} selectedFood={selectedFood} />
        </div>
    );
};

export default FoodWeightCalculator;

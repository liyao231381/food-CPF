// FoodWeightCalculator.js
import React, { useState, useContext, useCallback, useEffect } from 'react';
import './FoodWeightCalculator.css';
import EditFoodModal from './EditFoodModal';
import { FoodDataContext } from './App'; // 引入 FoodDataContext

const FoodWeightCalculator = () => {
    const foodData = useContext(FoodDataContext); // 使用 useContext 获取 foodData
    const [nutrientAmount, setNutrientAmount] = useState(50);
    const [foodType, setFoodType] = useState('carbon');
    const [results, setResults] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // 使用 useCallback 避免在每次渲染时都创建新的函数实例
    const calculateWeight = useCallback(() => {
        setIsLoading(true);
        const selectedFoodList = foodData ? foodData.filter(item => item.type === getFoodTypeName(foodType)) : [];
        if (!selectedFoodList || isNaN(nutrientAmount)) {
            setResults([{ foodname: '', weight: '输入有误或数据不足。' }]);
            setIsLoading(false);
            return;
        }

        const newResults = selectedFoodList.map(food => {
            const nutrientContent = food[foodType] || 0;
            const weight = nutrientContent > 0 ? ((nutrientAmount / nutrientContent) * 100).toFixed(2) : '无法提供';
            return { foodname: food.foodname, weight };
        });

        setResults(newResults);
        setIsLoading(false);
    }, [foodData, foodType, nutrientAmount]);

    const getFoodTypeName = (type) => {
        switch (type) {
            case 'carbon':
                return '碳水来源';
            case 'protein':
                return '蛋白质来源';
            case 'fat':
                return '脂肪来源';
            default:
                return '';
        }
    };

    const handleOpenEditModal = (food) => {
        setSelectedFood(food);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setSelectedFood(null);
        setIsEditModalOpen(false);
    };

    // 使用 useEffect 监听 nutrientAmount 的变化，并在变化时触发 calculateWeight
    useEffect(() => {
        calculateWeight();
    }, [calculateWeight]);

    return (
        <>
            <div className="input-all">
                <div className="input-area">
                    <label htmlFor="foodType">选择食材类型:</label>
                    <select id="foodType" value={foodType} onChange={e => {setFoodType(e.target.value); calculateWeight()}}>
                        <option value="carbon">主食/碳水</option>
                        <option value="protein">蛋白质</option>
                        <option value="fat">脂肪</option>
                    </select>
                </div>

                <div className="input-area">
                    <label htmlFor="nutrientAmount">请输入营养素需求量 (g):</label>
                    <input
                        type="number"
                        id="nutrientAmount"
                        placeholder="例如: 50"
                        value={nutrientAmount}
                        onChange={e => setNutrientAmount(parseFloat(e.target.value))}
                    />
                </div>
            </div>

            {isLoading ? (
                <p>加载中...</p>
            ) : (
                <table className="result-table">
                    <thead>
                        <tr>
                            <th>食材</th>
                            <th>所需重量 (g)</th>
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

            <EditFoodModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} selectedFood={selectedFood} />
        </>
    );
};

export default FoodWeightCalculator;

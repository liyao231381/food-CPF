// FoodWeightCalculator.js
import React, { useState, useContext, useCallback, useEffect, useRef } from 'react';
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
    const [sortColumn, setSortColumn] = useState(null); // 新增：排序的列
    const [sortOrder, setSortOrder] = useState('asc'); // 新增：排序顺序，'asc' 升序, 'desc' 降序
    const defaultResultsRef = useRef([]); // 新增：存储默认排序的结果

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

        // 初次计算结果时，保存默认排序的结果
        if (defaultResultsRef.current.length === 0) {
            defaultResultsRef.current = [...newResults]; // 浅拷贝一份
        }
        setResults(newResults);
        setIsLoading(false);
        setSortColumn(null); // 重置排序状态为默认
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

    // 食材名称排序
    const handleSortByFoodname = () => {
        setSortColumn('foodname');
        setSortOrder('asc'); // 默认点击食材名称为升序
        setResults([...defaultResultsRef.current]); // 恢复到默认排序
    };

    // 所需重量排序
    const handleSortByWeight = () => {
        const newSortOrder = sortColumn === 'weight' && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortColumn('weight');
        setSortOrder(newSortOrder);

        const sortedResults = [...results].sort((a, b) => {
            const weightA = a.weight === '无法提供' ? Infinity : parseFloat(a.weight); // '无法提供' 视为最大值
            const weightB = b.weight === '无法提供' ? Infinity : parseFloat(b.weight);
            if (newSortOrder === 'asc') {
                return weightA - weightB;
            } else {
                return weightB - weightA;
            }
        });
        setResults(sortedResults);
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
            <p className="table-description">点击表头可以<strong style={{ color: 'orange' }}>切换排序方式</strong>，所需重量越大越适合减脂（饱腹感），所需重量越小越适合增肌（饿得快）</p>
            {isLoading ? (
                <p>加载中...</p>
            ) : (
                <table className="result-table">
                    <thead>
                        <tr>
                            <th onClick={handleSortByFoodname} style={{ cursor: 'pointer' }}>食材</th> {/* 添加点击事件 */}
                            <th onClick={handleSortByWeight} style={{ cursor: 'pointer' }}>所需重量 (g)</th> {/* 添加点击事件 */}
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

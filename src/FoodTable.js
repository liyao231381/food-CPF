// FoodTable.js
import React, { useState, useContext, useMemo, useCallback } from 'react';
import './FoodTable.css';
import { FoodDataContext } from './App'; // 引入 FoodDataContext

function FoodTable() {
    const foodData = useContext(FoodDataContext); // 使用 useContext 获取 foodData
    // const [foodList, setFoodList] = useState([]); // 移除本地的 foodList 状态
    // const [isLoading, setIsLoading] = useState(false); // 移除 isLoading 状态
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [activeTab, setActiveTab] = useState('carbon'); // 默认显示碳水

    // // 使用 useCallback 包裹 fetchFoodData  // 移除 fetchFoodData 和 useEffect
    // const fetchFoodData = useCallback(async () => { ... }, []);
    // useEffect(() => {
    //     fetchFoodData();
    // }, [fetchFoodData]);

    const calculateCalories = useCallback((food) => {
        const carbonCalories = (food.carbon || 0) * 4;
        const proteinCalories = (food.protein || 0) * 4;
        const fatCalories = (food.fat || 0) * 9;
        const totalCalories = carbonCalories + proteinCalories + fatCalories;
        return parseFloat(totalCalories.toFixed(1)); // 保留一位小数, 并转换为 Number 类型
    }, []);

    const getFilteredList = useCallback((type) => {
        if (!foodData) return []; // 确保 foodData 存在
        return foodData.filter(item => {
            if (type === 'carbon') return item.type === '碳水来源';
            if (type === 'protein') return item.type === '蛋白质来源';
            if (type === 'fat') return item.type === '脂肪来源';
            return false;
        });
    }, [foodData]); // 使用 useCallback，依赖 foodData

    const sortedList = useMemo(() => {
        const filteredList = getFilteredList(activeTab);
        if (sortConfig !== null) {
            return [...filteredList].sort((a, b) => {
                let valueA, valueB;
                if (sortConfig.key === 'foodname') {
                    valueA = a.foodname.toUpperCase();
                    valueB = b.foodname.toUpperCase();
                } else if (sortConfig.key === 'calories') {
                    valueA = calculateCalories(a);
                    valueB = calculateCalories(b);
                }
                else {
                    valueA = parseFloat(a[sortConfig.key] || 0);
                    valueB = parseFloat(b[sortConfig.key] || 0);
                }


                if (valueA < valueB) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (valueA > valueB) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return filteredList;
    }, [sortConfig, activeTab, getFilteredList, calculateCalories]); // 移除 foodData

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const resetSort = () => {
        setSortConfig({ key: null, direction: 'ascending' });
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        resetSort(); // 切换标签时重置排序
    };

    return (
        <div>
            <div className="tab-buttons">
                <button
                    className={`tab-button ${activeTab === 'carbon' ? 'active' : ''}`}
                    onClick={() => handleTabClick('carbon')}
                >
                    主食/碳水
                </button>
                <button
                    className={`tab-button ${activeTab === 'protein' ? 'active' : ''}`}
                    onClick={() => handleTabClick('protein')}
                >
                    蛋白质
                </button>
                <button
                    className={`tab-button ${activeTab === 'fat' ? 'active' : ''}`}
                    onClick={() => handleTabClick('fat')}
                >
                    脂肪
                </button>
            </div>
            <p className="table-description">所有数值为100g该食材的元素含量，点击表头可以切换排序方式</p>
            {/* 将 isLoading 判断移除，因为数据从 context 获取 */}
            {/* {isLoading ? (
                <p>加载中...</p>
            ) : ( */}
            <table className="food-table">
                <thead>
                    <tr className="header-row">
                        <th>
                            <button type="button" onClick={resetSort}>
                                食材
                            </button>
                        </th>
                        <th>
                            <button type="button" onClick={() => requestSort('carbon')}>
                                碳水
                            </button>
                        </th>
                        <th>
                            <button type="button" onClick={() => requestSort('protein')}>
                                蛋白质
                            </button>
                        </th>
                        <th>
                            <button type="button" onClick={() => requestSort('fat')}>
                                脂肪
                            </button>
                        </th>
                        <th>
                            <button type="button" onClick={() => requestSort('calories')}>
                                热量/kcal
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedList.map((food) => (
                        <tr key={food.id}>
                            <td>{food.foodname}</td>
                            <td>{food.carbon}</td>
                            <td>{food.protein}</td>
                            <td>{food.fat}</td>
                            <td>{calculateCalories(food)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* )} */}
        </div>
    );
}

export default FoodTable;

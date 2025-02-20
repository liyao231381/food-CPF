// FoodTable.js
import React, { useState, useContext, useMemo, useCallback, useEffect } from 'react';
import './FoodTable.css';
import { FoodDataContext } from './App'; // 引入 FoodDataContext

function FoodTable() {
    const foodData = useContext(FoodDataContext); // 使用 useContext 获取 foodData
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [activeTab, setActiveTab] = useState('carbon'); // 默认显示碳水
    const [searchTerm, setSearchTerm] = useState(''); // 新增：搜索关键词状态

    const calculateCalories = useCallback((food) => {
        const carbonCalories = (food.carbon || 0) * 4;
        const proteinCalories = (food.protein || 0) * 4;
        const fatCalories = (food.fat || 0) * 9;
        const totalCalories = carbonCalories + proteinCalories + fatCalories;
        return parseFloat(totalCalories.toFixed(1)); // 保留一位小数, 并转换为 Number 类型
    }, []);

    // 修改：不再根据 activeTab 过滤，而是搜索所有食材
    const searchedList = useMemo(() => {
        if (!foodData) return [];

        const filteredList = foodData.filter(food =>
            food.foodname.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return filteredList;
    }, [foodData, searchTerm]);

    // 修改：根据搜索结果自动切换标签
    useEffect(() => {
        if (searchedList.length > 0) {
            const types = [...new Set(searchedList.map(food => food.type))]; // 获取所有类型

            if (types.includes('碳水来源')) {
                setActiveTab('carbon');
            } else if (types.includes('蛋白质来源')) {
                setActiveTab('protein');
            } else {
                setActiveTab('fat');
            }
        }
    }, [searchedList]);

    const sortedList = useMemo(() => {
        // 获取当前激活标签对应的食材类型
        let currentType;
        if (activeTab === 'carbon') currentType = '碳水来源';
        else if (activeTab === 'protein') currentType = '蛋白质来源';
        else currentType = '脂肪来源';

        // 过滤搜索结果，只显示当前激活标签对应的食材类型
        const typeFilteredList = searchedList.filter(food => food.type === currentType);

        if (sortConfig !== null) {
            return [...typeFilteredList].sort((a, b) => {
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
        return typeFilteredList;
    }, [sortConfig, activeTab, searchedList, calculateCalories]);

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

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    return (
        <div>
            {/* 新增：搜索框 */}
            <div className="food-search-input-wrapper">
                <input
                    type="text"
                    placeholder="搜索食材名称"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="food-search-input"
                />
                {searchTerm && (
                    <button className="food-search-clear" onClick={handleClearSearch}>
                        <svg viewBox="0 0 24 24" fill="currentColor" height="1rem" width="1rem">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                        </svg>
                    </button>
                )}
            </div>
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
            <p className="table-description">所有数值为100g该食材的元素含量(g)，点击表头可以<strong style={{ color: 'orange' }}>切换排序方式</strong></p>
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

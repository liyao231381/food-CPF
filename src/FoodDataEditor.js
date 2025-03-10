import React, { useState, useMemo, useCallback, useEffect } from 'react';
import * as XLSX from 'xlsx'; // 引入 xlsx
import { pinyin } from 'pinyin-pro'; // 引入 pinyin-pro
import './FoodTable.css';
import './FoodDataEditor.css';

function FoodDataEditor() {
    const [foodData, setFoodData] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // 用于显示加载状态
    const [error, setError] = useState(null);       // 用于显示错误信息
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [activeTab, setActiveTab] = useState('carbon');
    const [searchTerm, setSearchTerm] = useState('');

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);
    const [editFormData, setEditFormData] = useState({
        foodname: '',
        type: '碳水来源',
        carbon: '',
        protein: '',
        fat: '',
    });
    const [addFormData, setAddFormData] = useState({
        foodname: '',
        type: '碳水来源',
        carbon: '',
        protein: '',
        fat: '',
    });

    const [loading, setLoading] = useState(false);

    const searchedList = useMemo(() => {
        if (!foodData) return [];

        const filteredList = foodData.filter(food =>
            food.foodname.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return filteredList;
    }, [foodData, searchTerm]);

    useEffect(() => {
        if (searchedList.length > 0) {
            const types = [...new Set(searchedList.map(food => food.type))];

            if (types.includes('碳水来源')) {
                setActiveTab('carbon');
            } else if (types.includes('蛋白质来源')) {
                setActiveTab('protein');
            } else {
                setActiveTab('fat');
            }
        }
    }, [searchedList]);

    useEffect(() => {
        const fetchFoodData = async () => {
            setIsLoading(true); // 开始加载时设置为 true
            setError(null);     // 清空之前的错误信息
            try {
                const response = await fetch('/api/foodData');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setFoodData(data);
            } catch (error) {
                setError(error); // 发生错误时设置错误信息
            } finally {
                setIsLoading(false); // 加载完成后设置为 false
            }
        };

        fetchFoodData();
    }, []);

    const sortedList = useMemo(() => {
        let currentType;
        if (activeTab === 'carbon') currentType = '碳水来源';
        else if (activeTab === 'protein') currentType = '蛋白质来源';
        else currentType = '脂肪来源';

        const typeFilteredList = searchedList.filter(food => food.type === currentType);

        if (sortConfig !== null) {
            return [...typeFilteredList].sort((a, b) => {
                let valueA, valueB;
                if (sortConfig.key === 'foodname') {
                    const pinYinA = pinyin(a.foodname, { toneType: 'none', type: 'first' });
                    const pinYinB = pinyin(b.foodname, { toneType: 'none', type: 'first' });
                    valueA = pinYinA[0].toUpperCase(); // 获取首个汉字的拼音首字母
                    valueB = pinYinB[0].toUpperCase(); // 获取首个汉字的拼音首字母
                } else {
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
    }, [sortConfig, activeTab, searchedList]);

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
        resetSort();
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const handleOpenEditModal = (food) => {
        setSelectedFood(food);
        setEditFormData({
            foodname: food.foodname,
            type: food.type,
            carbon: food.carbon,
            protein: food.protein,
            fat: food.fat,
        });
        forceUpdate();
        setEditModalOpen(true);
    };

    const handleCloseEditModal = useCallback(() => {
        setEditModalOpen(false);
        setSelectedFood(null);
    }, []);

    const handleOpenDeleteModal = (food) => {
        setSelectedFood(food);
        setDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = useCallback(() => {
        setDeleteModalOpen(false);
        setSelectedFood(null);
    }, []);

    const handleOpenAddModal = () => {
        setAddModalOpen(true);
    };

    const handleCloseAddModal = useCallback(() => {
        setAddModalOpen(false);
        setAddFormData({
            foodname: '',
            type: '碳水来源',
            carbon: '',
            protein: '',
            fat: '',
        });
    }, []);

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value,
        });
    };

    const handleAddFormChange = (e) => {
        const { name, value } = e.target;
        setAddFormData({
            ...addFormData,
            [name]: value,
        });
    };

    const handleUpdateFood = async () => {
        if (!selectedFood) {
            console.error('selectedFood 为空');
            return;
        }

        setLoading(true);
        setError(null); // 清空之前的错误信息

        try {
            const response = await fetch('/api/editFood', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editFormData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.message === '食材已成功修改!') {
                const fetchFoodData = async () => {
                    setIsLoading(true);
                    setError(null); // 清空之前的错误信息
                    try {
                        const response = await fetch('/api/foodData');
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        const newData = await response.json();
                        setFoodData(newData);
                    } catch (error) {
                        setError(error);
                    } finally {
                        setIsLoading(false);
                    }
                };
                fetchFoodData();
                handleCloseEditModal();
            }
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFood = async () => {
        if (!selectedFood || !selectedFood.foodname || !selectedFood.id) {
            console.error('selectedFood 或 selectedFood.foodname 或 selectedFood.id 为空');
            return;
        }

        setLoading(true);
        setError(null); // 清空之前的错误信息

        try {
            const response = await fetch('/api/deleteFood', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    foodname: selectedFood.foodname,
                    id: selectedFood.id
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.message === '食材已成功删除!') {
                const fetchFoodData = async () => {
                    setIsLoading(true);
                    setError(null); // 清空之前的错误信息
                    try {
                        const response = await fetch('/api/foodData');
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        const newData = await response.json();
                        setFoodData(newData);
                    } catch (error) {
                        setError(error);
                    } finally {
                        setIsLoading(false);
                    }
                };
                fetchFoodData();
                handleCloseDeleteModal();
            }
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddFood = async () => {
        setLoading(true);
        setError(null); // 清空之前的错误信息
        try {
            const response = await fetch('/api/addFood', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(addFormData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.message === '食材已成功添加!') {
                const fetchFoodData = async () => {
                    setIsLoading(true);
                    setError(null); // 清空之前的错误信息
                    try {
                        const response = await fetch('/api/foodData');
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        const newData = await response.json();
                        setFoodData(newData);
                    } catch (error) {
                        setError(error);
                    } finally {
                        setIsLoading(false);
                    }
                };
                fetchFoodData();
                handleCloseAddModal();
            }
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    // 导出数据到 XLSX 文件
    const handleExport = () => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(foodData);
        XLSX.utils.book_append_sheet(wb, ws, "FoodData");
        XLSX.writeFile(wb, "FoodData.xlsx");
    };

    // 使用键盘上的 Esc 键关闭模态框
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape') {
                if (editModalOpen) {
                    handleCloseEditModal();
                } else if (deleteModalOpen) {
                    handleCloseDeleteModal();
                } else if (addModalOpen) {
                    handleCloseAddModal();
                }
            }
        };

        window.addEventListener('keydown', handleEscKey);

        return () => {
            window.removeEventListener('keydown', handleEscKey);
        };
    }, [editModalOpen, deleteModalOpen, addModalOpen, handleCloseEditModal, handleCloseDeleteModal, handleCloseAddModal]);

    return (
        <div>
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
            <div className="toolbar">
                <button className="add" onClick={handleOpenAddModal}>添加食材</button>
                <div className="import-export">
                    <button className="export" onClick={handleExport}>导出备份</button>
                </div>
            </div>

            {/* 加载指示器 */}
            {isLoading && (
                <div className="loading-indicator">
                    数据加载中...
                </div>
            )}

            {/* 错误信息 */}
            {error && (
                <div className="error-message">
                    发生错误: {error.message}
                </div>
            )}

            {/* 数据表格 */}
            {!isLoading && !error && (
                <table className="food-table">
                    <thead>
                        <tr className="header-row">
                            <th>
                                <button type="button" onClick={() => requestSort('foodname')}>
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
                            <th>管理</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedList.map((food) => (
                            <tr key={food.id}>
                                <td>{food.foodname}</td>
                                <td>{food.carbon}</td>
                                <td>{food.protein}</td>
                                <td>{food.fat}</td>
                                <td>
                                    <button className="edit" onClick={() => handleOpenEditModal(food)}>编辑</button>
                                    <button className="delete" onClick={() => handleOpenDeleteModal(food)}>删除</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* 编辑模态框 */}
            {editModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseEditModal}>&times;</span>
                        <h2>编辑食材</h2>
                        <label>食材名称:</label>
                        <input
                            type="text"
                            name="foodname"
                            value={editFormData.foodname}
                            onChange={handleEditFormChange}
                        />
                        <label>类型:</label>
                        <select
                            name="type"
                            value={editFormData.type}
                            onChange={handleEditFormChange}
                        >
                            <option value="碳水来源">碳水来源</option>
                            <option value="蛋白质来源">蛋白质来源</option>
                            <option value="脂肪来源">脂肪来源</option>
                        </select>
                        <label>碳水:</label>
                        <input
                            type="number"
                            name="carbon"
                            value={editFormData.carbon}
                            onChange={handleEditFormChange}
                        />
                        <label>蛋白质:</label>
                        <input
                            type="number"
                            name="protein"
                            value={editFormData.protein}
                            onChange={handleEditFormChange}
                        />
                        <label>脂肪:</label>
                        <input
                            type="number"
                            name="fat"
                            value={editFormData.fat}
                            onChange={handleEditFormChange}
                        />
                        <div className="buttons">
                            <button className="edit" onClick={handleUpdateFood} disabled={loading}>
                                {loading ? '修改中...' : '修改'}
                            </button>
                        </div>
                        {loading && <div className="loading-spinner"></div>}
                    </div>
                </div>
            )}

            {/* 删除确认模态框 */}
            {deleteModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>确定要删除 {selectedFood.foodname} 吗?</h3>
                        <div className="buttons">
                            <button className="delete" onClick={handleDeleteFood} disabled={loading}>
                                {loading ? '删除中...' : '确认'}
                            </button>
                            <button className="delete" onClick={handleCloseDeleteModal} disabled={loading}>关闭</button>
                        </div>
                        {loading && <div className="loading-spinner"></div>}
                    </div>
                </div>
            )}

            {/* 添加模态框 */}
            {addModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>添加食材</h2>
                        <label>食材名称:</label>
                        <input
                            type="text"
                            name="foodname"
                            value={addFormData.foodname}
                            onChange={handleAddFormChange}
                        />
                        <label>类型:</label>
                        <select
                            name="type"
                            value={addFormData.type}
                            onChange={handleAddFormChange}
                        >
                            <option value="碳水来源">碳水来源</option>
                            <option value="蛋白质来源">蛋白质来源</option>
                            <option value="脂肪来源">脂肪来源</option>
                        </select>
                        <label>碳水:</label>
                        <input
                            type="number"
                            name="carbon"
                            value={addFormData.carbon}
                            onChange={handleAddFormChange}
                        />
                        <label>蛋白质:</label>
                        <input
                            type="number"
                            name="protein"
                            value={addFormData.protein}
                            onChange={handleAddFormChange}
                        />
                        <label>脂肪:</label>
                        <input
                            type="number"
                            name="fat"
                            value={addFormData.fat}
                            onChange={handleAddFormChange}
                        />
                        <div className="buttons">
                            <button className="add" onClick={handleAddFood} disabled={loading}>
                                {loading ? '添加中...' : '添加'}
                            </button>
                            <button className="delete" onClick={handleCloseAddModal} disabled={loading}>关闭</button>
                        </div>
                        {loading && <div className="loading-spinner"></div>}
                    </div>
                </div>
            )}
        </div>
    );
}

export default FoodDataEditor;

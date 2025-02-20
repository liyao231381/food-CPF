// App.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import CarbCalculator from './CarbCalculator';
import FoodWeightCalculator from './FoodWeightCalculator';
import FoodTable from './FoodTable'; // 引入食材成分表组件
import './App.css';

// 创建一个全局的 context 来共享 foodData
export const FoodDataContext = React.createContext(null);

function App() {
    const [foodData, setFoodData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFoodData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/foodData');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                // 缓存到 localStorage
                localStorage.setItem('foodData', JSON.stringify(data));
                setFoodData(data);
            } catch (error) {
                setError(error);
                console.error("Could not fetch food data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        // 尝试从 localStorage 中获取数据
        const storedData = localStorage.getItem('foodData');
        if (storedData) {
            try {
                setFoodData(JSON.parse(storedData));
                setIsLoading(false); // 即使从缓存加载，也设置 isLoading 为 false
            } catch (parseError) {
                console.error("Could not parse stored food data:", parseError);
                // 如果解析失败，重新从 API 获取数据
                fetchFoodData();
            }
        } else {
            // 如果 localStorage 中没有数据，则从 API 获取数据
            fetchFoodData();
        }
    }, []);

    return (
        <div className="App">
            {/* 添加头部 */}
            <header className="App-header">
                <div className="header-container">
                    <h1 className="header-title">饮食一条龙</h1>
                    <Link to="/admin" className="admin-button">
                        进入管理面板
                    </Link>
                </div>
            </header>
            <div className="content-container">
                {isLoading ? (
                    <p>Loading food data...</p>
                ) : error ? (
                    <p>Error: {error.message}</p>
                ) : (
                    <FoodDataContext.Provider value={foodData}>
                        <Tabs>
                            <TabList>
                                <Tab>食材重量计算器</Tab>
                                <Tab>🥦 碳循环饮食计算器 💪</Tab>
                                <Tab>食材成分表</Tab>
                            </TabList>

                            <TabPanel>
                                <FoodWeightCalculator />
                            </TabPanel>
                            <TabPanel>
                                <CarbCalculator />
                            </TabPanel>
                            <TabPanel>
                                <FoodTable />
                            </TabPanel>
                        </Tabs>
                    </FoodDataContext.Provider>
                )}
            </div>
        </div>
    );
}

export default App;

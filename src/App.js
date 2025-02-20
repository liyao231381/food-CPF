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
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#00aaff" width="24px" height="24px">
                            <path d="M0 0h24v24H0z" fill="none"/>
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-.99 1.97-3.08 6-3.08 4.03 0 5.97 2.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                        </svg>
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
                                <Tab>
                                    🧮食材重量计算器
                                </Tab>
                                <Tab>
                                    💪碳循环饮食计算器
                                </Tab>
                                <Tab>
                                    🥦食材成分表
                                </Tab>
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

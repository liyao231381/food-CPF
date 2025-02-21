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

const cacheDuration = 24 * 60 * 60 * 1000; // 缓存有效期：24 小时 (毫秒)

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
                localStorage.setItem('foodData', JSON.stringify(data));
                localStorage.setItem('foodDataTimestamp', Date.now().toString()); // 存储时间戳
                setFoodData(data);
            } catch (error) {
                setError(error);
                console.error("Could not fetch food data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const loadDataFromCache = () => {
            const storedData = localStorage.getItem('foodData');
            const storedTimestamp = localStorage.getItem('foodDataTimestamp');

            if (storedData && storedTimestamp) {
                const timestamp = parseInt(storedTimestamp, 10);
                const now = Date.now();

                if (now - timestamp < cacheDuration) {
                    // 缓存未过期，从缓存加载
                    try {
                        setFoodData(JSON.parse(storedData));
                        setIsLoading(false); // 从缓存加载后立即结束加载状态
                        console.log("Data loaded from cache."); // 可选：添加日志，方便调试
                        return true; // 表示成功从缓存加载
                    } catch (parseError) {
                        console.error("Could not parse stored food data:", parseError);
                        return false; // 缓存解析失败
                    }
                } else {
                    // 缓存已过期
                    console.log("Cache expired, fetching new data from API."); // 可选：添加日志
                    return false; // 缓存过期，需要从 API 获取
                }
            }
            return false; // 没有缓存数据或时间戳
        };

        if (!loadDataFromCache()) { // 如果没有有效缓存，则从 API 获取
            fetchFoodData();
        }

    }, []);

    return (
        <div className="App">
            {/* 添加头部 */}
            <header className="App-header">
                <div className="header-container">
                    <h1 className="header-title">🍴饮食一条龙🐉</h1>
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
                                    🧮食材重量
                                </Tab>
                                <Tab>
                                    💪碳循环饮食
                                </Tab>
                                <Tab>
                                    🥦食材成分
                                </Tab>
                                <Tab>
                                    更多功能
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
                            <TabPanel>
                                <p>更多功能正在开发中...</p>
                                <p>敬请期待！</p>
                                <p>欢迎提出宝贵意见！</p>
                            </TabPanel>
                        </Tabs>
                    </FoodDataContext.Provider>
                )}
            </div>
            <footer className="App-footer">
                <p>&copy; 2025 @李瑶瑶种太阳 独立开发</p>
            </footer>
        </div>
    );
}

export default App;

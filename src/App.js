// App.js
import React, { useState } from 'react'; // 导入 useState
import CarbCalculator from './CarbCalculator';
import FoodWeightCalculator from './FoodWeightCalculator';
import './App.css';
import AddFoodModal from './AddFoodModal'; // 导入 AddFoodModal 组件

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false); // 添加状态

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="App">
            <header className="App-header">
                {/* 添加按钮以打开模态框 */}
                <button className="add-food-button" onClick={handleOpenModal}>添加食材</button>

                {/* CarbCalculator 区域 */}
                <div className="carb-calculator-section">
                    <CarbCalculator />
                </div>

                {/* 空白区域，用于后续添加内容 */}
                <div className="food-weight-section">
                    {/* 这里添加 FoodWeightCalculator 组件 */}
                    <FoodWeightCalculator />
                </div>
            </header>

            {/* 添加模态框 */}
            <AddFoodModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </div>
    );
}

export default App;

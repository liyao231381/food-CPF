// App.js
import React, { useState } from 'react';
import CarbCalculator from './CarbCalculator';
import FoodWeightCalculator from './FoodWeightCalculator';
import './App.css';
import AddFoodModal from './AddFoodModal';

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);

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

                {/* 碳水计算器和食材重量计算器 */}
                <div className="content-container">
                    <CarbCalculator />
                    <FoodWeightCalculator />
                </div>
            </header>

            {/* 添加模态框 */}
            <AddFoodModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </div>
    );
}

export default App;

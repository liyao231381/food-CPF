// App.js
import React from 'react';
import CarbCalculator from './CarbCalculator';
import FoodWeightCalculator from './FoodWeightCalculator';
import './App.css';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                {/* 碳水计算器和食材重量计算器 */}
                <div className="content-container">
                    <CarbCalculator />
                    <FoodWeightCalculator />
                </div>
            </header>
        </div>
    );
}

export default App;

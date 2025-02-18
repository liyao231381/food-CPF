// FoodWeightCalculator.js
import React from 'react';
import foodData from './foodData'; // 导入 foodData
import './FoodWeightCalculator.css';

const FoodWeightCalculator = () => {
    const [nutrientAmount, setNutrientAmount] = React.useState(50);
    const [foodType, setFoodType] = React.useState('carbon');
    const [results, setResults] = React.useState([]);

    const calculateWeight = () => {
        const selectedFoodList = foodData[foodType];
        if (!selectedFoodList) {
            setResults([{ foodname: '', weight: '未找到该类型的食物数据。' }]);
            return;
        }

        if (isNaN(nutrientAmount)) {
            setResults([{ foodname: '', weight: '请输入有效的营养素需求量。' }]);
            return;
        }

        const newResults = selectedFoodList.map(food => {
            let nutrientContent;
            let nutrientName;
            switch (foodType) {
                case "carbon":
                    nutrientContent = food.carbon;
                    nutrientName = "碳水";
                    break;
                case "protein":
                    nutrientContent = food.protein;
                    nutrientName = "蛋白质";
                    break;
                case "fat":
                    nutrientContent = food.fat;
                    nutrientName = "脂肪";
                    break;
                default:
                    nutrientContent = 0;
                    nutrientName = "未知";
            }

            let weight = '无法提供';
            if (nutrientContent > 0) {
                weight = ((nutrientAmount / nutrientContent) * 100).toFixed(2);
            }

            return { foodname: food.foodname, weight: weight };
        });

        setResults(newResults);
    };

    return (
        <div className="food-weight-calculator-container">
            <h2>食材重量计算器</h2>
            <div className="input-all">
                <div className="input-area">
                    <label htmlFor="foodType">选择食材类型:</label>
                    <select id="foodType" value={foodType} onChange={e => setFoodType(e.target.value)}>
                        <option value="carbon">碳水来源</option>
                        <option value="protein">蛋白质来源</option>
                        <option value="fat">脂肪来源</option>
                    </select>
                </div>

                <div className="input-area">
                    <label htmlFor="nutrientAmount">请输入营养素需求量 (克):</label>
                    <input
                        type="number"
                        id="nutrientAmount"
                        placeholder="例如: 50"
                        value={nutrientAmount}
                        onChange={e => setNutrientAmount(parseFloat(e.target.value))}
                    />
                </div>
            </div>
            <button onClick={calculateWeight}>查询</button>

            <h3>计算结果</h3>
            <table className="result-table">
                <thead>
                    <tr>
                        <th>食材名称</th>
                        <th>所需重量 (克)</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((result, index) => (
                        <tr key={index}>
                            <td>{result.foodname}</td>
                            <td>{result.weight}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FoodWeightCalculator;

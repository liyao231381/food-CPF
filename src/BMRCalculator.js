// BMRCalculator.js
import React, { useState, useEffect, useRef } from 'react'; // 引入 useRef
import './BMRCalculator.css';

const BMRCalculator = () => {
    const [weight, setWeight] = useState(70); // 体重
    const [height, setHeight] = useState(172); // 身高
    const [age, setAge] = useState(25); // 年龄
    const [gender, setGender] = useState('male'); // 性别
    const [activityLevel, setActivityLevel] = useState(1.2); // 活动因子
    const [bmr, setBmr] = useState(null); // 计算出的BMR
    const [tdee, setTdee] = useState(null); // 计算出的TDEE

    // 使用 useRef 创建一个 ref
    const activityLevelRef = useRef(null);

    // 使用 useEffect 在输入值变化时更新 BMR 和 TDEE
    useEffect(() => {
        const calculateBMR = () => {
            let calculatedBMR;
            if (gender === 'male') {
                calculatedBMR = 66.47 + (13.75 * weight) + (5.003 * height) - (6.755 * age);
            } else {
                calculatedBMR = 655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age);
            }
            setBmr(calculatedBMR);
            return calculatedBMR; // 返回计算的BMR
        };

        const bmrValue = calculateBMR();
        if (bmrValue) {
            setTdee(bmrValue * activityLevel); // 计算 TDEE
        }
    }, [weight, height, age, gender, activityLevel]); // 依赖于这些状态变化

    // 定义一个函数来更新 activityLevel，并同时更新滑块的样式
    const updateActivityLevel = (range) => {
        const progress = ((range.value - range.min) / (range.max - range.min)) * 100;
        range.style.setProperty('--progress', progress + '%');
        let activityLevelLabel = "";
        if (range.value >= 1.2 && range.value <= 1.25) {
            activityLevelLabel = "  躺尸";
        } else if (range.value >= 1.251 && range.value <= 1.3) {
            activityLevelLabel = "  久坐不动";
        } else if (range.value >= 1.301 && range.value <= 1.425) {
            activityLevelLabel = "  轻度活动";
        } else if (range.value >= 1.426 && range.value <= 1.625) {
            activityLevelLabel = "  中度活动";
        } else if (range.value >= 1.626 && range.value <= 1.774) {
            activityLevelLabel = "  剧烈活动";
        } else if (range.value >= 1.775 && range.value <= 1.85) {
            activityLevelLabel = "  剧烈运动";
        } else if (range.value >= 1.851 && range.value <= 2.0) {
            activityLevelLabel = "  荒野逃生";
        }
        document.getElementById('activityLevelValue').textContent = activityLevelLabel;
        setActivityLevel(parseFloat(range.value)); // 更新 activityLevel 状态
    };

    // 使用 useEffect 在组件挂载后，手动触发 updateActivityLevel 函数
    useEffect(() => {
        // 初始化时手动触发 updateActivityLevel
        const activityLevelRange = document.getElementById('activityLevel');
        if (activityLevelRange) {
            updateActivityLevel(activityLevelRange);
        }
    }, []);

    return (
        <div>
            <h2>基础代谢率 (BMR) 计算器</h2>
            {bmr !== null && (
                <div className="result">
                    <h3>基础代谢率 (BMR): {bmr.toFixed(2)} Kcal</h3>
                    {tdee !== null && (
                        <h3>每日总消耗 (TDEE): {tdee.toFixed(2)} Kcal</h3>
                    )}
                </div>
            )}
            <div className="input-group">
                <div className="input-row">
                    <label htmlFor="weight">体重（KG）</label>
                    <input
                        type="number"
                        id="weight"
                        value={weight}
                        onChange={(e) => setWeight(parseFloat(e.target.value))}
                    />
                </div>
                <div className="input-row">
                    <label htmlFor="height">身高（CM）</label>
                    <input
                        type="number"
                        id="height"
                        value={height}
                        onChange={(e) => setHeight(parseFloat(e.target.value))}
                    />
                </div>
                <div className="input-row">
                    <label htmlFor="age">年龄</label>
                    <input
                        type="number"
                        id="age"
                        value={age}
                        onChange={(e) => setAge(parseFloat(e.target.value))}
                    />
                </div>
                <div className="input-row">
                    <label>性别</label>
                    <div className="gender-select">
                        <i
                            className={`fas fa-male gender-icon ${gender === 'male' ? 'active' : ''}`}
                            onClick={() => setGender('male')}
                        ></i>
                        <i
                            className={`fas fa-female gender-icon ${gender === 'female' ? 'active' : ''}`}
                            onClick={() => setGender('female')}
                        ></i>
                    </div>
                </div>
                {/* 活动水平滑块 */}
                <div className="input-row">
                    <label className="activity-level-label">活动水平</label>
                    <span id="activityLevelValue" className="value-display activity-level-value">躺尸</span>
                    <div className="range-container">
                        <input
                            type="range"
                            id="activityLevel"
                            min="1.2"
                            max="2.0"
                            step="0.001"
                            defaultValue={activityLevel}
                            ref={activityLevelRef}
                            onInput={(e) => updateActivityLevel(e.target)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BMRCalculator;

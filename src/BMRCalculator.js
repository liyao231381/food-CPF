import React, { useState, useEffect, useRef, useCallback } from 'react';
import './BMRCalculator.css';

const BMRCalculator = () => {
    const [weight, setWeight] = useState(70); // 体重
    const [height, setHeight] = useState(172); // 身高
    const [age, setAge] = useState(25); // 年龄
    const [gender, setGender] = useState('male'); // 性别
    const [activityLevel, setActivityLevel] = useState(1.2); // 活动因子
    const [bmr, setBmr] = useState(null); // 计算出的BMR
    const [tdee, setTdee] = useState(null); // 计算出的TDEE
    const [bmi, setBmi] = useState(null); // 新增：BMI值
    const [bmiCategory, setBmiCategory] = useState(''); // 新增：BMI分类

    const activityLevelRef = useRef(null);

    // 计算BMI的函数
    const calculateBMI = useCallback(() => {
        if (weight && height) {
            // 将身高转换为米
            const heightInMeters = height / 100;
            // 计算BMI
            const calculatedBMI = weight / (heightInMeters * heightInMeters);
            setBmi(calculatedBMI);
            return calculatedBMI;
        }
        return null;
    }, [weight, height]); // 只有当 weight 或 height 变化时，才重新创建 calculateBMI 函数

    // BMI分类的函数
    const getBmiCategory = (bmiValue) => {
        if (bmiValue < 18.5) {
            return '过轻';
        } else if (bmiValue >= 18.5 && bmiValue < 25) {
            return '正常';
        } else if (bmiValue >= 25 && bmiValue < 30) {
            return '超重';
        } else if (bmiValue >= 30) {
            return '肥胖';
        }
        return '';
    };

    // 根据BMI分类获取颜色
    const getBMIColor = (bmiCategory) => {
        switch (bmiCategory) {
            case '过轻':
                return '#00aaff';
            case '正常':
                return '#4CAF50';
            case '超重':
                return '#ffa500';
            case '肥胖':
                return 'red';
            default:
                return '#9a9a9a'; // 默认颜色，防止出错
        }
    };

    // 使用 useEffect 在体重或身高变化时更新 BMR, TDEE 和 BMI
    useEffect(() => {
        // 计算BMR
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

        // 计算BMI
        const bmiValue = calculateBMI();
        if (bmiValue) {
            setBmiCategory(getBmiCategory(bmiValue)); // 获取BMI分类
        }
    }, [weight, height, age, gender, activityLevel, calculateBMI]); // 依赖于这些状态变化

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
        setActivityLevel(parseFloat(range.value));
    };

    useEffect(() => {
        const activityLevelRange = document.getElementById('activityLevel');
        if (activityLevelRange) {
            updateActivityLevel(activityLevelRange);
        }
    }, []);

    const bmiColor = getBMIColor(bmiCategory); // 获取BMI颜色

    return (
        <div>
            {/* 显示BMI */}
            {bmi !== null && (
                <div className="result">
                    <h3 style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: 'black' }}>BMI: &nbsp;</span>
                        <span style={{ color: bmiColor, marginRight: '10px' }}>{bmi.toFixed(2)}</span> {/* 添加margin，避免文字紧贴 */}
                        <span style={{ color: bmiColor }}>{bmiCategory}</span>
                    </h3>
                    <h3>
                        <span style={{ color: 'black' }}>基础代谢率 (BMR): &nbsp;</span>
                        <span style={{ color: '#ffa500' }}>{bmr.toFixed(2)} Kcal</span>
                    </h3>
                    {tdee !== null && (
                        <h3>
                            <span style={{ color: 'black' }}>每日总消耗 (TDEE): &nbsp;</span>
                            <span style={{ color: '#ffa500' }}>{tdee.toFixed(2)} Kcal</span>
                        </h3>
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
                <hr style={{ margin: '20px 0' }} />
                <p style={{ color: "gray" }}>
                    <strong>BMI计算</strong>
                    <span>（赛季不适用）</span><br />
                    <strong>BMI</strong> = 体重（kg）/（身高（m）*身高（m））<br />
                    过轻 BMI ＜ 18.5<br />
                    正常 18.5 ≤ BMI ＜ 25<br />
                    超重 25 ≤ BMI ＜ 30<br />
                    肥胖 BMI ≥ 30<br /><br />
                    <strong>BMR计算</strong><br />
                    Harris-Benedict公式:<br />
                    男性：<strong>BMR</strong> = 66.47 + (13.75×体重kg) + (5.003×身高cm) - (6.755×年龄)<br />
                    女性：<strong>BMR</strong> = 655.1 + (9.563×体重kg) + (1.850×身高cm) - (4.676×年龄)<br /><br />
                    <strong>TDEE</strong> = BMR × 活动因子 (1.2~2.0)
                </p>
            </div>
        </div>
    );
};

export default BMRCalculator;

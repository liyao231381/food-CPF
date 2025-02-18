// CarbCalculator.js - 恢复样式并修复滑块位置 + 修复初始加载进度条
import React, { useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import './CarbCalculator.css';

const CarbCalculator = () => {
    const resultTableRef = useRef(null);

    // 训练强度滑块的默认值
    const defaultTrainingLevel = 1.2;
    // 体质类型滑块的默认值
    const defaultBodyTypeValue = 2.5;

    const updateTrainingLevel = (range) => {
        const progress = ((range.value - range.min) / (range.max - range.min)) * 100;
        range.style.setProperty('--progress', progress + '%');
        document.getElementById('trainingLevelValue').textContent = range.value;
    };

    const updateBodyTypeValue = (range) => {
        const progress = ((range.value - range.min) / (range.max - range.min)) * 100;
        range.style.setProperty('--progress', progress + '%');
        let bodyTypeLabel = "";
        if (range.value >= 2 && range.value <= 2.2) {
            bodyTypeLabel = "内胚型（易胖）";
        } else if (range.value >= 2.3 && range.value <= 2.6) {
            bodyTypeLabel = "中胚型（胖瘦）";
        } else if (range.value >= 2.7 && range.value <= 3) {
            bodyTypeLabel = "外胚型（易瘦）";
        }
        document.getElementById('bodyTypeValue').textContent = bodyTypeLabel;
    };

    const calculate = () => {
        const weight = parseFloat(document.getElementById("weight").value);
        const bodyTypeValue = parseFloat(document.getElementById("bodyType").value);
        const trainingLevel = parseFloat(document.getElementById("trainingLevel").value);
        const table = document.getElementById("result");

        while (table.rows.length > 1) {
            table.deleteRow(1);
        }

        if (isNaN(weight) || isNaN(bodyTypeValue)) {
            return;
        }

        const fatIntakeParameter = 0.8 + (bodyTypeValue - 2) * 0.3;
        const fat = weight * fatIntakeParameter;
        const carb = weight * bodyTypeValue;
        const protein = weight * trainingLevel;

        let weeklyCarb = carb * 7;
        let weeklyProtein = protein * 7;
        let weeklyFat = fat * 7;

        const highCarb = weeklyCarb * 0.5 / 2;
        const lowCarb = weeklyCarb * 0.15 / 2;
        const midCarb = weeklyCarb * 0.35 / 3;
        const highFat = weeklyFat * 0.15 / 2;
        const lowFat = weeklyFat * 0.5 / 2;
        const midFat = weeklyFat * 0.35 / 3;

        const schedule = [
            { day: "周一", workout: "腿部、核心", carbType: "high" },
            { day: "周二", workout: "肩部", carbType: "mid" },
            { day: "周三", workout: "休息", carbType: "low" },
            { day: "周四", workout: "胸部、三头肌", carbType: "mid" },
            { day: "周五", workout: "背部、二头肌", carbType: "high" },
            { day: "周六", workout: "手臂", carbType: "mid" },
            { day: "周日", workout: "休息", carbType: "low" }
        ];

        for (let i = 0; i < 7; i++) {
            const day = schedule[i].day;
            const workout = schedule[i].workout;
            const carbType = schedule[i].carbType;
            let dailyCarb, dailyFat, foodSuggestion;

            if (carbType === "high") {
                dailyCarb = highCarb;
                dailyFat = highFat;
                foodSuggestion = "米饭、面条、红薯、香蕉等";
            } else if (carbType === "low") {
                dailyCarb = lowCarb;
                dailyFat = lowFat;
                foodSuggestion = "蔬菜、沙拉、鸡蛋、鱼肉等";
            } else {
                dailyCarb = midCarb;
                dailyFat = midFat;
                foodSuggestion = "全麦面包、燕麦片、玉米、紫薯等";
            }

            const row = table.insertRow();
            row.insertCell().textContent = day;
            row.insertCell().textContent = workout;
            row.insertCell().textContent = dailyCarb.toFixed(2);
            row.insertCell().textContent = protein.toFixed(2);
            row.insertCell().textContent = dailyFat.toFixed(2);
            row.insertCell().textContent = foodSuggestion;
        }

        const totalRow = table.insertRow();
        totalRow.insertCell().textContent = "";
        totalRow.insertCell().textContent = "总量";
        totalRow.insertCell().textContent = weeklyCarb.toFixed(2);
        totalRow.insertCell().textContent = weeklyProtein.toFixed(2);
        totalRow.insertCell().textContent = weeklyFat.toFixed(2);
        const totalCalories = (weeklyCarb * 4) + (weeklyProtein * 4) + (weeklyFat * 9);
        totalRow.insertCell().textContent = totalCalories.toFixed(2) + " Kcal";
    };

    const exportToPNG = () => {
        const element = resultTableRef.current;
        html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: true,
            allowTaint: true,
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imgData;
            link.download = '碳水循环计算器.png';
            link.click();
        }).catch((error) => {
            console.error('导出失败:', error);
        });
    };

    useEffect(() => {
        calculate(); // 初始化计算
        // 在组件挂载后，手动触发 update...Value 函数
        const trainingLevelRange = document.getElementById('trainingLevel');
        if (trainingLevelRange) {
            updateTrainingLevel(trainingLevelRange);
        }

        const bodyTypeRange = document.getElementById('bodyType');
        if (bodyTypeRange) {
            updateBodyTypeValue(bodyTypeRange);
        }
    }, []);

    return (
        <div>
            <div id="carb-calculator-container">
                <h2>🥦 碳循环饮食计算器 💪</h2>
                <div className="input-group">
                    <div className="input-row">
                        <label htmlFor="weight" className="weight-label">体重（KG）</label>
                        <input type="number" id="weight" name="weight" placeholder="请输入体重" onInput={() => calculate()} />
                    </div>
                    {/* 体质类型滑块 */}
                    <div className="input-row">
                        <label className="body-type-label">体质类型</label>
                        <span id="bodyTypeValue" className="value-display body-type-value">中胚型（胖瘦）</span>
                        <div className="range-container">
                            <input
                                type="range"
                                id="bodyType"
                                min="2"
                                max="3"
                                step="0.1"
                                defaultValue={defaultBodyTypeValue}
                                onInput={(e) => { updateBodyTypeValue(e.target); calculate(); }}
                            />
                        </div>
                    </div>
                    {/* 训练强度滑块 */}
                    <div className="input-row">
                        <label className="training-level-label">训练强度（蛋白质）</label>
                        <span id="trainingLevelValue" className="value-display training-level-value">1.2</span>
                        <div className="range-container">
                            <input
                                type="range"
                                id="trainingLevel"
                                min="0.8"
                                max="2.0"
                                step="0.1"
                                defaultValue={defaultTrainingLevel}
                                onInput={(e) => { updateTrainingLevel(e.target); calculate(); }}
                            />
                        </div>
                    </div>
                </div>
                <div id="buttons">
                    <button className="export-btn" onClick={exportToPNG}>
                        导出表格图片</button>
                    <div className="export-hint">手机切换为横屏再点击导出，图片更宽</div>
                </div>
                <table id="result" ref={resultTableRef}>
                    <tr className="center-text">
                        <th>日期</th>
                        <th>训练部位</th>
                        <th>碳水（g）</th>
                        <th>蛋白质（g）</th>
                        <th>脂肪（g）</th>
                        <th>饮食建议</th>
                    </tr>
                </table>
            </div>
        </div>
    );
};

export default CarbCalculator;

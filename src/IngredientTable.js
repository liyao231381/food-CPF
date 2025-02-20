// IngredientTable.js
import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import FoodTable from './FoodTable'; // 创建一个新的 FoodTable 组件
import './IngredientTable.css';

function IngredientTable() {
    return (
        <div>
            <Tabs>
                <TabList>
                    <Tab>主食/碳水</Tab>
                    <Tab>蛋白质</Tab>
                    <Tab>脂肪</Tab>
                </TabList>

                <TabPanel>
                    <FoodTable foodType="carbon" />
                </TabPanel>
                <TabPanel>
                    <FoodTable foodType="protein" />
                </TabPanel>
                <TabPanel>
                    <FoodTable foodType="fat" />
                </TabPanel>
            </Tabs>
        </div>
    );
}

export default IngredientTable;

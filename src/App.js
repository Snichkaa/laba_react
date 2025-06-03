import './CSS/App.css';
import buildings from './data.js';
import Table from './components/Table.js';
import Chart from './components/Chart.js';
import {useState} from "react";

function App() {
  const [filteredData, setFilteredData] = useState(buildings);
  
  return (
    <div className='App'>
      <Chart data={filteredData}/>
      <h3>Редкие виды растений</h3>
      <Table 
        data={buildings} 
        amountRows="10"
        onFilterChange={setFilteredData}
      />
    </div>
  );
}

export default App;
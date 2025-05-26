//import logo from './images/logo.svg';
import './CSS/App.css';
import buildings from './data.js';
//import TableRow from './components/TableRow.js';
//import TableHead from './components/TableHead.js';
//import TableBody from './components/TableBody.js';
import Table from './components/Table.js';

function App() {
  return (
    /*<div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>*/
    <div className='App'>
      <h3>Редкие виды растений</h3>
      <Table data={ buildings } amountRows="10"/>
    </div>
  );
}

export default App;
import TableHead from './TableHead.js';
import TableBody from './TableBody.js';
import Filter from './Filter.js';
import Sort from './Sort.js';
import { useState, useEffect } from 'react';
/*
 компонент, выводящий на страницу таблицу
 пропсы:
 data - данные для таблицы в виде массива объектов
*/
const Table = (props) => {

    const [activePage, setActivePage] = useState(1);
    const [filteredData, setFilteredData] = useState(props.data);
    const [sortedData, setSortedData] = useState(props.data);
    const [resetKey, setResetKey] = useState(0);
    
    useEffect(() => {
        // При изменении отфильтрованных данных уведомляем родительский компонент
        props.onFilterChange && props.onFilterChange(filteredData);
    }, [filteredData, props.onFilterChange]);

    const changeActive = (event) => {
        setActivePage(event.target.innerHTML);
    };

    const handleFullReset = () => {
        setFilteredData(props.data);
        setSortedData(props.data);
        setActivePage(1);
        setResetKey(prev => prev + 1);
    };

    const handleFilter = (filteredValues) => {
        setFilteredData(filteredValues);
        setSortedData(filteredValues); 
        setActivePage(1);
    };

    const handleSort = (sortedValues) => {
        setSortedData(sortedValues);
        setActivePage(1);
    };

    const showPagination = props.showPagination !== false;
    const rowsToShow = showPagination ? props.amountRows : sortedData.length;
    
    //количество страниц разбиения таблицы
    const n = Math.ceil(sortedData.length / rowsToShow);
    // массив с номерами страниц
    const arr = Array.from({length: n}, (_, i) => i+1);
    //формируем совокупность span с номерами страниц
    const pages = arr.map((item, index) =>
        <span key={index} className={`page-number ${activePage === item ? 'active' : ''}`} onClick={changeActive}> {item} </span>
    );
    
    return (
        <>
            <Filter key={`filter-${resetKey}`} filtering={handleFilter} data={sortedData} fullData={props.data} onFullReset={handleFullReset}/>
            <Sort key={`sort-${resetKey}`} sortering={handleSort} fullData={filteredData} onFullReset={handleFullReset}/>
            <table>
                <TableHead head={Object.keys(props.data[0])} />
                <TableBody body={sortedData} amountRows={rowsToShow} numPage={activePage}/>
            </table>
            {n > 1 && (<div className='pagination'>{pages}</div>)}
        </>
    )

    //Возвращает строки 31-45 
    /*return (
        <>
            <table>
                <TableHead head={ Object.keys(props.data[0]) } />
                <TableBody body={ props.data } amountRows={ props.amountRows }
                           numPage="3"/>
            </table>
            <div>
                {pages}
            </div>
        </>
    )*/
}

export default Table;
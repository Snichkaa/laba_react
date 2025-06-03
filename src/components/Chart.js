import {useState} from "react";
import ChartDraw from "./ChartDraw";
import * as d3 from "d3";

const Chart = (props) => {
    const [ox, setOx] = useState("Распространение");
    const [oy, setOy] = useState([true, false])
    const [error, setError] = useState("");
     const [chartType, setChartType] = useState("scatter"); 

    const handleSubmit = (event) => {
        event.preventDefault();

        const maxCheck = event.target["oy"][0].checked;
        const minCheck = event.target["oy"][1].checked;

        if (!maxCheck && !minCheck) {
            setError("Выберите хотя бы одно значение");
            return;
        }
        setError("");
        setOx(event.target["ox"].value);
        setOy([event.target["oy"][0].checked, event.target["oy"][1].checked]);
        setChartType(event.target["chartType"].value);
    }

    const createArrGraph = (data, key) => {
        const dataCopy = [...data];
        
        if (key === "Вид") {
            dataCopy.sort((a,b) => a[key] - b[key]);
        }

        const groupObj = d3.group(dataCopy, d => d[key]);
        let arrGraph = [];
        for (let entry of groupObj) {
            let minMax = d3.extent(entry[1].map(d => d['Высота (до, м)']));
            arrGraph.push({labelX: entry[0], values: minMax});
        }
        return arrGraph;
    }

    return (
        <>
            <h4>Визуализация</h4>
            <form onSubmit={ handleSubmit}>
                <p>Значение по оси ОХ: </p>
                <div>
                    <input type="radio" name="ox" value="Распространение" defaultChecked={ox === "Распространение"}/>
                    Распространение
                    <br/>		
                    <input type="radio" name="ox" value="Вид" />
                    Вид
                </div>

                <p> Значение по оси OY: </p>
                <div>
                    <input type="checkbox" name="oy" defaultChecked={oy[0] === true}/>
                    Максимальная высота <br/>
                    <input  type="checkbox" name="oy" />
                    Минимальная высота
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <p>  
                    <button type="submit">Построить </button>
                </p>
                <p>Тип диаграммы:</p>
                <select name="chartType" defaultValue="scatter">
                    <option value="scatter">Точечная диаграмма</option>
                    <option value="bar">Гистограмма</option>
                </select>
            </form>
            <ChartDraw data={ createArrGraph(props.data, ox)} showMax={oy[0]} showMin={oy[1]} chartType={chartType}/>	
        </>
    )
}

export default Chart;
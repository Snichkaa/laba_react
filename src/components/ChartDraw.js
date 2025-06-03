import * as d3 from "d3";
import {useRef, useEffect, useState, useMemo} from "react";


const ChartDraw = (props) => {
    //Этот дает доступ к элементу DOM svg, чтобы в нем рисовать  
    const chartRef = useRef(null); //Возвращает изменяемое значение 

    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    //Для перехвата изменений в компоненте, которые нельзя обработь внутри компонента
    // заносим в состояния ширину и высоту svg-элемента
    //В целом после монтирования компонента изменяет ширину и высоту svg
    useEffect(() => {
        const svg = d3.select(chartRef.current);
        svg.selectAll("*").remove();
        setWidth(parseFloat(svg.style('width')));
        setHeight(parseFloat(svg.style('height')));
        /*svg
        .append("circle")
        .attr("r", 100)
        .attr("cx", 200)
        .attr("cy", 200)
        .style("fill", "red");*/
    });

    // задаем отступы в svg-элементе
    const margin = {
        top:10,
        bottom:60,
        left:40,
        right:10
    }

    // вычисляем ширину и высоту области для вывода графиков
    const boundsWidth = width -  margin.left - margin.right;
    const boundsHeight = height - margin.top - margin.bottom;
    
    //Рисует серый фон
    useEffect(() => {
        const svg = d3.select(chartRef.current);
        svg
        .append("rect")
        .attr("x", margin.left)
        .attr("y", margin.top)
        .attr("width", boundsWidth)
        .attr("height", boundsWidth)
        .style("fill", "lightgrey")
    });

    //const indexOY = 1; // диаграмма для максимальных значений
	//let [min, max] = d3.extent(props.data.map(d => d.values));
		
    const [minY, maxY] = useMemo(() => {
        let allValues = [];
        if (props.showMax) allValues.push(...props.data.map(d => d.values[1]));
        if (props.showMin) allValues.push(...props.data.map(d => d.values[0]));
        return d3.extent(allValues);
    }, [props.data, props.showMax, props.showMin]);
    
    //Кэширует результат выполнения функции для избежания повторного вычисления при вызове с теми же аргументами
	// формируем шкалы для осей
    const scaleX = useMemo(() => {
        return d3
            .scaleBand()
            .domain(props.data.map(d => d.labelX))
            .range([0,boundsWidth])
    }, [props.data, boundsWidth]);
  
    const scaleY = useMemo(() => {
        return d3
            .scaleLinear()
            .domain([minY * 0.85, maxY * 1.1 ])
            .range([boundsHeight, 0])
    }, [boundsHeight, minY, maxY]);

    //Основная отрисовка графика
	useEffect(() => {
        const svg = d3.select(chartRef.current);
        svg.selectAll("*").remove();
        
        // рисуем оси
        const xAxis = d3.axisBottom(scaleX);     
        svg.append("g")
            .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
            .call(xAxis)
            .selectAll("text") 
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", d => "rotate(-30)");

        const yAxis = d3.axisLeft(scaleY);
        svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .call(yAxis);

        //const barWidth = scaleX.bandwidth() / ((props.showMax && props.showMin) ? 2 : 1);
        
        // рисуем график
        if (props.chartType === "scatter") {
            // Точечная диаграмма
            const offset = 5; // Сдвиг для минимальных и максимальных значений

            if (props.showMax) {
                svg.selectAll(".dot-max")
                    .data(props.data)
                    .enter()
                    .append("circle")
                    .attr("r", 5)
                    .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2 + offset) // Сдвиг вправо
                    .attr("cy", d => scaleY(d.values[1]))
                    .attr("transform", `translate(${margin.left}, ${margin.top})`)
                    .style("fill", "#f99fbe");
            }
            if (props.showMin) {
                svg.selectAll(".dot-min")
                    .data(props.data)
                    .enter()
                    .append("circle")
                    .attr("r", 5)
                    .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2 - offset) // Сдвиг влево
                    .attr("cy", d => scaleY(d.values[0]))
                    .attr("transform", `translate(${margin.left}, ${margin.top})`)
                    .style("fill", "#b4f6a2");
            }
        } else if (props.chartType === "bar") {
            // Гистограмма
            const staticBarWidth = 10;
            const offset = 5; // Сдвиг для минимальных и максимальных значений

            if (props.showMax) {
                svg.selectAll(".bar-max")
                    .data(props.data)
                    .enter()
                    .append("rect")
                    .attr("x", d => scaleX(d.labelX) + scaleX.bandwidth() / 2 - staticBarWidth / 2 + offset) // Сдвиг вправо
                    .attr("y", d => scaleY(d.values[1]))
                    .attr("width", staticBarWidth)
                    .attr("height", d => boundsHeight - scaleY(d.values[1]))
                    .attr("transform", `translate(${margin.left}, ${margin.top})`)
                    .style("fill", "#f99fbe");
            }
            
            if (props.showMin) {
                svg.selectAll(".bar-min")
                    .data(props.data)
                    .enter()
                    .append("rect")
                    .attr("x", d => scaleX(d.labelX) + scaleX.bandwidth() / 2 - staticBarWidth / 2 - offset) // Сдвиг влево
                    .attr("y", d => scaleY(d.values[0]))
                    .attr("width", staticBarWidth)
                    .attr("height", d => boundsHeight - scaleY(d.values[0]))
                    .attr("transform", `translate(${margin.left}, ${margin.top})`)
                    .style("fill", "#b4f6a2");
            }
        }
}, [scaleX, scaleY, props.data, props.showMax, props.showMin, props.chartType]);

    return (
        <svg ref={chartRef} style={{
            width: "800px",
            height: "500px",
            margin: "20px auto",
            display: "block"
        }}></svg>
    )
}

export default ChartDraw;
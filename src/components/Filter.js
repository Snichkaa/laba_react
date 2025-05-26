/*
 компонент, для фильтрации таблицы
 пропсы:
 fullData - полные данные
 data - данные для фильтрации
 filtering - функция обновления данных для фильтрации
*/
import { useState } from 'react';

const Filter = (props) => {
    const [isOpen, setIsOpen] = useState(true);

    const handleSubmit= (event) => {
        event.preventDefault();
        // создаем словарь со значениями полей формы
        const filterField = {
            "Название": event.target["structure"].value.toLowerCase(),
            "Вид": event.target["type"].value.toLowerCase(),
            "Распространение": event.target["country"].value.toLowerCase(),
            "Средняя продолжительность жизни (лет)": [Number(event.target["yearMin"].value) || null, Number(event.target["yearMax"].value) || null],
            "Высота (до, м)": [Number(event.target["heightMin"].value) || null, Number(event.target["heightMax"].value) || null]
        };

        //фильтруем данные по значениям всех полей формы
        let arr = props.fullData;
        for (const key in filterField) {
            const value = filterField[key];

            if (key === "Средняя продолжительность жизни (лет)" || key === "Высота (до, м)") {
                const [min, max] = value;
                arr = arr.filter(item => {
                    const itemValue = item[key];
                    return (min === null || itemValue >= min) && (max === null || itemValue <= max);
                });
            } else if (value) { 
                arr = arr.filter(item =>
                    item[key].toLowerCase().includes(value)
                );
            }
        }

        //передаем родительскому компоненту отфильтрованный массив
        props.filtering(arr);
    }

    const handleClear = (event) => {
        event.preventDefault();
        props.onFullReset();
    }

    return (
         <details open={isOpen} onToggle={(e) => setIsOpen(e.target.open)}>
            <summary><b>Фильтр</b></summary>
            <form onSubmit={ handleSubmit }>
                <p>
                    <label>Название:</label>
                    <input name="structure" type="text" />
                </p>
                <p>
                    <label>Вид:</label>
                    <input name="type" type="text" />
                </p>
                <p>
                    <label>Страна:</label>
                    <input name="country" type="text" />
                </p>
                <p>
                    <label>Живет от:</label>
                    <input name="yearMin" type="number" />
                </p>
                <p>
                    <label>Живет до:</label>
                    <input name="yearMax" type="number" />
                </p>
                <p>
                    <label>Высота от:</label>
                    <input name="heightMin" type="number" />
                </p>
                <p>
                    <label>Высота до:</label>
                    <input name="heightMax" type="number" />
                </p>
                <p>
                    <button type="submit">Фильтровать</button>
                    <button type="reset" onClick={handleClear}>Очистить</button>
                </p>
            </form>
        </details>
    )
}

export default Filter;
import { useState } from 'react';

const Sort = (props) => {
    const [isOpen, setIsOpen] = useState(true);

    const fieldMap = {
        "name": "Название",
        "type": "Вид",
        "lifespan": "Средняя продолжительность жизни (лет)",
        "height": "Высота (до, м)",
        "distribution": "Распространение"
    };

    const [selectedFields, setSelectedFields] = useState({
        level1: "0",
        level2: "0",
        level3: "0"
    });

    //Открывает уровни 
    const handleFieldChange = (level, value) => {
        const newSelectedFields = {...selectedFields, [level]: value};
        
        if (level === "level1" && value === "0") {
            newSelectedFields.level2 = "0";
            newSelectedFields.level3 = "0";
        } else if (level === "level2" && value === "0") {
            newSelectedFields.level3 = "0";
        }
        
        setSelectedFields(newSelectedFields);
    };

    //Поля которые не выбраны
    const getAvailableOptions = (currentLevel) => {
        const usedFields = [];
        
        if (currentLevel !== "level1" && selectedFields.level1 !== "0") usedFields.push(selectedFields.level1);
        if (currentLevel !== "level2" && selectedFields.level2 !== "0") usedFields.push(selectedFields.level2);
        if (currentLevel !== "level3" && selectedFields.level3 !== "0") usedFields.push(selectedFields.level3);
        
        return Object.entries(fieldMap).filter(([value]) => !usedFields.includes(value))
            .map(([value, label]) => ({value, label}));
    };

    //Сама сортировка
    const handleSubmit = (event) => {
        event.preventDefault();
        
        const sortParametr = {
            level1: {
                field: selectedFields.level1,
                desc: event.target.level1_desc.checked
            },
            level2: {
                field: selectedFields.level2,
                desc: event.target.level2_desc.checked
            },
            level3: {
                field: selectedFields.level3,
                desc: event.target.level3_desc.checked
            }
        };

        const sorts = Object.values(sortParametr).filter(l => l.field !== "0").map(l => ({
                field: fieldMap[l.field],
                desc: l.desc
            }));

        let arr = [...props.fullData];
        sorts.reverse().forEach(s => {
            arr.sort((a,b) => {
                const value_a = a[s.field];
                const value_b = b[s.field];

                if (typeof value_a === 'string') {
                    return s.desc ? value_b.localeCompare(value_a) : value_a.localeCompare(value_b);
                }
                return s.desc ? value_b - value_a : value_a - value_b;
            });
        });
        props.sortering(arr);
    }

    const handleClear = (event) => {
        event.preventDefault();
        props.onFullReset();
    }

    const level1Options = getAvailableOptions("level1");
    const level2Options = selectedFields.level1 !== "0" ? getAvailableOptions("level2") : [];
    const level3Options = selectedFields.level2 !== "0" ? getAvailableOptions("level3") : [];

    return (
        <details open={isOpen} onToggle={(e) => setIsOpen(e.target.open)}>
            <summary><b>Сортировка</b></summary>
            <form onSubmit={handleSubmit}>
                <p>
                    <label>Первый уровень:
                        <select 
                            name="level1" 
                            value={selectedFields.level1}
                            onChange={(e) => handleFieldChange("level1", e.target.value)}
                        >
                            <option value="0">Нет</option>
                            {level1Options.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <input type="checkbox" name="level1_desc" disabled={selectedFields.level1 === "0"}/> По убыванию
                    </label>
                </p>
                <p>
                    <label>Второй уровень:
                        <select 
                            name="level2" 
                            value={selectedFields.level2}
                            onChange={(e) => handleFieldChange("level2", e.target.value)}
                            disabled={selectedFields.level1 === "0"}
                        >
                            <option value="0">Нет</option>
                            {level2Options.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <input 
                            type="checkbox" 
                            name="level2_desc" 
                            disabled={selectedFields.level2 === "0"}
                        /> По убыванию
                    </label>
                </p>
                <p>
                    <label>Третий уровень:
                        <select 
                            name="level3" 
                            value={selectedFields.level3}
                            onChange={(e) => handleFieldChange("level3", e.target.value)}
                            disabled={selectedFields.level2 === "0"}
                        >
                            <option value="0">Нет</option>
                            {level3Options.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <input 
                            type="checkbox" 
                            name="level3_desc" 
                            disabled={selectedFields.level3 === "0"}
                        /> По убыванию
                    </label>
                </p>
                <button type="submit">Применить сортировку</button>
                <button type="reset" onClick={handleClear}>Очистить</button>
            </form>
        </details>            
    )
}

export default Sort;
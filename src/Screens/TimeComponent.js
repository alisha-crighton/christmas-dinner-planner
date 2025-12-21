import TextField from '@mui/material/TextField';
import * as React from 'react';


function TimeInput ({placeholder, newValue, setNewValue, color}) {

    const [oldValue, setOldValue] = React.useState();

    const handleChange = (value) => {
        if (!/^[0-9:]*$/.test(value)) return;

        // Limit hours to 23 and minutes to 59
        if (value.split(":")[0] > 23) return;
        if (value.split(":")[1] > 59) return;
        if (value.charAt(3) === ":") return;
        if (value.charAt(4) === ":") return;
        
        // limit minutes to 50
        if (value.charAt(1) === ":" && Number(value.charAt(2)) > 5) return;
        if (value.charAt(2) === ":" && Number(value.charAt(3)) > 5) return;

        // auto insert : unless deleting time
        if (value.length === 2 && value.charAt(1)!== ":" && (oldValue.length < value.length)) {
            value = value + ":";
        } 
        if (value.length === 3 && value.charAt(1)!== ":" && value.charAt(2)!== ":" && (oldValue.length < value.length)) {
            value = value.slice(0,2) + ":" + value.slice(2);
        } 
        if (value.length === 4 && value.charAt(1)!== ":" && value.charAt(2)!== ":" && (oldValue.length < value.length)) {
            value = value.slice(0,2) + ":" + value.slice(2);
        } 
        // not sure if needed

        if (value.length === 1 && Number(value) > 2) {
            value = value + ":";
            value = value.slice(0,5);
        } else { value = value.slice(0,5); }
        
        setOldValue(value);
        setNewValue(value);
        
    }

    return (
        <div>
        <TextField  
        placeholder={placeholder} 
        variant="standard" 
        margin = "none" 
        style = {{ 
            color:"grey", 
            paddingLeft:0, 
            width:'50%'}} 
        slotProps = {{ 
            input: { 
                disableUnderline:true, 
                sx: { fontFamily: 'Handlee',
                     fontSize:"18px",
                     color: color,
                    }
                }
            }}
        value = {newValue}
        onChange = {(e) => handleChange(e.target.value)}
        /> 
</div>


    )
}

export default TimeInput;

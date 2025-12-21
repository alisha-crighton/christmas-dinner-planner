import TextField from '@mui/material/TextField';
import * as React from 'react';


function MinuteInput ({placeholder, newValue, setNewValue, colour}) {

    // const [oldValue, setOldValue] = React.useState();

    const handleChange = (value) => {
        if (!/^\d*$/.test(value)) return;
        if (Number(value) !== 0 && Number(value) > 999) return;
        
        // setOldValue(value);
        setNewValue(value);
        
    }

    return (
        <div>
        <TextField  placeholder={placeholder}
        variant="standard" 
        margin = "none" 
        style={{color:"grey", 
            paddingLeft:0, 
            width:'40px'
        }} 
        slotProps = {{
            // htmlInput: {maxLength:3}, 
        input : {disableUnderline:true, 
            sx : {fontFamily: 'Handlee',
                fontSize:"18px", 
                color: colour
                }
        }}}
        value = {newValue}
        onChange = {(e) => handleChange(e.target.value)}

        // onChange = {(newPrepTime) => {
        //     if (/^\d*$/.test(newPrepTime.target.value)) {
        //         setNewPrep(newPrepTime.target.value);
        //     }
        // }}
        /> 
        
        {/* <TextField  
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
        onChange = {(e) => handleChange(e.target.value)} */}
        {/* />  */}
</div>


    )
}

export default MinuteInput;

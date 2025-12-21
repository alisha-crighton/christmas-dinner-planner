import '../Homepage.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button'
import {useLocation, useNavigate} from 'react-router-dom';
import * as React from 'react';
import TimeInput from './TimeComponent.js';
import { Link } from 'react-router-dom';


function EditDinnerTime() {

    const navigate = useNavigate()
    
    const location = useLocation();
    const dinnerTime = location.state[0].dinnerTime;
    
    const [newDinnerTime, setNewDinnerTime] = React.useState(dinnerTime)
    const [wrongTime, setWrongTime] = React.useState(false)

    const handleSaveEditDinnerTime = () => {

    let timeStampInput = newDinnerTime
    if (timeStampInput.length === 4 && newDinnerTime.split(":")[0].length === 1){
        timeStampInput = "0" + newDinnerTime ;
    } else if (timeStampInput.length !== 5){
        setWrongTime(true)
        return;
    }

    const editDinnerTime = {
        id: location.state[0].id,
        dinnerTime: timeStampInput
    };
    
    fetch('http://localhost:3002/dinner_time', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editDinnerTime)
    })
    // handle response here 
    .then(res =>res.json())
    .then(data => console.log('Updated dinner time : ', data))
    .catch(err => console.error ('Error with updating dinner time :', err));
    navigate('/')
    };

    const handleCancel = () => {
        if (newDinnerTime !== dinnerTime) {
            setNewDinnerTime(dinnerTime);
            setWrongTime(false);
        }
        else (navigate('/'))
    };

  return (
    <div className="homepage" >
        <div className = "button-row">
        <Link  to={'/'} style={{color:'#4d0d19', borderColor: 'white', marginTop:40, marginLeft:15, textDecoration: "none", display: 'flex', alignItems: 'center', fontFamily: 'Handlee', fontSize:"18px", justifyContent:'flex-start', width:'100%' }}>
            <ArrowBackIcon sx={{color:"#4d0d19", paddingRight:'7px'}}/>
            Back 
        </Link>
        </div>
        <div className = "notepad" style={{minHeight:700, width:350, marginTop:30, marginBottom:100, borderRadius:15}}>
            <div className = "notepad-row">
            <div className = "notepad-holepunch"/> 
            <div className = "notepad-holepunch"/> 
            <div className = "notepad-holepunch"/> 
            <div className = "notepad-holepunch"/> 
            <div className = "notepad-holepunch"/>           
            <div className = "notepad-holepunch"/> 
            <div className = "notepad-holepunch"/> 
            </div>

            <div className = "notepad-title" style={{fontWeight: 'bold', color:'#4d0d19'}}>
                What time do you want to have dinner? <br/>
            </div>

            <div className = "notepad-item" style={{color:'#c62833'}}>
               <span style={{fontWeight: 'bold', paddingRight:10, marginLeft:'30px'}}> Time: </span> 
               <TimeInput 
               placeholder = {dinnerTime} 
               newValue = {newDinnerTime} 
               setNewValue = {setNewDinnerTime}
               color = {'#c62833'}
               />

            </div>
            {wrongTime ? 
            <div className = "notepad-item" style={{color:'#c62833'}}>
                Please input a time of the format hh:mm!
            </div> : null
            }

            <div style={{display:'flex', justifyContent:'space-between', width:'80%', marginTop:'10px'}}>
                <Button style={{fontFamily:'Handlee', color:'#c62833', textTransform: 'none', fontSize:'18px'}} 
                onClick= {handleCancel}
                > 
                Cancel </Button> 
                <Button style={{fontFamily:'Handlee', color:'#1f654c', textTransform: 'none', fontSize:'18px'}}
                onClick = {handleSaveEditDinnerTime}
                > Save </Button>
            </div>
        </div>
    </div>
  );
}

export default EditDinnerTime;
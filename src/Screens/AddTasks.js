import Button from '@mui/material/Button'
import {useNavigate} from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { Link } from 'react-router-dom';
import MinuteInput from './MinuteInput'





function AddTasks() {

  const navigate = useNavigate()
    
    const [addTask, setAddTask] = React.useState('')
    const [timeInput, setTimeInput] = React.useState('');
    const [emptyTitle, setEmptyTitle] = React.useState(false)
    const [emptyTime, setEmptyTime] = React.useState(false)


    const resetAddTask = () => {
        setTimeInput('');
        setAddTask("");
        setEmptyTitle(false);
    }
    
    const handleCancel = () => {
        if (timeInput !== '' || addTask !== '' || emptyTitle === true || emptyTime === true) {
            setTimeInput('');
            setAddTask("");
            setEmptyTitle(false)
            setEmptyTime(false)
        }
        else { navigate('/'); }
    }

    const handleAddTask = () => {
    if (!addTask.trim() && !timeInput.trim()) {
        setEmptyTitle(true);
        setEmptyTime(true);
        return;
    }
    else if (!addTask.trim()){
        setEmptyTitle(true);
        setEmptyTime(false);
        return;
    }
    else if (timeInput.toString().trim() === '') {
        setEmptyTitle(false);
        setEmptyTime(true);
        return;
    }
    
    const newTaskItem = {
        timeStamp: Number(timeInput),
        action: addTask.charAt(0).toUpperCase() + addTask.slice(1).toLowerCase(),
        isTask: true, 
        isDone: false,
        item: null
    };
    
    fetch('https://christmas-dinner-planner.onrender.com/add_task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTaskItem)
    })

    // handle response here 
    .then(res =>res.json())
    .then(newTask => {
        if (newTask?.timeStamp!==undefined && newTask?.action){
        resetAddTask(); 
        navigate('/');
        } 
        else { console.error('there was an error with task ', newTask)}
    })
    .catch(err => console.error ('Error with adding task :', err));
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

            <div className = "notepad-title" style={{fontWeight: "bold", color:'#4d0d19'}}>
                Add a Task
            </div>

            <div className = "notepad-item" sx={{ display: 'flex', alignItems: 'flex-center' }} style={{color:'#c62833'}}>
                Task:  <TextField  placeholder="Add Tasks" variant="standard" 
                margin = "none" style={{color:"grey", paddingLeft:10, width:'100%'}} slotProps={{ input:{disableUnderline:true, sx:{fontFamily: 'Handlee', fontSize:"18px", color:'#c62833'}}}}
                value = {addTask}
                onChange = {(newTask) => setAddTask(newTask.target.value)}
                />
            </div>

            <div className = "notepad-item" style={{color:'#1f654c'}}>
               <span style={{fontWeight: 'bold', paddingRight:10, marginLeft:'30px'}}> Time: </span> 
                <MinuteInput
               placeholder = {'00'}
               newValue = {timeInput}
               setNewValue = {setTimeInput}
               colour = {'#1f654c'}
               />
                minutes
            </div>
            {emptyTitle ? 
            <div className = "notepad-item" style={{color:'#c62833'}}>
                You need to add a title for your task!
            </div> : null
            }
            {emptyTime ? 
            <div className = "notepad-item" style={{color: emptyTitle ? '#1f654c' :'#c62833'}}>
                You need to add a time for your task!
            </div> : null
            }
            <div style={{display:'flex', justifyContent:'space-between', width:'80%', marginTop:'10px'}}>
                <Button style={{fontFamily:'Handlee', color:'#c62833', textTransform: 'none', fontSize:'18px'}} 
                onClick= {handleCancel}
                > 
                Cancel </Button> 
                <Button style={{fontFamily:'Handlee', color:'#1f654c', textTransform: 'none', fontSize:'18px'}}
                onClick = {handleAddTask}
                > Add </Button>
            </div>

        </div>
    </div>
    
  );
}

export default AddTasks;

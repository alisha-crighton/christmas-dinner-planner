import '../Homepage.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button'
import {useLocation, useNavigate} from 'react-router-dom';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { Link } from 'react-router-dom';
import MinuteInput from './MinuteInput';


function EditTask() {

    const navigate = useNavigate()
    const location = useLocation();

    const [newTimeStamp, setNewTimeStamp] = React.useState(location.state.task.timeStamp)
    const [newAction, setNewAction] = React.useState(location.state.task.action)
    const [emptyTitle, setEmptyTitle] = React.useState(false)
    const [emptyTime, setEmptyTime] = React.useState(false)

    const handleSaveEditTask = () => {
    if (!newAction.trim() && !newTimeStamp.trim()) {
        setEmptyTitle(true);
        setEmptyTime(true);
        return;
    }
    else if (!newAction.trim()){
        setEmptyTitle(true);
        setEmptyTime(false);
        return;
    }
    else if (!newTimeStamp.trim()) {
        setEmptyTitle(false);
        setEmptyTime(true);
        return;
    }

    const editTask = {
        id: location.state.task.id,
        timeStamp: newTimeStamp,
        action: newAction.charAt(0).toUpperCase() + newAction.slice(1).toLowerCase(), 
        isTask : true,
        isDone: location.state.task.isDone, 
        item: null
    };
    
    fetch('https://christmas-dinner-planner.onrender.com/edit_task', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editTask)
    })
    // handle response here 
    .then(res =>res.json())
    .then(data => {
        console.log('Updated task : ', data);
        location.state.refreshTasks();
        navigate('/', {state: {refresh:true}});
    })
    .catch(err => console.error ('Error with updating task :', err));
    };

    const handleDeleteTask = () => {
        const id = location.state.task.id;
        fetch(`https://christmas-dinner-planner.onrender.com/delete_task/${id}`, {
            method: "DELETE",
        })
        .then(res => res.json())
        .then (data => {
            console.log('Deleted task: ', data);
            navigate('/', {state: {refresh: true}})
        })
        .catch(err => console.error('Problem with deleting task', err));

    };

    const [isDelete, setIsDelete] = React.useState(false)

    const handleDeleteClick = () => {
        setIsDelete(true);
    }

    const handleCloseModal = () => {
        setIsDelete(false);
    }

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
                Edit Task <br/>
            </div>

            <div className = "notepad-item" style={{fontWeight: 'bold', color:'#c62833'}}>
                <TextField  placeholder={location.state.task.action}  variant="standard" multiline
                margin = "none" style={{ paddingLeft:0, width:'100%'}} slotProps={{ input:{disableUnderline:true, sx:{fontFamily: 'Handlee', fontSize:"18px", color:'#c62833'}}}}
                value = {newAction}
                onChange = {(newAction) => setNewAction(newAction.target.value)}
                /> 
                <br/> 
            </div>

            <div className = "notepad-item" style={{color:'#1f654c'}}>
               <span style={{fontWeight: 'bold', paddingRight:10, marginLeft:'30px'}}> Time: </span> 
                <MinuteInput
               placeholder = {location.state.task.timeStamp}
               newValue = {newTimeStamp}
               setNewValue = {setNewTimeStamp}
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

            {isDelete ? 
            <div>
            <div className = "notepad-item" style={{color:'#c62833'}}>
            Are you sure you want to delete this task?
            </div>
            <div style={{display:'flex', justifyContent:'space-between', width:'81%', marginTop:'10px', paddingLeft:'35px'}}>
                <Button style={{fontFamily:'Handlee', color:'#1f654c', textTransform: 'none', fontSize:'18px'}} 
                onClick= { () => {handleCloseModal()}}
                > 
                No </Button> 
                <Button style={{fontFamily:'Handlee', color:'#c62833', textTransform: 'none', fontSize:'18px'}}
                onClick = {handleDeleteTask}
                > Yes </Button>
            </div>
            </div>
            :
            <div style={{display:'flex', justifyContent:'space-between', width:'80%', marginTop:'10px'}}>
                <Button style={{fontFamily:'Handlee', color:'#c62833', textTransform: 'none', fontSize:'18px'}} 
                onClick= { () => {handleDeleteClick()}}
                > 
                Delete </Button> 
                <Button style={{fontFamily:'Handlee', color:'#1f654c', textTransform: 'none', fontSize:'18px'}}
                onClick = {handleSaveEditTask}
                > Save </Button>
            </div>
            }
        </div>
    </div>
  );
}

export default EditTask;
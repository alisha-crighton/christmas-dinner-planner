import '../Homepage.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField';
import {useNavigate} from 'react-router-dom';
import * as React from 'react';
import { Link } from 'react-router-dom';
import MinuteInput from './MinuteInput';



function AddItems() {

    const navigate = useNavigate()
    
    const [newTitle, setNewTitle] = React.useState('')
    const [newPrep, setNewPrep] = React.useState('')
    const [newBoil, setNewBoil] = React.useState('')
    const [newCook, setNewCook] = React.useState('')
    const [timeToEat, setTimeToEat] = React.useState([{id: 1, dinnerTime:'12:00'}])
    const [foodAllItems,setFoodAllItems] = React.useState([]);
    const [titleExists, setTitleExists] = React.useState(false);
    const [noTitle, setNoTitle] = React.useState(false);
    const [repeatTitle, setRepeatTitle] = React.useState('');
    
        
    const fetchFoodItems = () => {
        fetch('https://christmas-dinner-planner.onrender.com/food_items')
        .then(res => res.json())
        .then(food => setFoodAllItems(food))
        .catch(err => console.error(err));
    };

    const fetchDinnerTime = () => {
            fetch('https://christmas-dinner-planner.onrender.com/dinner_time')
            .then(res => res.json())
            .then (data =>{setTimeToEat (data)})
            .catch(err => console.error(err));
    };

    React.useState(() => {
        fetchFoodItems();
        fetchDinnerTime();
    }, []);

    const handleAddItem = () => {
        setTitleExists(false);
        setNoTitle(false);

    if (!newTitle.trim()) {
        setNoTitle(true);
        return;
    }

    if (foodAllItems.some(item => item.title === newTitle.trim().toLowerCase())) {
        setTitleExists(true);
        setRepeatTitle(newTitle);
        return;
    }

    const newFoodItem = {
        title: newTitle.trim().toLowerCase(),
        prepTime: ( newPrep === ''  ? 0 : Number(newPrep)),
        boilTime: ( newBoil === '' ? 0 : Number(newBoil)),
        cookTime: ( newCook === '' ? 0 : Number(newCook)),
        prepBefore: true
    };
    
    fetch('https://christmas-dinner-planner.onrender.com/add_item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFoodItem)
    })
    // handle response here 
    .then(res =>res.json())
    .then(data => console.log('Added item: ', data))
    .catch(err => console.error ('Error with adding task :', err));
    fetchFoodItems()
    navigate('/AllItems')

        const dinnerTimestamp = new Date("December 25, 2025 " + timeToEat[0].dinnerTime).getTime();
        let dinnerTimeMinutes = (new Date (dinnerTimestamp)).getMinutes();
        if (dinnerTimeMinutes < 10){
            dinnerTimeMinutes = "0" + dinnerTimeMinutes;}

            if (Number(newFoodItem.cookTime) !== 0)     
        {
            fetch('https://christmas-dinner-planner.onrender.com/add_task', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({"timeStamp": newFoodItem.cookTime,
                    "action": newFoodItem.title.charAt(0).toUpperCase() + newFoodItem.title.slice(1).toLowerCase() + " into oven", 
                    "isTask" : false, 
                    "isDone" : false, 
                    "item": newFoodItem.title})
            })
            // handle response here 
            .then(res =>res.json())
            .then(data => console.log('Added task: ', data))
            .catch(err => console.error ('Error with adding task :', err));
        }
            if (Number(newFoodItem.boilTime) !== 0) {
                 fetch('https://christmas-dinner-planner.onrender.com/add_task', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({"timeStamp": Number(newFoodItem.cookTime) + Number(newFoodItem.boilTime),
                    "action": "Boil " + newFoodItem.title, 
                    "isTask" : false, 
                    "isDone" : false, 
                    "item": newFoodItem.title})
            })
            // handle response here 
            .then(res =>res.json())
            .then(data => console.log('Added task: ', data))
            .catch(err => console.error ('Error with adding task :', err));
            }
            
            if (Number(newFoodItem.prepTime) !== 0) {
                 fetch('https://christmas-dinner-planner.onrender.com/add_task', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({"timeStamp": Number(newFoodItem.cookTime) + Number(newFoodItem.boilTime) + Number(newFoodItem.prepTime),
                    "action": "Prep " + newFoodItem.title, 
                    "isTask" : false, 
                    "isDone" : false, 
                    "item": newFoodItem.title})
            })
            // handle response here 
            .then(res =>res.json())
            .then(data => console.log('Added task: ', data))
            .catch(err => console.error ('Error with adding task :', err));
            }
            navigate('/AllItems');
    };

    const handleCancelItem = () => {
        if (newTitle !== '' || newPrep !== '' || newBoil !== '' || newCook !== '') {
        setNewTitle('');
        setNewPrep('');
        setNewBoil('');
        setNewCook('');
        setTitleExists(false);
        setNoTitle(false);
        }
        else { navigate ('/AllItems')}
    }

  return (
    <div className="homepage" >
        <div className = "button-row">
        <Link  to={'/AllItems'} style={{color:'#4d0d19', borderColor: 'white', marginTop:40, marginLeft:15, textDecoration: "none", display: 'flex', alignItems: 'center', fontFamily: 'Handlee', fontSize:"18px", justifyContent:'flex-start', width:'100%' }}>
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
                Add Food <br/>
            </div>

            <div className = "notepad-item" style={{fontWeight: 'bold'}}>
                <TextField  placeholder='Title'variant="standard" 
               margin = "none" style={{color:"purple", paddingLeft:0, width:'80%'}} slotProps={{ input:{disableUnderline:true, sx:{fontFamily: 'Handlee', fontSize:"18px", color:'#c62833'}}}}
               value = {newTitle}
               onChange = {(newTitleName) => setNewTitle(newTitleName.target.value)}
               /> 
            </div>

            <div className = "notepad-item" style={{color: '#1f654c'}}>
               <span style={{fontWeight: 'bold', paddingRight:10, marginLeft:'30px', color:"#1f654c"}}> Prep Time: </span> 
               <MinuteInput
               placeholder = {'00'}
               newValue = {newPrep}
               setNewValue = {setNewPrep}
               colour = {'#1f654c'}
               />
               minutes
            </div>

            <div className = "notepad-item" style={{color:'#c62833'}}>
               <span style={{fontWeight: 'bold', paddingRight:10, marginLeft:'30px'}}> Boil Time: </span> 
               <MinuteInput
               placeholder = {'00'}
               newValue = {newBoil}
               setNewValue = {setNewBoil}
               colour = {'#c62833'}
               />
               minutes
            </div>

            <div className = "notepad-item" style={{color: '#1f654c'}}>
               <span style={{fontWeight: 'bold', paddingRight:10, marginLeft:'30px'}}> Cook Time: </span> 
               <MinuteInput
               placeholder = {'00'}
               newValue = {newCook}
               setNewValue = {setNewCook}
               colour = {'#1f654c'}
               />
               minutes
            </div>
            
            {titleExists ? 
            <div className = "notepad-item" style={{color:'#c62833'}}>
                You have already added {repeatTitle.toLowerCase()} to your plate!
            </div> : null
            }
            {noTitle ? 
            <div className = "notepad-item" style={{color:'#c62833'}}>
                What are you adding to your plate?
            </div> : null
            }
            <div style={{display:'flex', justifyContent:'space-between', width:'80%', marginTop:'10px'}}>
                <Button style={{fontFamily:'Handlee', color:'#c62833', textTransform: 'none', fontSize:'18px'}} 
                onClick= { () => {handleCancelItem()}}
                > 
                Cancel </Button> 
                <Button style={{fontFamily:'Handlee', color:'#1f654c', textTransform: 'none', fontSize:'18px'}}
                onClick = {handleAddItem}
                > Add </Button>
            </div>
            
        </div>
    </div>
  );
}

export default AddItems;
import '../Homepage.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button'
import {useLocation, useNavigate} from 'react-router-dom';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { Link } from 'react-router-dom';
import MinuteInput from './MinuteInput.js'



function EditItem() {
    
    const location = useLocation();
    const navigate = useNavigate()
    const previousScreen = location.state.from

    let item = location.state.item;

    const [newTitle, setNewTitle] = React.useState(item.title.charAt(0).toUpperCase() + item.title.slice(1).toLowerCase())
    const [newPrep, setNewPrep] = React.useState(item.prepTime)
    const [newBoil, setNewBoil] = React.useState(item.boilTime)
    const [newCook, setNewCook] = React.useState(item.cookTime)
    const [timeToEat, setTimeToEat] = React.useState([{id: 1, dinnerTime:'12:00'}])
    const [titleExists, setTitleExists] = React.useState(false);
    const [repeatTitle, setRepeatTitle] = React.useState('');
    const [noTitle, setNoTitle] = React.useState(false);
    const [foodAllItems,setFoodAllItems] = React.useState([]);
    const originalTitle = item.title;
    
    
        const fetchDinnerTime = () => {
                fetch('https://christmas-dinner-planner.onrender.com/dinner_time')
                .then(res => res.json())
                .then (data =>{setTimeToEat (data)})
                .catch(err => console.error(err));
            };

        const fetchFoodItems = () => {
                fetch('https://christmas-dinner-planner.onrender.com/food_items')
                .then(res => res.json())
                .then(food => setFoodAllItems(food))
                .catch(err => console.error(err));
                };
        React.useEffect(() => {
            fetchDinnerTime();
            fetchFoodItems();
        })

    const dinnerTimestamp = new Date("December 25, 2025 " + timeToEat[0].dinnerTime).getTime();
        let dinnerTimeMinutes = (new Date (dinnerTimestamp)).getMinutes();
        if (dinnerTimeMinutes < 10){
            dinnerTimeMinutes = "0" + dinnerTimeMinutes;}

    const handleSaveEditFood = async () => {
        setTitleExists(false);
        setNoTitle(false);
    if (newPrep === item.prepTime && newBoil === item.boilTime && newCook === item.cookTime && newTitle.toLowerCase() === originalTitle.toLowerCase()) {
        navigate(previousScreen);
        return;
    }
    if (!newTitle.trim()) {
        setNoTitle(true);
        return;
    }
    if (foodAllItems.some(item => item.title.trim().toLowerCase() === newTitle.trim().toLowerCase()) && newTitle.trim().toLowerCase() !== originalTitle.trim().toLowerCase()) {
        setTitleExists(true);
        setRepeatTitle(newTitle);
        return;
    }

    const editFoodItem = {
        id: item.id,
        title: newTitle.trim().toLowerCase(),
        prepTime: newPrep!=='' ? newPrep : 0,
        boilTime: newBoil!=='' ? newBoil : 0,
        cookTime: newCook!=='' ? newCook : 0,
        prepBefore: item.prepBefore
    };
    
    fetch('https://christmas-dinner-planner.onrender.com/edit_item', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFoodItem)
    })
    // handle response here 
    .then(res =>res.json())
    .then(data => {console.log('Updated item : ', data);
        location.state.refreshTasks();
    })
    .catch(err => console.error ('Error with adding task :', err));
    fetchFoodItems();


    // Delete corresponding tasks
    const itemDel = item.title;
        await fetch(`https://christmas-dinner-planner.onrender.com/delete_item_task/${encodeURIComponent(itemDel)}`, {
            method: "DELETE",
        })
        .then(res => res.json())
        .then (data => {
            console.log('Deleted task: ', data);
        })
        .catch(err => console.error('Problem with deleting food item', err));

    // Remake corresponding tasks

    const tasksToAdd = [];
    let cookStartTime = new Date(dinnerTimestamp - (editFoodItem.cookTime*60*1000))
            let boilStartTime = new Date(dinnerTimestamp - ((Number(editFoodItem.cookTime) + Number(editFoodItem.boilTime))*60*1000))
            let prepStartTime = new Date(dinnerTimestamp - ((Number(editFoodItem.cookTime)+ Number(editFoodItem.boilTime) + Number(editFoodItem.prepTime))*60*1000))


            let cookMinutes = cookStartTime.getMinutes();
            if (cookMinutes < 10){
                cookMinutes = "0" + cookMinutes;
            }
            editFoodItem.cookStart = cookStartTime.getHours() + ":" + cookMinutes
    
            let boilMinutes = boilStartTime.getMinutes();
            if (boilMinutes < 10){
                boilMinutes = "0" + boilMinutes;
            }
            editFoodItem.boilStart = boilStartTime.getHours() + ":" + boilMinutes
    
            let prepMinutes = prepStartTime.getMinutes();
            if (prepMinutes < 10){
                prepMinutes = "0" + prepMinutes;
            }
            editFoodItem.prepStart = prepStartTime.getHours() + ":" + prepMinutes
    
            if (Number(editFoodItem.cookTime) !== 0)     
        {
            tasksToAdd.push(
                {"timeStamp": Number(editFoodItem.cookTime),
                    "action": editFoodItem.title.charAt(0).toUpperCase() + editFoodItem.title.slice(1).toLowerCase() + " into oven", 
                    "isTask" : false, 
                    "isDone" : false, 
                    "item": editFoodItem.title
                });
            // fetch('https://christmas-dinner-planner.onrender.com/add_task', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({"timeStamp": Number(editFoodItem.cookTime),
            //         "action": editFoodItem.title.charAt(0).toUpperCase() + editFoodItem.title.slice(1).toLowerCase() + " into oven", 
            //         "isTask" : false, 
            //         "isDone" : false, 
            //         "item": editFoodItem.title})
            // })
            // // handle response here 
            // .then(res =>res.json())
            // .then(data => {
            //     console.log('Added item: ', data);
            // })
            // .catch(err => console.error ('Error with adding task :', err));
        }
            if (Number(editFoodItem.boilTime) !== 0) {
            //      fetch('https://christmas-dinner-planner.onrender.com/add_task', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({"timeStamp": Number(editFoodItem.cookTime) + Number(editFoodItem.boilTime), 
            //         "action": "Boil " + editFoodItem.title, 
            //         "isTask" : false, 
            //         "isDone" : false, 
            //         "item": editFoodItem.title})
            // })
            // // handle response here 
            // .then(res =>res.json())
            // .then(data => console.log('Added item: ', data))
            // .catch(err => console.error ('Error with adding task :', err));
            tasksToAdd.push(
                {"timeStamp": Number(editFoodItem.boilTime),
                    "action": "Boil " + editFoodItem.title,
                    "isTask" : false, 
                    "isDone" : false, 
                    "item": editFoodItem.title
                });
            }
            
            if (Number(editFoodItem.prepTime) !== 0) {
            //      fetch('https://christmas-dinner-planner.onrender.com/add_task', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({"timeStamp": Number(editFoodItem.cookTime) + Number(editFoodItem.boilTime) + Number(editFoodItem.prepTime),
            //         "action": "Prep " + editFoodItem.title, 
            //         "isTask" : false, 
            //         "isDone" : false, 
            //         "item": editFoodItem.title})
            // })
            // // handle response here 
            // .then(res =>res.json())
            // .then(data => console.log('Added item: ', data))
            // .catch(err => console.error ('Error with adding task :', err));
            tasksToAdd.push(
                {"timeStamp": Number(editFoodItem.prepTime),
                    "action": "Prep " + editFoodItem.title,
                    "isTask" : false, 
                    "isDone" : false, 
                    "item": editFoodItem.title
                });
        }

        for (const task in tasksToAdd) {
            await fetch('https://christmas-dinner-planner.onrender.com/add_task', {
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task)
            })
            .then(res=>res.json());
        }
        location.state.refreshTasks();
        navigate(previousScreen, {state: {refresh: true}});

    };


    const [isDelete, setIsDelete] = React.useState (false);

    const handleDeleteClick = () => {
        setIsDelete(true);
    }
    
    const  handleCloseModal = () => {
        setIsDelete(false);
    }

    const handleDeleteItem = () => {
        const id = item.id;
        fetch(`https://christmas-dinner-planner.onrender.com/delete_item/${id}`, {
            method: "DELETE",
        })
        .then(res => res.json())
        .catch(err => console.error('Problem with deleting food item', err));

        const itemDel = item.title;
        fetch(`https://christmas-dinner-planner.onrender.com/delete_item_task/${encodeURIComponent(itemDel)}`, {
            method: "DELETE",
        })
        .then(res => res.json())
        .then (data => {
            console.log('Deleted item: ', data);
            fetchFoodItems();
            navigate(previousScreen, {state: {refresh: true}})
        })
        .catch(err => console.error('Problem with deleting food item', err));
    }
    
  return (
    <div className="homepage" >
        <div className = "button-row">
        <Link  to={previousScreen} style={{color:'#4d0d19', borderColor: 'white', marginTop:40, marginLeft:15, textDecoration: "none", display: 'flex', alignItems: 'center', fontFamily: 'Handlee', fontSize:"18px", justifyContent:'flex-start', width:'100%' }}>
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
                Edit Timings <br/>
            </div>

            <div className = "notepad-item" style={{fontWeight: 'bold', color:'#c62833'}}>
                <TextField  placeholder={item.title.charAt(0).toUpperCase() + item.title.slice(1).toLowerCase()}  variant="standard" multiline
                margin = "none" style={{ paddingLeft:0, width:'80%'}} slotProps={{ input:{disableUnderline:true, sx:{fontFamily: 'Handlee', fontSize:"18px", color:'#c62833'}}}}
                value = {newTitle}
                onChange = {(newTitle) => {setNewTitle(newTitle.target.value)}}
                /> 
                <br/> 
            </div>

            <div className = "notepad-item" style={{color:'#1f654c'}}>
               <span style={{fontWeight: 'bold', paddingRight:10, marginLeft:'30px'}}> Prep Time: </span> 
               <MinuteInput
               placeholder = {item.prepTime}
               newValue = {newPrep}
               setNewValue = {setNewPrep}
               colour = {'#1f654c'}
               />
               minutes
            </div>

            <div className = "notepad-item" style={{color:'#c62833'}}>
               <span style={{fontWeight: 'bold', paddingRight:10, marginLeft:'30px'}}> Boil Time: </span> 
               <MinuteInput
               placeholder = {item.boilTime}
               newValue = {newBoil}
               setNewValue = {setNewBoil}
               colour = {'#c62833'}
               />
               minutes
            </div>

            <div className = "notepad-item" style={{color:'#1f654c'}}>
               <span style={{fontWeight: 'bold', paddingRight:10, marginLeft:'30px'}}> Cook Time: </span> 
               <MinuteInput
               placeholder = {item.cookTime}
               newValue = {newCook}
               setNewValue = {setNewCook}
               colour = {'#1f654c'}
               />
               minutes
            </div>
             {titleExists ? 
            <div className = "notepad-item" style={{color:'#c62833'}}>
                You already have {repeatTitle.toLowerCase()} on your plate!
            </div> : null
            }
            {noTitle ? 
            <div className = "notepad-item" style={{color:'#c62833'}}>
                What are you adding to your plate?
            </div> : null
            }
            {isDelete ? 
            <div>
                <div className = "notepad-item" style={{color:'#c62833'}}>
                    Are you sure you want to remove {item.title.toLowerCase()} from your plate?
                 </div>

            <div style={{display:'flex', justifyContent:'space-between', width:'81%', marginTop:'10px', paddingLeft:'35px'}}>
                <Button style={{fontFamily:'Handlee', color:'#1f654c', textTransform: 'none', fontSize:'18px'}} 
                onClick= {handleCloseModal}
                > 
                No </Button> 
                <Button style={{fontFamily:'Handlee', color:'#c62833', textTransform: 'none', fontSize:'18px'}}
                onClick = {handleDeleteItem}
                > Yes </Button>
            </div> 
            </div>         
            : 
            <div style={{display:'flex', justifyContent:'space-between', width:'80%', marginTop:'10px'}}>
                <Button style={{fontFamily:'Handlee', color:'#c62833', textTransform: 'none', fontSize:'18px'}} 
                onClick= {handleDeleteClick}
                > 
                Delete </Button> 
                <Button style={{fontFamily:'Handlee', color:'#1f654c', textTransform: 'none', fontSize:'18px'}}
                onClick = {handleSaveEditFood}
                > Save </Button>
            </div>}
        </div>
    </div>
  );
}

export default EditItem;
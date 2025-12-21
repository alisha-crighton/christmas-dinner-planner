import './Homepage.css';
import foodItems from './food-items.json'
import taskList from './task-list.json'
import {useNavigate} from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import Button from '@mui/material/Button'

function Notepad = ({title, dinnerTime, data}) => {

    const newTasks = [];

    const dinnerTimestamp = new Date("December 25, 2025 14:00:00").getTime();
    let dinnerTimeMinutes = (new Date (dinnerTimestamp)).getMinutes();
    if (dinnerTimeMinutes < 10){
        dinnerTimeMinutes = "0" + dinnerTimeMinutes;
    }
    const dinnerTime= (new Date (dinnerTimestamp)).getHours() + ":" + dinnerTimeMinutes;

    foodItems.forEach((item) => {
        let cookStartTime = new Date(dinnerTimestamp - (item.cookTime*60*1000))
        let boilStartTime = new Date(dinnerTimestamp - ((item.cookTime + item.boilTime)*60*1000))
        let prepStartTime = new Date(dinnerTimestamp - ((item.cookTime + item.boilTime + item.prepTime)*60*1000))

        let cookMinutes = cookStartTime.getMinutes();
        if (cookMinutes < 10){
            cookMinutes = "0" + cookMinutes;
        }
        item.cookStart = cookStartTime.getHours() + ":" + cookMinutes

        let boilMinutes = boilStartTime.getMinutes();
        if (boilMinutes < 10){
            boilMinutes = "0" + boilMinutes;
        }
        item.boilStart = boilStartTime.getHours() + ":" + boilMinutes

        let prepMinutes = prepStartTime.getMinutes();
        if (prepMinutes < 10){
            prepMinutes = "0" + prepMinutes;
        }
        item.prepStart = prepStartTime.getHours() + ":" + prepMinutes

        if (item.cookTime !== 0) {newTasks.push({"timeStamp": item.cookStart, "action": item.title + " into oven"})};
        if (item.boilTime !== 0) {newTasks.push({"timeStamp": item.boilStart, "action": "Boil " + item.title.toLowerCase()})};
        if (item.prepTime !== 0) {newTasks.push({"timeStamp": item.prepStart, "action": "Prep " + item.title.toLowerCase()})};

    })

    taskList.forEach((item) => {newTasks.push(item)})
    newTasks.sort((a, b) => (a.timeStamp > b.timeStamp) ? 1 : ((b.timeStamp > a.timeStamp) ? -1 : 0));

    const navigate = useNavigate()
    const handleAllItems = () => {
        navigate('/AllItems');
    }
    const handleAddTasks = () => {
        navigate('/AddTasks');
    }

  return (
    <div className="homepage" >
        <div className = "button-row">
        <Button style={{marginTop:40, display: "flex", alignItems: "center", color:'green'}} 
        onClick={handleAllItems}
        ><FormatListBulletedIcon/> All Items </Button>
        <Button 
        style={{marginTop:40, display: "flex", alignItems: "center", color:'green'}}
        onClick = {handleAddTasks}
        ><AddIcon/> Add Task </Button>
        </div>
        <div className = "notepad" style={{height:700, width:350, marginTop:30}}>
            <div className = "notepad-row">
            <div className = "notepad-holepunch"> </div>
            <div className = "notepad-holepunch"> </div>
            <div className = "notepad-holepunch"> </div>
            <div className = "notepad-holepunch"> </div>
            <div className = "notepad-holepunch"> </div>            
            <div className = "notepad-holepunch"> </div>
            <div className = "notepad-holepunch"> </div>

            </div>
            <div className = "notepad-title">
                Christmas Dinner Plan for {dinnerTime}
            </div>
            {newTasks.map ( item => (
            <div className = "notepad-item">
               <span style={{fontWeight: "bold", paddingRight:10}}>{item.timeStamp} </span> {item.action} 
            </div>
            ))}
        </div>
    </div>
  );
}

export default Notepad;

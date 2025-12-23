import '../Homepage.css';
import foodItems from '../food-items.json'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useLocation, useParams} from 'react-router-dom'
import {Link} from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import * as React from 'react';



function AllItems() {

    const location = useLocation();
    const {username} = useParams();

    const [foodAllItems,setFoodAllItems] = React.useState([]);
    
        React.useEffect(() => {
        fetch(`https://christmas-dinner-planner.onrender.com/food_items/${username}`)
            .then(res => res.json())
            .then(food => {
                const foodList = [...foodItems, ...food];
                setFoodAllItems(foodList)})
            .catch(err => console.error(err));
        }, [username]);

    foodAllItems.sort((a, b) => (a.title > b.title) ? 1 : ((a.title < b.title) ? -1 : 0));

  return (
    <div className="homepage" >
        <div className = "button-row">
        <Link  to={`/${username}`} style={{color:'#4d0d19', borderColor: 'white', marginTop:40, marginLeft:15, textDecoration: "none", display: 'flex', alignItems: 'center', fontFamily: 'Handlee', fontSize:"18px", justifyContent:'flex-start', width:'100%' }}>
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
                On {username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()}'s plate...
            </div>

            {foodAllItems.length !== 0 ? 
            (foodAllItems.map ( (item, index) => (
                <Link to={`/${username}/editItem`} state={{from: location.pathname, item: item}} style={{color:'black', textDecoration: "none"}}>
                    <div className = "notepad-item">
                        <span style={{ paddingRight:10, color: index%2 ===0 ? '#c62833' : '#1f654c'}}>{item.title.charAt(0).toUpperCase() + item.title.slice(1).toLowerCase()} </span> 
                    </div>
                </Link>
            )))
            :
            <div>
                <div className="notepad-item" sx={{ display: 'flex', alignItems: 'flex-center'}} style={{color:'#c62833'}}>
                    No foods to show!
                </div>
                <div className="notepad-item" sx={{ display: 'flex', alignItems: 'flex-center'}} style={{color:'#1f654c'}}>
                    Add some food below
                </div>
            </div>
            }

            <Link  to={`/${username}/AddItems`} style={{color:'#4d0d19', borderColor: 'white', marginTop:10, marginLeft:55, textDecoration: "none", display: 'flex', alignItems: 'flex-center', fontFamily: 'Handlee', fontSize:"18px", justifyContent:'flex-start', width:'100%' }}>
                <AddIcon sx={{color:"#4d0d19"}}/>
                Add Food
            </Link>
            
        </div>
    </div>
  );
}

export default AllItems;
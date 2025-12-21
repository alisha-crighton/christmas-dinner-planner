import '../Homepage.css';
import * as React from 'react';
import { useLocation } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
// import Button from '@mui/material/Button'
import { Link } from 'react-router-dom';
import TimeButton from './TimeEditButton.js'




function formatTime(timeStamp) {

    let formattedTime = timeStamp;

    if (Number(timeStamp.slice(0, 2)) > 12) {
        formattedTime = Number(timeStamp.slice(0, 2)) - 12 + timeStamp.slice(2) + " pm"
    }
    else if (Number(timeStamp.slice(0, 2)) === 12) {
        formattedTime = Number(timeStamp.slice(0, 2)) + timeStamp.slice(2) + " pm"
    }
    else { formattedTime = Number(timeStamp.split(":")[0]) + ":" + timeStamp.split(":")[1] + " am" }

    return (
        formattedTime
    )
}

function taskTime(dinnerTime, timeStamp) {
    const dinnerTimestamp = new Date("December 25, 2025 " + dinnerTime).getTime();
    const difference = new Date(dinnerTimestamp - (Number(timeStamp) * 60 * 1000));
    const hours = difference.getHours() > 12 ? Number(difference.getHours()) - 12 : difference.getHours();
    const minutes = difference.getMinutes() < 10 ? "0" + difference.getMinutes() : difference.getMinutes();
    const amOrPm = Number(difference.getHours()) > 11 ? " pm" : " am"
    const taskTimeStamp = hours + ":" + minutes + amOrPm;

    return (
        taskTimeStamp
    )
}

function Homepage() {

    const [timeToEat, setTimeToEat] = React.useState([{ id: 1, dinnerTime: '12:00' }])
    const [tasksList, setTasksList] = React.useState([]);
    const [foodAllItems, setFoodAllItems] = React.useState([]);
    const location = useLocation();


    const fetchDinnerTime = () => {
        fetch('https://christmas-dinner-planner.onrender.com/dinner_time')
            .then(res => res.json())
            .then(data => { setTimeToEat(data) })
            .catch(err => console.error(err));
    };

    const fetchTaskList = () => {

        fetch('https://christmas-dinner-planner.onrender.com/task_list')
            .then(res => res.json())
            .then(data => {
                const sortedTasks = [...data].sort((a, b) => (Number(a.timeStamp) < Number(b.timeStamp)) ? 1 : ((Number(b.timeStamp) < Number(a.timeStamp)) ? -1 : 0));
                setTasksList(sortedTasks)
            })
            .catch(err => console.error(err));
    };


    const fetchFoodItems = () => {
        fetch('https://christmas-dinner-planner.onrender.com/food_items')
            .then(res => res.json())
            .then(food => setFoodAllItems(food))
            .catch(err => console.error(err));
    };


    React.useEffect (() => {
        fetchDinnerTime();
        fetchTaskList();
        fetchFoodItems();
    }, []);

    React.useEffect(() => {
    if (location.state?.refresh) {
        fetchTaskList();
    }
}, [location.state]);

    const refreshTasks = () => {
    fetchTaskList();
    };

    const handleTaskDone = (item) => {

        const taskDone = {
            id: item.id,
            timeStamp: item.timeStamp,
            action: item.action,
            isTask: item.isTask,
            isDone: item.isDone == false ? true : false,
            item: item.item
        };

        setTasksList(prev =>
            prev.map(task => task.id === item.id ? taskDone : task
            )
        );

        fetch('https://christmas-dinner-planner.onrender.com/edit_task/done', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskDone)
        })
            // handle response here 
            .then(res => res.json())
            .then(data => console.log('Updated task : ', data))
            .catch(err => console.error('Error with updating task :', err));
            fetchTaskList();
    };

    console.log('tasks list is ', tasksList)

    return (
        <div className="homepage" >
            <div className="button-row" style={{ marginTop: 40 }}>
                <Link to={'/AllItems'} style={{ color: '#4d0d19', borderColor: 'white', marginLeft: 15, textDecoration: "none", display: 'flex', alignItems: 'flex-center', fontFamily: 'Handlee', fontSize: "18px", justifyContent: 'flex-start', width: '100%' }}>
                    <FormatListBulletedIcon sx={{ color: "#4d0d19", paddingRight: '7px' }} />
                    Add food to your plate
                </Link>
            </div>
            <div className="notepad" style={{ minHeight: 700, width: 350, marginTop: 30, marginBottom: 100, borderRadius: 15 }}>
                <div className="notepad-row">
                    <div className="notepad-holepunch" />
                    <div className="notepad-holepunch" />
                    <div className="notepad-holepunch" />
                    <div className="notepad-holepunch" />
                    <div className="notepad-holepunch" />
                    <div className="notepad-holepunch" />
                    <div className="notepad-holepunch" />
                </div>

                <Link to={'/EditDinnerTime'} state={timeToEat} className="notepad-title" style={{
                    fontWeight: "bold", marginBottom: '0px',
                    display: "flex", justifyContent: "center", alignItems: "center", textDecoration: "none", color: '#4d0d19'
                }}>
                    Christmas Dinner for {formatTime(timeToEat[0].dinnerTime)}
                </Link>

                {tasksList.length !== 0 ?
                    (tasksList.map((item, index) => (
                        item.isTask == true ?
                            (
                                <div className="notepad-item" style={{ color: index % 2 === 0 ? "#c62833" : "#1f654c", display: "flex" }}>
                                    <TimeButton
                                        colour={index % 2 === 0 ? "#c62833" : "#1f654c"}
                                        handleOnClick={() => handleTaskDone(item)}
                                        text={taskTime(timeToEat[0].dinnerTime, item.timeStamp)}
                                    />
                                    <Link to={'/EditTask'} state={{task:item, refreshTasks:refreshTasks}} style={{ minWidth: 0, textDecoration: item.isDone ? "line-through" : "none", color: index % 2 === 0 ? "#c62833" : "#1f654c", display: "flex", overflowWrap: "anywhere", wordBreak: "break-word", whiteSpace: "normal" }}>
                                        {item.action}
                                    </Link>
                                </div>
                            ) :
                            (
                                <div className="notepad-item" style={{ color: index % 2 === 0 ? "#c62833" : "#1f654c", display: "flex" }}>
                                    <TimeButton
                                        colour={index % 2 === 0 ? "#c62833" : "#1f654c"}
                                        handleOnClick={() => handleTaskDone(item)}
                                        text={taskTime(timeToEat[0].dinnerTime, item.timeStamp)}

                                    />

                                    <Link to={'/EditItem'} state={{ from: location.pathname, item: foodAllItems.find(food => food.title === item.item), refreshTasks:refreshTasks}} style={{ minWidth: 0, color: index % 2 === 0 ? "#c62833" : "#1f654c", textDecoration: item.isDone ? "line-through" : "none", display: "flex", overflowWrap: "anywhere", wordBreak: "break-word", whiteSpace: "normal" }}>
                                        {item.action}
                                    </Link>
                                </div>
                            )
                    )))
                    : <div>
                        <div className="notepad-item" sx={{ display: 'flex', alignItems: 'flex-center' }} style={{ color: '#c62833' }} >
                            No tasks to show!
                        </div>
                        <div className="notepad-item" sx={{ display: 'flex', alignItems: 'flex-center' }} style={{ color: '#1f654c' }} >
                            Add some food above 
                        </div>
                        <div className="notepad-item" sx={{ display: 'flex', alignItems: 'flex-center' }} style={{ color: '#c62833' }} >
                            Or add a specific task below
                        </div>
                    </div>
                }


                <Link to={'/AddTasks'} style={{ color: '#4d0d19', borderColor: 'white', marginTop: 10, marginBottom: 10, marginLeft: 55, textDecoration: "none", display: 'flex', alignItems: 'flex-center', fontFamily: 'Handlee', fontSize: "18px", justifyContent: 'flex-start', width: '100%' }}>
                    <AddIcon sx={{ color: "#4d0d19" }} />
                    Add Tasks
                </Link>


            </div>
        </div>
    );
}
export default Homepage;

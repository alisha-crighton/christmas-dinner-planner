import './App.css';
import Homepage from './Screens/Homepage.js'
import AllItems from './Screens/AllItems.js'
import AddTasks from './Screens/AddTasks.js'
import EditItem from './Screens/EditItem.js'
import AddItems from './Screens/AddItems.js'
import EditTask from './Screens/EditTask.js'
import EditDinnerTime from './Screens/EditDinnerTime.js'

import { HashRouter as Router, Routes, Route } from 'react-router-dom';

function App() {

  return(
  <Router>
    <Routes>
      <Route path="/" element = {<Homepage />}/>
      <Route path = "/AllItems" element = {<AllItems />}/>
      <Route path = "/AddTasks" element = {<AddTasks />}/>
      <Route path = "/EditItem" element = {<EditItem />}/>
      <Route path = "/AddItems" element = {<AddItems />}/>
      <Route path = "/EditTask" element = {<EditTask />}/>
      <Route path = "/EditDinnerTime" element = {<EditDinnerTime />} />

    </Routes>
  </Router>
  )
}

export default App;

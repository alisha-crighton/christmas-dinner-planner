import './App.css';
import Homepage from './Screens/Homepage.js'
import AllItems from './Screens/AllItems.js'
import AddTasks from './Screens/AddTasks.js'
import EditItem from './Screens/EditItem.js'
import AddItems from './Screens/AddItems.js'
import EditTask from './Screens/EditTask.js'
import EditDinnerTime from './Screens/EditDinnerTime.js'
import * as React from 'react';


import { HashRouter as Router, Routes, Route, useParams } from 'react-router-dom';

function UserWrapper({children}) {
  const {username} = useParams();
  return React.cloneElement(children, { username });
}

function App() {

  return(
  <Router>
    <Routes>
      <Route path="/:username" element = {<UserWrapper><Homepage /></UserWrapper>}/>
      <Route path = "/:username/AllItems" element = {<UserWrapper><AllItems /></UserWrapper>}/>
      <Route path = "/:username/AddTasks" element = {<UserWrapper><AddTasks /></UserWrapper>}/>
      <Route path = "/:username/EditItem" element = {<UserWrapper><EditItem /></UserWrapper>}/>
      <Route path = "/:username/AddItems" element = {<UserWrapper><AddItems /></UserWrapper>}/>
      <Route path = "/:username/EditTask" element = {<UserWrapper><EditTask /></UserWrapper>}/>
      <Route path = "/:username/EditDinnerTime" element = {<UserWrapper><EditDinnerTime /></UserWrapper>} />

      <Route path = "/" element = {<Homepage username = "default" /> } />
    </Routes>
  </Router>
  )
}

export default App;

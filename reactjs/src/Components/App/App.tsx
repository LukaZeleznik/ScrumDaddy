import React, {useEffect, useState} from 'react';
import './App.css';
import {AppBar} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Login from "../Login/Login";
import {Route, Switch, useHistory} from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {AccountBalanceWallet, Face} from "@material-ui/icons";
import {getUser, isAuthenticated, removeToken, removeUser} from "../../api/TokenService";
import ProjectList from "../ProjectList/ProjectList";
import Button from "@material-ui/core/Button";
import {drawerItems} from "../../data/DrawerItems";
import ManageUsers from "../ManageUsers/ManageUsers";
import Project from "../Project/Project";
import Sprint from "../Sprint/Sprint";
import Story from "../Story/Story";
import {systemRoleTitles} from "../../data/Roles";
import {IUser} from "../ProjectList/IProjectList";

function App() {
  const [ open, setOpen ] = useState<boolean>();
  const [ user, setUser ] = useState<IUser | null>();
  const history = useHistory();

  // Redirect to login if user not logged in
  useEffect(() => {
    if(!isAuthenticated()) {
      history.push("/login");
    }
  }, []);

  // Listen to route changes
  useEffect(() => {
    const unlisten = history.listen(((location, action) => {
      setUser(getUser());
    }));
  }, []);

  const toggleDrawer = () => {
    if(isAuthenticated()) {
      setOpen(!open);
    }

    else {
      history.push("/login");
    }
  };

  const logout = () => {
    removeToken();
    removeUser();
    history.push("/login");
    setOpen(false);
  }

  return (
    <>
      <AppBar color="primary" position="static" style={{ zIndex: 1300 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
            <Face />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Scrum Daddy
          </Typography>

          {
            user !== null && user !== undefined &&
              <Typography variant="body2">
                {user.name} {user.surname} ({systemRoleTitles[user.role]})
              </Typography>
          }
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Toolbar style={{ width: 250 }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
          <div>
            <List>
              {
                drawerItems.map((item, i, index) => (
                  <ListItem button key={i} onClick={() => { history.push(item.path); toggleDrawer(); }}>
                    <ListItemIcon>
                      <AccountBalanceWallet />
                    </ListItemIcon>
                    <ListItemText primary={item.title} />
                  </ListItem>
                ))
              }
            </List>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <Button variant="contained" color="primary" onClick={logout}>LOGOUT</Button>
          </div>
        </div>
      </Drawer>

      <div className="page_container">
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route exact path="/projects">
            <ProjectList />
          </Route>
          <Route exact path="/projects/:projectId/sprints/:sprintId">
            <Sprint />
          </Route>
          <Route exact path="/projects/:projectId/sprints/:sprintId/stories/:storyId">
            <Story />
          </Route>
          <Route path="/manage_users">
            <ManageUsers />
          </Route>
          <Route path="/projects/:projectId">
            <Project />
          </Route>
        </Switch>
      </div>
    </>
  );
}

export default App;

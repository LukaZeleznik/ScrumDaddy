import React, {useEffect, useState} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import {Button} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import {Color} from "@material-ui/lab";
import {getTask, postTask, putTask} from "../../api/TaskService";
import {getUsers, getUser} from "../../api/UserService";
import {ITask, IUser, IProjectUser, IProjectDialogAssign} from "../ProjectList/IProjectList";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import {getProjectUsers} from "../../api/ProjectService";

interface IProps {
  projectId: string;
  sprintId: string;
  storyId: string;
  open: boolean;
  handleClose: () => void;
  openSnack: (message: string, severity: Color, refresh?: boolean) => void;
  editId?: string;
}

interface GUser{
  name: string,
  surname: string
}

export default ({ projectId, sprintId, storyId, open, handleClose, openSnack, editId }: IProps) => {
  const [ taskName, setTaskName ] = useState<string>("");
  const [ taskDescription, setTaskDescription ] = useState<string>("");
  const [ taskStatus, setTaskStatus ] = useState<string>("");
  const [ taskTimeEstimate, setTaskTimeEstimate] = useState<number>(0);
  const [ taskTimeLog, setTaskTimeLog ] = useState<number>(0); 
  const [ projectUsers, setProjectUsers ] = useState<IProjectUser[]>([]);
  const [ taskSuggestedUser, setTaskSuggestedUser] = useState<string>("");
  const [ taskAssignedUser, setTaskAssignedUser] = useState<string>(""); 
  
  const [ realUsers, setRealUsers] = useState<IUser[]>([]);

  // Fetch all users
  useEffect(() => {
    fetchProjectUsers();
  }, []);

  useEffect(() => {
    if(open) {
      // Fetch task and fill out the fieldss
      if(editId !== undefined) {
        fetchTask();
        fetchProjectUsers();
        shiftUsers();
      }
      else {
        fetchProjectUsers();
        setTaskName("");
        setTaskDescription("");
        setTaskTimeEstimate(0);
        setTaskSuggestedUser("");
        setTaskStatus("");
        shiftUsers();
      }
    }
  }, [ open ]);

  const fetchProjectUsers = async () => {
    const users = (await getProjectUsers(projectId)).data.data as IProjectUser[];
    setProjectUsers(users);
  }

  const shiftUsers = async () =>{
    let newIDs = [] as any;
    let newUsers2: IUser[] = [];

    const noneUser: IUser = {
      _id: "None",
      username: "None",
      name: "None",
      surname: "",
      email: "None",
      role: "None"    
    };
    newUsers2.push(noneUser);

    projectUsers.forEach((user) =>{
      if (user.userRole !== "PROD_LEAD"){
        const newId = user.userId;
        newIDs.push(newId);
      }
    })

    Promise.all(newIDs.map((id: string)  => getUser(id)))
    .then((arrayOfData) => {

      for(var i=0; i<arrayOfData.length; i++){
        var x = JSON.parse(JSON.stringify(arrayOfData[i]));
        newUsers2.push(x.data.data);
      }     
      setRealUsers(newUsers2);
    });
  } 



  const fetchTask = async () => {
    if(editId !== undefined) {
      const gottenTask = (await getTask(projectId, sprintId, storyId, editId)).data.data as ITask;

      setTaskName(gottenTask.name);
      setTaskDescription(gottenTask.description);
      setTaskTimeEstimate(gottenTask.timeEstimate);
      setTaskTimeLog(gottenTask.timeLog);
      setTaskSuggestedUser(gottenTask.suggestedUser);
      setTaskAssignedUser(gottenTask.assignedUser);
      setTaskStatus(gottenTask.status);
    }
  }

  const confirmAction = async () => {

    // Edit task
    if(editId !== undefined) {
      try {
        if (taskSuggestedUser === "None"){
          await putTask(projectId, sprintId, storyId, editId, taskName, taskDescription, taskTimeEstimate, taskTimeLog, taskSuggestedUser, "None", "unassigned");
        }else{
          await putTask(projectId, sprintId, storyId, editId, taskName, taskDescription, taskTimeEstimate, taskTimeLog, taskSuggestedUser, taskSuggestedUser, "assigned");
        } 
        openSnack("Task updated successfully!", "success", true);
        handleClose();
      } catch (e) {
        let message = "Task update failed!";
        if(e && e.response && e.response.data && e.response.data.message) message = e.response.data.message;
        openSnack(message, "error");
      }
    }

    // Add task - adding tasks WORKS
    else {
      try {
        if(taskName && taskDescription && taskSuggestedUser){
          if (taskTimeEstimate <= 20 && taskTimeEstimate >= 0){
            if (taskSuggestedUser === "None"){
              await postTask(projectId, sprintId, storyId, taskName, taskDescription, taskTimeEstimate, 0, taskSuggestedUser, "None", "unassigned");
            }else{
              await postTask(projectId, sprintId, storyId, taskName, taskDescription, taskTimeEstimate, 0, taskSuggestedUser, taskSuggestedUser, "assigned");
            } 
            openSnack("Task created successfully!", "success", true);
            handleClose();
          }else{
            openSnack("Time estimation should be in range of 1 to 20 hours!", "error", true);
          }
          
        }else{
          openSnack("Please fill or set all the fields!", "error", true);
        }
      } catch (e) {
        let message = "Task creation failed!";
        if(e && e.response && e.response.data && e.response.data.message) openSnack(message, "error");
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{ editId !== undefined ? "Edit" : "Add" } Task</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Fill out the required fields to { editId !== undefined ? "edit" : "add" } a task.
        </DialogContentText>
        <TextField
          label="Task Title"
          fullWidth
          value={taskName}
          onChange={(e) => {setTaskName(e.target.value)}}
        />
        <TextField
          style={{ marginTop: 20}}
          label="Task Description"
          fullWidth
          multiline
          value={taskDescription}
          onChange={(e) => {setTaskDescription(e.target.value)}}
        />
        <TextField
          style={{ marginTop: 20, width: "40%" }}
          InputProps={{
            inputProps: { 
              min: 1, max: 20
            }
          }}
          label="Time estimate (hours)"
          type="number"
          value={taskTimeEstimate}
          onChange={(e) => {setTaskTimeEstimate(e.target.value as unknown as number)}}
        />

        { (taskStatus === "unassigned" || taskStatus === "") &&
          <>
            <FormControl style={{ display: "flex", margin: "10px 0", justifyContent: "space-between" }}>
              <InputLabel>Suggest user</InputLabel>
                <Select 
                value={taskSuggestedUser} 
                onChange={(e: any) => {setTaskSuggestedUser(e.target.value)}}
                >
                {
                  realUsers.map((user, j) => (
                    <MenuItem key={j} value={user._id}>{user.name} {user.surname}</MenuItem>             
                  ))
                }
                </Select>
            </FormControl>
          </>
        }

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={confirmAction} color="primary">
          { editId !== undefined ? "Confirm changes" : "Add" }
        </Button>
      </DialogActions>
    </Dialog>
  )
}

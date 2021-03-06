import React, {useEffect, useState} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import {Button} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import {Color} from "@material-ui/lab";
import moment, {Moment} from "moment"
import {DatePicker} from "@material-ui/pickers";
import {getSprint, postSprint, putSprint} from "../../api/SprintService";
import {ISprint} from "../ProjectList/IProjectList";

interface IProps {
  projectId: string;
  open: boolean;
  handleClose: () => void;
  openSnack: (message: string, severity: Color, refresh?: boolean) => void;
  editId?: string;
}

export default ({ projectId, open, handleClose, openSnack, editId }: IProps) => {
  const [ sprintTitle, setSprintTitle ] = useState<string>("");
  const [ sprintDescription, setSprintDescription ] = useState<string>("");
  const [ startDate, setStartDate ] = useState<Moment>(moment());
  const [ endDate, setEndDate ] = useState<Moment>(moment().add(1, "month"));
  const [ sprintVelocity, setSprintVelocity ] = useState<number>(10);

  useEffect(() => {
    if(open) {
      // Fetch sprint and fill out the fields
      if(editId !== undefined) {
        fetchSprint();
      }

      // Clear the fields
      else {
        setSprintTitle("");
        setSprintDescription("");
        setStartDate(moment());
        setEndDate(moment().add(1, "month"));
        setSprintVelocity(10);
      }
    }
  }, [ open ]);

  const fetchSprint = async () => {
    if(editId !== undefined) {
      const gottenSprint = (await getSprint(projectId, editId)).data.data as ISprint;

      setSprintTitle(gottenSprint.name);
      setSprintDescription(gottenSprint.description);
      setStartDate(moment.unix(gottenSprint.startTime));
      setEndDate(moment.unix(gottenSprint.endTime));
      setSprintVelocity(gottenSprint.velocity);
    }
  }

  const confirmAction = async () => {
    // Edit sprint
    if(editId !== undefined) {
      try {
        await putSprint(projectId, editId, sprintTitle, sprintDescription, startDate.unix(), endDate.unix(), sprintVelocity);

        openSnack("Sprint updated successfully!", "success", true);
        handleClose();
      } catch (e) {
        let message = "Sprint update failed!";
        if(e && e.response && e.response.data && e.response.data.message) message = e.response.data.message;
        openSnack(message, "error");
      }
    }

    // Add sprint
    else {
      try {
        await postSprint(projectId, sprintTitle, sprintDescription, startDate.unix(), endDate.unix(), sprintVelocity);

        openSnack("Sprint created successfully!", "success", true);
        handleClose();
      } catch (e) {
        let message = "Sprint creation failed!";
        if(e && e.response && e.response.data && e.response.data.message) message = e.response.data.message;
        openSnack(message, "error");
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{ editId !== undefined ? "Edit" : "Add" } Sprint</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Fill out the required fields to { editId !== undefined ? "edit" : "add" } a sprint.
        </DialogContentText>
        <TextField
          label="Sprint Title"
          fullWidth
          value={sprintTitle}
          onChange={(e) => {setSprintTitle(e.target.value)}}
        />
        <TextField
          style={{ marginTop: 20 }}
          label="Sprint Description"
          fullWidth
          multiline
          value={sprintDescription}
          onChange={(e) => {setSprintDescription(e.target.value)}}
        />

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
          <DatePicker
            style={{ marginRight: 10 }}
            variant="inline"
            label="Start Date"
            autoOk
            value={startDate}
            onChange={value => setStartDate(value as Moment)}
          />

          <DatePicker
            style={{ marginRight: 10 }}
            variant="inline"
            label="End Date"
            autoOk
            value={endDate}
            onChange={value => setEndDate(value as Moment)}
          />

          <TextField
            label="Sprint Velocity"
            type="number"
            value={sprintVelocity}
            onChange={(e) => {setSprintVelocity(e.target.value as unknown as number)}}
          />
        </div>

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
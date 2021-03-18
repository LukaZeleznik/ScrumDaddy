import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {IProject, ISprint, IStory} from "../ProjectList/IProjectList";
import {ArrowBackRounded, ArrowForwardRounded, DeleteRounded, EditRounded} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";
import {Button} from "@material-ui/core";
import {Color} from "@material-ui/lab/Alert";
import {getProject} from "../../api/ProjectService";
import {getSprint} from "../../api/SprintService";
import {getStories} from "../../api/UserStoriesService";
import "./sprint.css";
import moment from "moment";
import {getUserId} from "../../api/TokenService";
import {ProjectRoles} from "../../data/Roles";

interface IProjectParams {
  projectId: string;
}

interface ISprintParams {
  sprintId: string;
}

export default () => {
  const [ sprint, setSprint ] = useState<ISprint>();
  const [ project, setProject] = useState<IProject>();
  const [ stories, setStories ] = useState<IStory[]>([]);

  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");
  const [snackSeverity, setSnackSeverity] = useState<Color>("success");

  const { projectId } = useParams<IProjectParams>();
  const { sprintId } = useParams<ISprintParams>();
  
  const history = useHistory();

  useEffect(() => {
    fetchProject();
    fetchSprint();
    fetchStories();
  }, [ projectId, sprintId ]);

  const fetchProject = async () => {
    console.log(projectId)
    const gottenProject = (await getProject(projectId)).data.data as IProject;
    setProject(gottenProject);
  }

  const fetchSprint = async () => {
    const gottenSprint = (await getSprint(projectId, sprintId)).data.data as ISprint;
    setSprint(gottenSprint);
  }

  const fetchStories = async () => {
    const gottenStories = (await getStories(projectId, sprintId)).data.data as IStory[];
    setStories(gottenStories);
  }

  const back = () => {
    history.push(`/projects/${projectId}`);
  }

  const storyDetailsClick = (projectId: string, sprintId: string, storyId: string) => {
    history.push(`/stories/${projectId}/${sprintId}/${storyId}`);
  }

  const closeSnack = () => {
    setSnackOpen(false);
  }

  const openSnack = (message: string, severity: Color, refresh?: boolean) => {
    setSnackMessage(message);
    setSnackSeverity(severity);
    setSnackOpen(true);
  }

  return (
    <>
      {
        sprint !== undefined && project !== undefined &&
        <>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={snackOpen} autoHideDuration={6000} onClose={closeSnack}>
                <Alert variant="filled" onClose={closeSnack} severity={snackSeverity}>{snackMessage}</Alert>
            </Snackbar>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <IconButton size="medium" color="primary" onClick={() => back()}>
                    <ArrowBackRounded fontSize="large" />
                </IconButton>
                <div className="page_title">{sprint.name}</div>
                <IconButton size="medium" color="secondary" style={{ opacity: 0, cursor: "auto" }}>
                    <ArrowBackRounded fontSize="large" />
                </IconButton>
            </div>

            <hr style={{ margin: "30px 0" }}/>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  <div className="page_subtitle" style={{ marginBottom: 20 }}>Stories</div>
                  {
                    stories.map((story, i) => (
                      <div key={i} className="sprint_row">
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <div className="sprint_row_title">{story.name}</div>
                          <div style={{ display: "flex", marginTop: 10 }}>
                            {story.name}
                          </div>
                        </div>
                        <div className="sprint_row_icons">
                          <IconButton color="primary" onClick={() => void 0}>
                            <DeleteRounded />
                          </IconButton>
                          <IconButton color="primary" onClick={() => void 0}>
                            <EditRounded />
                          </IconButton>
                          <IconButton color="primary" onClick={() => storyDetailsClick(projectId, sprintId, story._id)}>
                            <ArrowForwardRounded />
                          </IconButton>
                        </div>
                      </div>
                    ))
                  }
                </div>
            </div>
        </>
      }
    </>
  )
}
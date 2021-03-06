import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {IProject, IProjectUser, ISprint} from "../ProjectList/IProjectList";
import {ArrowBackRounded, ArrowForwardRounded, DeleteRounded, EditRounded, WhatshotRounded} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";
import {Button} from "@material-ui/core";
import {Color} from "@material-ui/lab/Alert";
import {getProject, getProjectUser} from "../../api/ProjectService";
import {deleteSprint, getSprints} from "../../api/SprintService";
import "./project.css";
import moment from "moment"
import SprintDialog from "./SprintDialog";
import DocDialog from "./DocDialog";
import ProjectWall from "./ProjectWall";
import {getUserId} from "../../api/TokenService";
import {ProjectRoles, projectRoleTitles} from "../../data/Roles";
import ProductBacklog from "../ProductBacklog/ProductBacklog";
import Typography from "@material-ui/core/Typography";
import BurndownDialog from "./BurndownDialog";

interface IProjectParams {
  projectId: string;
}

export default () => {
  const [ project, setProject ] = useState<IProject>();
  const [ sprintDialogOpen, setSprintDialogOpen ] = useState<boolean>(false);
  const [ burndownDialogOpen, setBurndownDialogOpen ] = useState<boolean>(false);
  const [ docDialogOpen, setDocDialogOpen ] = useState<boolean>(false);
  const [ editId, setEditId ] = useState<string>();
  const [ sprints, setSprints ] = useState<ISprint[]>([]);
  const [ userRole, setUserRole ] = useState<ProjectRoles>();

  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");
  const [snackSeverity, setSnackSeverity] = useState<Color>("success");

  const { projectId } = useParams<IProjectParams>();
  const history = useHistory();

  useEffect(() => {
    fetchProject();
    fetchSprints();

    fetchProjectUser();
  }, [ projectId ]);

  const fetchProject = async () => {
    const gottenProject = (await getProject(projectId)).data.data as IProject;
    setProject(gottenProject);
  }

  const fetchSprints = async () => {
    const gottenSprints = (await getSprints(projectId)).data.data as ISprint[];
    setSprints(gottenSprints);
  }

  const fetchProjectUser = async () => {
    const userId = getUserId();
    if(userId !== null) {
      const gottenProjectUser = (await getProjectUser(projectId, userId)).data.data as IProjectUser;
      setUserRole(gottenProjectUser.userRole);
    }
  }

  const back = () => {
    history.push("/projects");
  }

  const closeSnack = () => {
    setSnackOpen(false);
  }

  const openSnack = (message: string, severity: Color, refresh?: boolean) => {
    setSnackMessage(message);
    setSnackSeverity(severity);
    setSnackOpen(true);

    if(refresh) {
      fetchSprints();
    }
  }

  const openSprintDialog = (sprintId?: string) => {
    sprintId !== undefined && setEditId(sprintId);

    setSprintDialogOpen(true);
  }

  const closeSprintDialog = () => {
    setSprintDialogOpen(false);
    setEditId(undefined);
  }

  const openBurndownDialog = () => {
    setBurndownDialogOpen(true);
  }

  const closeBurndownDialog = () => {
    setBurndownDialogOpen(false);
  }

  const sprintDetailsClick = (sprintId: string) => {
    history.push(`/projects/${projectId}/sprints/${sprintId}`);
  }

  const deleteClickedSprint = async (sprintId: string) => {
    await deleteSprint(projectId, sprintId);
    fetchSprints();
  }

  const openDocDialog = () => {
    setDocDialogOpen(true);
  }

  const closeDocDialog = () => {
    setDocDialogOpen(false);
  }

  return (
    <>
      {
        project !== undefined &&
        <>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={snackOpen} autoHideDuration={6000} onClose={closeSnack}>
                <Alert variant="filled" onClose={closeSnack} severity={snackSeverity}>{snackMessage}</Alert>
            </Snackbar>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <IconButton size="medium" color="primary" onClick={back}>
                    <ArrowBackRounded fontSize="large" />
                </IconButton>
                <div className="page_title">{project.name}</div>
                <Typography variant="body1">{ userRole !== undefined ? "Role: "+projectRoleTitles[userRole] : "" }</Typography>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>

              { (userRole === "METH_KEEPER") &&
                <>
                  <Button variant="contained" color="primary" onClick={() => openSprintDialog()}>ADD SPRINT</Button>
                </>
              }
              { /* COSMETIC FIX */}
              { (userRole !== "METH_KEEPER") &&
                <>
                  <Button variant="contained" color="default" onClick={() => void 0}>ADD SPRINT</Button>
                </>
              }

                <IconButton size="medium" color="primary" onClick={openBurndownDialog}>
                    <WhatshotRounded fontSize="large" />
                </IconButton>

                <Button variant="contained" color="primary" onClick={() => openDocDialog()}>SEE DOCUMENTATION</Button>
            </div>

            <SprintDialog projectId={projectId} open={sprintDialogOpen} handleClose={closeSprintDialog} openSnack={openSnack} editId={editId} />
            { project && <DocDialog project={project} open={docDialogOpen} handleClose={closeDocDialog} openSnack={openSnack} /> }

            { project && <BurndownDialog projectId={projectId} open={burndownDialogOpen} handleClose={closeBurndownDialog} /> }

            <hr style={{ margin: "30px 0" }}/>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  <div className="page_subtitle" style={{ marginBottom: 20 }}>Sprints</div>
                  {
                    sprints.map((sprint, i) => (
                      <div key={i} className="sprint_row">
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <div className="sprint_row_title">{sprint.name}</div>
                          <div style={{ display: "flex", marginTop: 10 }}>
                            <div style={{ marginRight: 20 }}>
                              <div className="sprint_label">Start Date:</div>
                              <div className="sprint_value">{moment.unix(sprint.startTime).format("DD.MM.YYYY")}</div>
                            </div>

                            <div style={{ marginRight: 20 }}>
                              <div className="sprint_label">End Date:</div>
                              <div className="sprint_value">{moment.unix(sprint.endTime).format("DD.MM.YYYY")}</div>
                            </div>

                            <div>
                              <div className="sprint_label">Sprint Velocity:</div>
                              <div className="sprint_value">{sprint.velocity} Points</div>
                            </div>
                          </div>
                        </div>
                        <div className="sprint_row_icons">
                          { (userRole === "METH_KEEPER") &&
                            <>
                              { (sprint.startTime >= Math.round(Date.now()/1000)) &&
                              <>
                                <IconButton color="primary" onClick={() => deleteClickedSprint(sprint._id)}>
                                  <DeleteRounded />
                                </IconButton>
                                <IconButton color="primary" onClick={() => openSprintDialog(sprint._id)}>
                                  <EditRounded />
                                </IconButton>
                              </>
                              }
                            </>
                          }
                          <IconButton color="primary" onClick={() => sprintDetailsClick(sprint._id)}>
                            <ArrowForwardRounded />
                          </IconButton>
                        </div>
                      </div>
                    ))
                  }
                
                  <hr style={{ margin: "30px 0" }}/>
                  <div style={{ display: "flex", flexDirection: "column", flex: 1}}>
                    { userRole !== undefined && <ProductBacklog projectId={projectId} userRole={userRole} openSnack={openSnack} /> }
                  </div>
                </div>

                <div className="center_divider" />

                <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  { userRole !== undefined && <ProjectWall projectId={projectId} userRole={userRole} openSnack={openSnack} /> }
                </div>
            </div>
        </>
      }
    </>
  )
}
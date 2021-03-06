import axiosAuth, {BACKEND_URL} from './axios';

export const getTasks = (projectId: string, sprintId: string, storyId: string): Promise<any> => {
  return axiosAuth.get(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}/stories/${storyId}/tasks`);
};

export const getTask = (projectId: string, sprintId: string, storyId: string, taskId: string): Promise<any> => {
  return axiosAuth.get(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}/stories/${storyId}/tasks/${taskId}`);
};

export const deleteTask = (projectId: string, sprintId: string, storyId: string, taskId: string): Promise<any> => {
  return axiosAuth.delete(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}/stories/${storyId}/tasks/${taskId}`);
};

export const putTask = (projectId: string, sprintId: string, storyId: string, taskId: string,
    name: string, description: string, timeEstimate: number, timeLog: number,
    suggestedUser: string, assignedUser: string, status: string): Promise<any> => {

  return axiosAuth.put(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}/stories/${storyId}/tasks/${taskId}`, {
    name,
    description,
    timeEstimate,
    timeLog,
    suggestedUser,
    assignedUser,
    status
  });
};

export const editTimeEstimateTask = (projectId: string, sprintId: string, storyId: string, taskId: string, timeEstimate: number): Promise<any> => {
  return axiosAuth.put(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}/stories/${storyId}/tasks/${taskId}`, {
    timeEstimate
  });
};

export const postTask = (projectId: string, sprintId: string, storyId: string,
    name: string, description: string, timeEstimate: number, timeLog: number,
    suggestedUser: string, assignedUser: string, status: string): Promise<any> => {

  return axiosAuth.post(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}/stories/${storyId}/tasks`, {
    name,
    description,
    timeEstimate,
    timeLog,
    suggestedUser,
    assignedUser,
    status
  });
};
import axiosAuth, {BACKEND_URL} from './axios';

export const getSprints = (projectId: string): Promise<any> => {
  return axiosAuth.get(`${BACKEND_URL}/projects/${projectId}/sprints`);
};

export const getSprint = (projectId: string, sprintId: string): Promise<any> => {
  return axiosAuth.get(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}`);
};

export const getStories = (projectId: string, sprintId: string): Promise<any> => {
  if(sprintId != "/") return axiosAuth.get(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}/stories`);
  else return axiosAuth.get(`${BACKEND_URL}/projects/${projectId}/stories`);
};

export const getStory = (projectId: string, sprintId: string, storyId: string): Promise<any> => {
  return axiosAuth.get(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}/stories/${storyId}`);
};

export const acceptUserStory = (projectId: string, sprintId: string, storyId: string): Promise<any> => {
  return axiosAuth.patch(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}/stories/${storyId}`, {
    status: "Accepted"
  });
};
export const rejectUserStory = (projectId: string, sprintId: string, storyId: string, newcomment: string): Promise<any> => {
  return axiosAuth.patch(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}/stories/${storyId}`, {
    comment: newcomment,
    sprintId: "/"
  });
};

export const postStory = (projectId: string, sprintId: string, name: string, timeEstimate: number): Promise<any> => {
  return axiosAuth.patch(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}/stories`, {
    name,
    timeEstimate
  });
};

export const putStory = (projectId: string, sprintId: string, taskId: string, name: string, timeEstimate: number): Promise<any> => {
  return axiosAuth.patch(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}/stories/${taskId}`, {
    name,
    timeEstimate
  });
};
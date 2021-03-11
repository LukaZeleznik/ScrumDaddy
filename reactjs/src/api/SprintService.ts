import axiosAuth, {BACKEND_URL} from './axios';

export const getSprints = (projectId: string): Promise<any> => {
  return axiosAuth.get(`${BACKEND_URL}/projects/${projectId}/sprints`);
};

export const getSprint = (projectId: string, sprintId: string): Promise<any> => {
  return axiosAuth.get(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}`);
};

export const postSprint = (projectId: string, sprintName: string, sprintDescription: string, sprintStartTime: number, sprintEndTime: number, sprintVelocity: number): Promise<any> => {
  return axiosAuth.post(`${BACKEND_URL}/projects/${projectId}/sprints`, {
    sprintName,
    sprintDescription,
    sprintStartTime,
    sprintEndTime,
    sprintVelocity
  });
};

export const putSprint = (projectId: string, sprintId: string, sprintName: string, sprintDescription: string, sprintStartTime: number, sprintEndTime: number, sprintVelocity: number): Promise<any> => {
  return axiosAuth.put(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}`, {
    sprintName,
    sprintDescription,
    sprintStartTime,
    sprintEndTime,
    sprintVelocity
  });
};

export const deleteSprint = (projectId: string, sprintId: string): Promise<any> => {
  return axiosAuth.delete(`${BACKEND_URL}/projects/${projectId}/sprints/${sprintId}`);
};
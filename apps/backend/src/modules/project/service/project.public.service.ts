import { ProjectService } from "./project.service.js";
import { ProjectRepository } from "../repository/project.repository.js";

const service = new ProjectService(new ProjectRepository());

export default {
  getProjectSandbox: service.getProjectSandbox,
};

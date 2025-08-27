import V2MsaProject, { V2MsaProjectAttributes } from '@database/models/v2/v2_msa_projec.model';

export const projectResource = (project: V2MsaProject | V2MsaProjectAttributes): V2MsaProjectAttributes => {
  return {
    id: project.id,
    msaId: project.msaId,
    project: project.project,
    teamLeader: project.teamLeader,
  };
};

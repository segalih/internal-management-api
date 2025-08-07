import { Request, Response } from 'express';
import { V2PksMsaAttributes } from '../../../database/models/v2/v2_pks_msa.model';
import { ResponseApi } from '../../../helper/interface/response.interface';
import { PksMsaV2Service } from '../../../service/v2/msa/PksMsaV2.service';
import { MsaV2Service } from '../../../service/v2/msa/msaDetailV2.service';
export class MsaDetailV2Controller {
  private pksMsaService: PksMsaV2Service;
  private msaService: MsaV2Service;

  constructor() {
    this.pksMsaService = new PksMsaV2Service();
    this.msaService = new MsaV2Service();
  }

  async create(req: Request, res: Response<ResponseApi<V2PksMsaAttributes>>): Promise<void> {}

  async update(req: Request, res: Response<ResponseApi<void>>): Promise<void> {}

  async destroy(req: Request, res: Response<ResponseApi<null>>): Promise<void> {}
}

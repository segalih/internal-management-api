import { Request, Response } from 'express';
import { ResponseApi } from '../../../helper/interface/response.interface';
import { PksMsaV2Service } from '../../../service/v2/msa/msaV2.service';
import { MsaV2Service } from '../../../service/v2/msa/msaDetailV2.service';

export class MsaDetailV2Controller {
  private pksMsaService: PksMsaV2Service;
  private msaService: MsaV2Service;

  constructor() {
    this.pksMsaService = new PksMsaV2Service();
    this.msaService = new MsaV2Service();
  }

  async create(req: Request, res: Response<ResponseApi<void>>): Promise<void> {}

  async update(req: Request, res: Response<ResponseApi<void>>): Promise<void> {}

  async destroy(req: Request, res: Response<ResponseApi<null>>): Promise<void> {}
}

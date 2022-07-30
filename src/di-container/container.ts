import "reflect-metadata";

import {Container} from "inversify";
import {IBmlsRepository} from "../repositories/bmls/ibmls.repository";
import {BmlsRepository} from "../repositories/bmls/bmls.repository";
import {IBmlsService} from "../services/ibmls.service";
import {BmlsService} from "../services/bmls.service";

export const container = new Container();

container.bind<IBmlsRepository>('BmlsRepository').to(BmlsRepository);
container.bind<IBmlsService>('BmlsService').to(BmlsService);

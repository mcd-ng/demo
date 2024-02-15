import { TribeSetting } from './tribeSetting';
import { Repository } from './repository';
import { Customer } from './customer';

export interface SystemInfo {
    tfsUrl: string;
    teamProject: string;
    customers: Customer[];
    repositories: Repository[];
    tribeSettings: TribeSetting[];
    jsonLocation: string;
}

import { Tool } from './tool-spec';
import { currentWeather } from './current-weather';
import { communityDataAccess } from './community-data-access';
import { draftEmail } from './draft-email';


export default [
    currentWeather,
    communityDataAccess,
    draftEmail
] as Tool<any>[];
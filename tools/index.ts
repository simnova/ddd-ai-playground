import { Tool } from './tool-spec';
import { currentWeather } from './current-weather';
import { communityDataAccess } from './community-data-access';


export default [
    currentWeather,
    communityDataAccess
] as Tool<any>[];
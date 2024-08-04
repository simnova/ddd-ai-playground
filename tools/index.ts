import OpenAI from "openai";
import { Tool } from "./tool-spec";
import { currentWeather } from "./current-weather";


export default [
    currentWeather
] as Tool<any>[];
import {Tool} from "../tool-spec";

type Props = {
  location: string;
  unit: string;
};

export const currentWeather:Tool<Props> = {
  toolSpecification: {
    type: "function",
    function: {
      name: "get_current_weather",
      description: "Get the current weather in a given location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "The city and state, e.g. San Francisco, CA",
          },
          unit: { type: "string", enum: ["celsius", "fahrenheit"] },
        },
        required: ["location"],
      },
    },
  },
  tool: (props:Props) => {
    const {location, unit} = props;
    if (location.toLowerCase().includes("tokyo")) {
      return JSON.stringify({ location: "Tokyo", temperature: "11", unit: "celsius" });
    } else if (location.toLowerCase().includes("san francisco")) {
      return JSON.stringify({ location: "San Francisco", temperature: "73", unit: "fahrenheit" });
    } else if (location.toLowerCase().includes("paris")) {
      return JSON.stringify({ location: "Paris", temperature: "23", unit: "fahrenheit" });
    } else {
      return JSON.stringify({ location, temperature: "unknown" });
    }
  }
}

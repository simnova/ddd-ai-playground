import {Tool} from '../tool-spec';

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
        additionalProperties: false,
      },
    },
  },
  tool: async (props:Props) =>  {
    let {location, unit} = props;
    if (!unit) {
      unit = "celsius";
    }  
    if (location.toLowerCase().includes("tokyo")) {
      const tempInCelsius = 11;
      const tempInFahrenheit = tempInCelsius * 1.8 + 32;
      return JSON.stringify({ location: "Tokyo", temperature: unit == "celsius" ? tempInCelsius: tempInFahrenheit, unit: unit });
    } else if (location.toLowerCase().includes("san francisco")) {
      const tempInFahrenheit = 73;
      const tempInCelsius = (tempInFahrenheit - 32) / 1.8;
      return JSON.stringify({ location: "San Francisco", temperature: unit == "celsius" ? tempInCelsius: tempInFahrenheit, unit: unit  });
    } else if (location.toLowerCase().includes("paris")) {
      const tempInFahrenheit = 23;
      const tempInCelsius = (tempInFahrenheit - 32) / 1.8;
      return JSON.stringify({ location: "Paris", temperature: unit == "celsius" ? tempInCelsius: tempInFahrenheit, unit: unit });
    } else {
      return JSON.stringify({ location, temperature: "unknown" });
    }
  }
}

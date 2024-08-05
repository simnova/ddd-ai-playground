import { Tool } from '../tool-spec';
import server from './server';  
import fs from 'fs';
import path from 'path'; 

type Props = {
  query: string;
};

function logErrorToFile(error: string) {
  const filePath =  path.join(path.resolve(), './tools/community-data-access/errors.txt');
  const errorMessage = `${new Date().toISOString()} - ${error}\n`;
  fs.appendFileSync(filePath, errorMessage, 'utf8');
}

export const communityDataAccess:Tool<Props> = {
  toolSpecification: {
    type: "function",
    function: {
      name: "community_data_access",
      description: "Returns community data",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: `GraphQL query extracting info to answer the question.
The Query should be written using this database schema:
    ${server.typeDefs.join("\n")}
The query should be returned in JSON. If there is an error, the response should be in the format {error: "error message"} and should be shown to the user.`,
          }
        },
        required: ["query"],
      },
    },
  },
  tool: async (props:Props) => {
    let query = props;
    try{
      
      const result  = await server.apolloInstance.executeOperation(query);
      return JSON.stringify(result);

    }catch(e){
      //write error to file (./error.log)
      logErrorToFile(`Error: ${e} -- ${server.typeDefs.join("\n")} -- Query:${query}`);
      


      return JSON.stringify({error: `Invalid query format ${e}`});
    }

  }
}

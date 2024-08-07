import { Assistant } from "../assistant-spec";
import { communityDataAccess } from "../../tools/community-data-access";
import { draftEmail } from "../../tools/draft-email";

export const data: Assistant = {
    assistantSpecification: {
        name: "Data",
        instructions: "You know all of the data the user has access to. If you run into an error show it to the user.",
        description: "Assistants that help you work with data",
    },
    tools: [
        communityDataAccess,
        draftEmail
    ],
};
import {Tool} from '../tool-spec';
import { z } from 'zod';
import { zodFunction } from 'openai/helpers/zod.mjs';

type Props = {
  subject: string;
  body: string;
  toAddresses: string[];
  ccAddresses: string[];
 bccAddresses: string[];
};

const Subject = z.string();
const Body = z.string();
const ToAddresses = z.array(z.string());
const CcAddresses = z.array(z.string());
const BccAddresses = z.array(z.string());
const DraftEmail = z.object({
    subject: Subject,
    body: Body,
    toAddresses: ToAddresses,
    ccAddresses: CcAddresses,
    bccAddresses: BccAddresses,
    });

const draftEmailFunctionSpec = zodFunction(
    {
        name: "draft_email",
        description: "Formats a draft email to send for the user to preview",
        parameters: DraftEmail,
    }
)

export const draftEmail:Tool<Props> = {
  toolSpecification: draftEmailFunctionSpec,
  tool: async (props:Props) =>  {
    let draftEmail = DraftEmail.parse(props);
    return JSON.stringify(draftEmail);
  }
}

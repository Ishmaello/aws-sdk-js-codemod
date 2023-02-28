import { CLIENT_NAMES_MAP, CLIENT_PACKAGE_NAMES_MAP } from "../../src/transforms/v2-to-v3/config";
import { CLIENTS_TO_TEST } from "./config";
import { getV3ClientsNewExpressionCode } from "./getV3ClientsNewExpressionCode";

export const getServiceRequireDeepOutput = (codegenComment: string) => {
  let content = `${codegenComment}\n`;

  for (const v2ClientName of CLIENTS_TO_TEST) {
    const v3ClientName = CLIENT_NAMES_MAP[v2ClientName];
    const v3ClientPackageName = `@aws-sdk/${CLIENT_PACKAGE_NAMES_MAP[v2ClientName]}`;
    const v3RequireKeyValuePair =
      v3ClientName === v2ClientName ? v3ClientName : `${v3ClientName}: ${v2ClientName}`;
    content += `const {\n  ${v3RequireKeyValuePair}\n} = require("${v3ClientPackageName}");\n`;
  }
  content += `\n`;
  content += getV3ClientsNewExpressionCode(CLIENTS_TO_TEST);

  return content;
};

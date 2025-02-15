import { Collection, JSCodeshift } from "jscodeshift";

import { DOCUMENT_CLIENT, DYNAMODB, DYNAMODB_DOCUMENT, DYNAMODB_DOCUMENT_CLIENT } from "../config";
import { getClientNewExpression } from "../utils";
import { getDynamoDBDocClientArgs } from "./getDynamoDBDocClientArgs";

export interface ReplaceDocClientCreationOptions {
  v2ClientName: string;
  v2ClientLocalName: string;
  v2GlobalName?: string;
}

export const replaceDocClientCreation = (
  j: JSCodeshift,
  source: Collection<unknown>,
  { v2ClientName, v2ClientLocalName, v2GlobalName }: ReplaceDocClientCreationOptions
): void => {
  if (v2ClientName !== DYNAMODB) return;

  if (v2GlobalName) {
    source
      .find(
        j.NewExpression,
        getClientNewExpression({ v2GlobalName, v2ClientName: DYNAMODB_DOCUMENT_CLIENT })
      )
      .replaceWith((v2DocClientNewExpression) =>
        j.callExpression(
          j.memberExpression(j.identifier(DYNAMODB_DOCUMENT), j.identifier("from")),
          getDynamoDBDocClientArgs(j, v2DocClientNewExpression, { v2ClientLocalName })
        )
      );
  }

  source
    .find(
      j.NewExpression,
      getClientNewExpression({ v2ClientLocalName: `${v2ClientLocalName}.${DOCUMENT_CLIENT}` })
    )
    .replaceWith((v2DocClientNewExpression) =>
      j.callExpression(
        j.memberExpression(j.identifier(DYNAMODB_DOCUMENT), j.identifier("from")),
        getDynamoDBDocClientArgs(j, v2DocClientNewExpression, { v2ClientLocalName })
      )
    );
};

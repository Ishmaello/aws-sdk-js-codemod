import { ASTPath, JSCodeshift, NewExpression, ObjectProperty, Property } from "jscodeshift";
import { OBJECT_PROPERTY_TYPE_LIST } from "../config";
import { getDynamoDBForDocClient } from "./getDynamoDBForDocClient";

export interface GetDynamoDBDocClientArgsOptions {
  v2ClientLocalName?: string;
}

export const getDynamoDBDocClientArgs = (
  j: JSCodeshift,
  v2DocClientNewExpression: ASTPath<NewExpression>,
  options: GetDynamoDBDocClientArgsOptions
) => {
  const dynamoDBDocClientOptions = j.objectExpression([]);

  const v2DocClientArgs = v2DocClientNewExpression.node.arguments || [];

  // Add DocumentClient option convertEmptyValues/wrapNumbers.
  if (v2DocClientArgs.length > 0) {
    const params = v2DocClientArgs[0];
    if (params.type === "ObjectExpression") {
      for (const property of params.properties) {
        if (!OBJECT_PROPERTY_TYPE_LIST.includes(property.type)) {
          continue;
        }

        const propertyKey = (property as Property | ObjectProperty).key;
        if (propertyKey.type !== "Identifier") {
          continue;
        }

        const docClientOptionsHash: Record<string, string> = {
          convertEmptyValues: "marshallOptions",
          wrapNumbers: "unmarshallOptions",
        };

        if (Object.keys(docClientOptionsHash).includes(propertyKey.name)) {
          dynamoDBDocClientOptions.properties.push(
            j.property(
              "init",
              j.identifier(docClientOptionsHash[propertyKey.name]),
              j.objectExpression([
                j.property(
                  "init",
                  j.identifier(propertyKey.name),
                  (property as Property | ObjectProperty).value
                ),
              ])
            )
          );
        }
      }
    }
  }

  return [
    getDynamoDBForDocClient(j, v2DocClientNewExpression, options),
    ...(dynamoDBDocClientOptions.properties.length > 0 ? [dynamoDBDocClientOptions] : []),
  ];
};

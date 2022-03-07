import { Collection, JSCodeshift } from "jscodeshift";

export const removeV2ClientImport = (
  j: JSCodeshift,
  source: Collection<any>,
  v2ClientName: string
) => {
  const importSourceName = `aws-sdk/clients/${v2ClientName.toLowerCase()}`;
  source
    .find(j.ImportDeclaration, {
      specifiers: [
        {
          local: { name: v2ClientName },
        },
      ],
      source: { value: importSourceName },
    })
    .forEach((declerationPath) => {
      // Remove import from ImportDeclaration.
      declerationPath.value.specifiers = declerationPath.value.specifiers.filter(
        (specifier) => specifier.local.name !== v2ClientName
      );
      // Remove ImportDeclaration if there are no other imports.
      if (declerationPath.value.specifiers.length === 0) {
        j(declerationPath).remove();
      }
    });
};
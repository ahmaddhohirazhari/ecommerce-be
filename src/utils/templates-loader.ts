// src/utils/template-loader.ts
import fs from 'fs';
import path from 'path';

export const loadTemplate = (
  templateName: string,
  data: Record<string, any>
) => {
  const templatePath = path.join(
    __dirname,
    `../templates/${templateName}.html`
  );
  let template = fs.readFileSync(templatePath, 'utf-8');

  // Replace placeholders
  Object.keys(data).forEach((key) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    template = template.replace(regex, data[key]);
  });

  return template;
};

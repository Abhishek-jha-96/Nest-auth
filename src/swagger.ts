import { DocumentBuilder } from '@nestjs/swagger';

export const config = new DocumentBuilder()
  .setTitle('Project Template')
  .setDescription('Project template with User crud.')
  .setVersion('1.0')
  .build();

import { ViewFileDTO } from '../modules/files/dto/view-file.dto';
import { files } from '@prisma/client';

export class FileViewMapper {
  mapOne(data: files): ViewFileDTO {
    let originalName = data.originalFileName || data.fileName;
    if (/[ÃÐÑØ]/.test(originalName)) {
      originalName = Buffer.from(originalName, 'latin1').toString('utf8');
    }

    return {
      id: data.id,
      fileName: data.fileName,
      originalFileName: originalName,
      contentType: data.contentType,
      sizeBytes: data.sizeBytes?.toString() || null,
      description: data.description,
      groupId: data.groupId,
    };
  }

  mapMany(data: files[]): ViewFileDTO[] {
    return data.map((one) => this.mapOne(one));
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { AuditInterceptor } from '../audit/interceptors/audit.interceptor';
import { AuditLog } from '../audit/decorators/audit-action.decorator';
import { UploadFileDTO } from './dto/files-upload.dto';

@Controller('files')
@UseInterceptors(AuditInterceptor)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  allFiles() {
    return this.filesService.getAll();
  }

  @Get(':id/download')
  @Header('Content-Type', 'application/octet-stream')
  @Header('Content-Disposition', 'attachment')
  async download(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const file = await this.filesService.downloadById(id);
    if (!file.fileContent) {
      throw new NotFoundException('Файл не содержит данных');
    }

    let downloadName = file.originalFileName || file.fileName;
    if (/[ÃÐÑØ]/.test(downloadName)) {
      downloadName = Buffer.from(downloadName, 'latin1').toString('utf8');
    }

    const safeFilename = encodeURIComponent(downloadName);

    res.set({
      'Content-Type': file.contentType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${safeFilename}"; filename*=UTF-8''${safeFilename}`,
      'Content-Length': file.sizeBytes?.toString() || '0',
    });

    return new StreamableFile(file.fileContent);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @AuditLog({ entityType: 'file', action: 'DELETE' })
  async delete(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    req.oldData = await this.filesService.getById(id);
    return this.filesService.delete(id);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @AuditLog({ entityType: 'file', action: 'CREATE' })
  @UseInterceptors(
    FileInterceptor('document', {
      fileFilter: (req, file, cb) => {
        const allowed = [
          'application/pdf',
          'image/jpeg',
          'image/png',
          'text/plain',
          'application/msword',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.oasis.opendocument.spreadsheet',
        ];
        if (allowed.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new Error(
              'Неверный тип файла. Разрешены: PDF, JPG, PNG, TXT, Excel файлы, Word файлы',
            ),
            false,
          );
        }
      },
      limits: { fileSize: 30 * 1024 * 1024 },
    }),
  )
  uploadedFile(
    @Body() body: UploadFileDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new NotFoundException('Файл не выбран');

    return this.filesService.create({
      fileName: body.fileName?.trim() || file.originalname,
      fileContent: file.buffer,
      contentType: file.mimetype,
      sizeBytes: file.size,
      description: body.description,
      groupId: body.groupId !== undefined ? Number(body.groupId) : null,
      originalFileName: file.originalname,
    });
  }
}

import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Header,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileDTO } from './dto/files-upload.dto';
import type { Response } from 'express';

@Controller('files')
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
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.filesService.delete(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('document'))
  uploadedFile(
    @Body() body: UploadFileDTO,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 30 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType: new RegExp(
              'application/pdf|' +
                'image/jpeg|' +
                'image/png|' +
                'text/plain|' +
                'application/msword|' +
                'application/vnd.ms-excel|' +
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document|' +
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet|' +
                'application/vnd.oasis.opendocument.spreadsheet',
            ),
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.filesService.create({
      fileName: body.fileName?.trim() || file.originalname,
      fileContent: file.buffer,
      contentType: file.mimetype,
      sizeBytes: file.size,
      description: body.description,
      groupId: body.groupId,
      originalFileName: file.originalname,
    });
  }
}

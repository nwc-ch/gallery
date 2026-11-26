import {
  Controller,
  Delete,
  HttpCode,
  Get,
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
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { SessionGuard } from '../auth/session.guard.js';
import { AdminGuard } from '../auth/admin.guard.js';
import { SameOriginGuard } from '../auth/same-origin.guard.js';
import {
  GalleryImagesService,
  MAX_IMAGE_BYTES,
} from './gallery-images.service.js';
import { GalleryImageDto, GalleryImagesDto } from './gallery-image.dto.js';

@ApiTags('Gallery images')
@ApiCookieAuth()
@ApiUnauthorizedResponse()
@ApiNotFoundResponse()
@UseGuards(SessionGuard)
@Controller('galleries/:galleryId/images')
export class GalleryImagesController {
  constructor(private readonly images: GalleryImagesService) {}

  @Get()
  @ApiOperation({ summary: 'Bilder und Vorschau-URLs einer Galerie laden' })
  @ApiOkResponse({ type: GalleryImagesDto })
  list(
    @Param('galleryId', ParseUUIDPipe) galleryId: string,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.setHeader('Cache-Control', 'no-store');
    return this.images.list(galleryId, request.session.user!);
  }

  @Post()
  @UseGuards(AdminGuard, SameOriginGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_IMAGE_BYTES, files: 1, fields: 0 },
    }),
  )
  @ApiOperation({
    summary: 'JPG mit Original und Vorschau in R2 speichern (nur Admin)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiCreatedResponse({ type: GalleryImageDto })
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  @ApiResponse({ status: 413, description: 'Datei größer als 50 MiB' })
  @ApiResponse({ status: 503, description: 'Bildspeicher nicht verfügbar' })
  upload(
    @Param('galleryId', ParseUUIDPipe) galleryId: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.images.upload(galleryId, file);
  }

  @Delete(':imageId')
  @UseGuards(AdminGuard, SameOriginGuard)
  @HttpCode(204)
  @ApiOperation({
    summary:
      'Einzelnes Bild mit Original und Vorschau aus R2 löschen (nur Admin)',
  })
  @ApiNoContentResponse()
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  @ApiResponse({
    status: 503,
    description: 'R2-Löschung fehlgeschlagen; erneut versuchen',
  })
  async remove(
    @Param('galleryId', ParseUUIDPipe) galleryId: string,
    @Param('imageId', ParseUUIDPipe) imageId: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    response.setHeader('Cache-Control', 'no-store');
    await this.images.remove(galleryId, imageId);
  }

  @Get(':imageId/preview')
  @ApiOperation({ summary: 'Verkleinerte JPG-Vorschau laden' })
  @ApiOkResponse({
    content: { 'image/jpeg': { schema: { type: 'string', format: 'binary' } } },
  })
  async preview(
    @Param('galleryId', ParseUUIDPipe) galleryId: string,
    @Param('imageId', ParseUUIDPipe) imageId: string,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.stream(galleryId, imageId, 'preview', response, request);
  }

  @Get(':imageId/original')
  @ApiOperation({ summary: 'Unverändertes JPG-Original laden' })
  @ApiOkResponse({
    content: { 'image/jpeg': { schema: { type: 'string', format: 'binary' } } },
  })
  async original(
    @Param('galleryId', ParseUUIDPipe) galleryId: string,
    @Param('imageId', ParseUUIDPipe) imageId: string,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.stream(galleryId, imageId, 'original', response, request);
  }

  private async stream(
    galleryId: string,
    imageId: string,
    version: 'preview' | 'original',
    response: Response,
    request: Request,
  ) {
    response.setHeader('Cache-Control', 'private, no-store');
    const object = await this.images.read(
      galleryId,
      imageId,
      version,
      request.session.user!,
    );
    response.setHeader('X-Content-Type-Options', 'nosniff');
    return new StreamableFile(object.stream, {
      type: 'image/jpeg',
      disposition: 'inline',
      length: object.length,
    });
  }
}

import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { SessionGuard } from '../auth/session.guard.js';
import { AdminGuard } from '../auth/admin.guard.js';
import { GalleriesService } from './galleries.service.js';
import { Gallery } from './gallery.entity.js';
import { CreateGalleryDto } from './create-gallery.dto.js';

@ApiTags('Galleries')
@ApiCookieAuth()
@ApiUnauthorizedResponse()
@UseGuards(SessionGuard)
@Controller('galleries')
export class GalleriesController {
  constructor(private readonly galleries: GalleriesService) {}

  @Get()
  @ApiOperation({ summary: 'Galerien für angemeldete Benutzer auflisten' })
  @ApiOkResponse({ type: Gallery, isArray: true })
  list(@Res({ passthrough: true }) response: Response) {
    response.setHeader('Cache-Control', 'no-store');
    return this.galleries.list();
  }

  @Post()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Galerie mit Titel anlegen (nur Admin)' })
  @ApiCreatedResponse({ type: Gallery })
  @ApiForbiddenResponse()
  @ApiBadRequestResponse()
  create(
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    body: CreateGalleryDto,
    @Req() request: Request,
  ) {
    if (request.get('X-Requested-With') !== 'Gallery')
      throw new ForbiddenException();
    return this.galleries.create(body.title, request.session.user!.id);
  }
}

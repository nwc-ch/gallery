import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Patch,
  Delete,
  HttpCode,
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
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiResponse,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { SessionGuard } from '../auth/session.guard.js';
import { AdminGuard } from '../auth/admin.guard.js';
import { GalleriesService } from './galleries.service.js';
import { Gallery } from './gallery.entity.js';
import { CreateGalleryDto } from './create-gallery.dto.js';
import { GalleryAccessService } from './gallery-access.service.js';
import {
  GalleryAccessDto,
  UpdateGalleryAccessDto,
} from './gallery-access.dto.js';
import { UsersService } from '../users/users.service.js';
import { SameOriginGuard } from '../auth/same-origin.guard.js';
import { GalleryCoverService } from './gallery-cover.service.js';
import { SetGalleryCoverDto } from './gallery-cover.dto.js';
import { GalleryManagementService } from './gallery-management.service.js';
import { CategoriesService } from './categories.service.js';
import { UpdateGalleryCategoriesDto } from './category.dto.js';
import { Category } from './category.entity.js';

@ApiTags('Galleries')
@ApiCookieAuth()
@ApiUnauthorizedResponse()
@UseGuards(SessionGuard)
@Controller('galleries')
export class GalleriesController {
  constructor(
    private readonly galleries: GalleriesService,
    private readonly access: GalleryAccessService,
    private readonly users: UsersService,
    private readonly covers: GalleryCoverService,
    private readonly management: GalleryManagementService,
    private readonly categories: CategoriesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Galerien für angemeldete Benutzer auflisten' })
  @ApiOkResponse({ type: Gallery, isArray: true })
  list(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.setHeader('Cache-Control', 'no-store');
    return this.galleries.list(request.session.user!);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Galerie laden' })
  @ApiOkResponse({ type: Gallery })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.setHeader('Cache-Control', 'no-store');
    return this.galleries.findVisible(id, request.session.user!);
  }

  @Get(':id/access')
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Registrierte Benutzer und Albumfreigaben laden (nur Admin)',
  })
  @ApiOkResponse({ type: GalleryAccessDto })
  @ApiForbiddenResponse()
  async getAccess(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<GalleryAccessDto> {
    response.setHeader('Cache-Control', 'no-store');
    await this.galleries.findOne(id);
    const [users, userIds] = await Promise.all([
      this.users.listRegistered(),
      this.access.userIds(id),
    ]);
    return { users, userIds };
  }

  @Put(':id/access')
  @UseGuards(AdminGuard, SameOriginGuard)
  @ApiOperation({ summary: 'Albumfreigaben ersetzen (nur Admin)' })
  @ApiOkResponse({ type: UpdateGalleryAccessDto })
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  async setAccess(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    body: UpdateGalleryAccessDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UpdateGalleryAccessDto> {
    response.setHeader('Cache-Control', 'no-store');
    return { userIds: await this.access.replace(id, body.userIds) };
  }

  @Put(':id/categories')
  @UseGuards(AdminGuard, SameOriginGuard)
  @ApiOperation({ summary: 'Kategorien eines Albums ersetzen (nur Admin)' })
  @ApiOkResponse({ type: Category, isArray: true })
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  setCategories(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    body: UpdateGalleryCategoriesDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.setHeader('Cache-Control', 'no-store');
    return this.categories.replace(id, body.categoryIds);
  }

  @Put(':id/cover')
  @UseGuards(AdminGuard, SameOriginGuard)
  @ApiOperation({ summary: 'Albumbild und Ausschnitt speichern (nur Admin)' })
  @ApiOkResponse({ type: Gallery })
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  setCover(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    body: SetGalleryCoverDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Gallery> {
    response.setHeader('Cache-Control', 'no-store');
    return this.covers.set(id, body);
  }

  @Patch(':id')
  @UseGuards(AdminGuard, SameOriginGuard)
  @ApiOperation({ summary: 'Albumtitel ändern (nur Admin)' })
  @ApiOkResponse({ type: Gallery })
  @ApiBadRequestResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  rename(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    body: CreateGalleryDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Gallery> {
    response.setHeader('Cache-Control', 'no-store');
    return this.management.rename(id, body.title);
  }

  @Delete(':id')
  @UseGuards(AdminGuard, SameOriginGuard)
  @HttpCode(204)
  @ApiOperation({
    summary:
      'Album einschließlich aller Bilder in R2 endgültig löschen (nur Admin)',
  })
  @ApiNoContentResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  @ApiResponse({
    status: 503,
    description: 'R2-Bereinigung fehlgeschlagen; Löschvorgang erneut versuchen',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    response.setHeader('Cache-Control', 'no-store');
    await this.management.remove(id);
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

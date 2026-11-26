import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { SessionGuard } from '../auth/session.guard.js';
import { AdminGuard } from '../auth/admin.guard.js';
import { SameOriginGuard } from '../auth/same-origin.guard.js';
import { Category } from './category.entity.js';
import { CreateCategoryDto } from './category.dto.js';
import { CategoriesService } from './categories.service.js';

@ApiTags('Categories')
@ApiCookieAuth()
@ApiUnauthorizedResponse()
@ApiForbiddenResponse()
@UseGuards(SessionGuard, AdminGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Alle Kategorien für die Albumzuweisung auflisten (nur Admin)',
  })
  @ApiOkResponse({ type: Category, isArray: true })
  list(@Res({ passthrough: true }) response: Response) {
    response.setHeader('Cache-Control', 'no-store');
    return this.categories.list();
  }

  @Post()
  @UseGuards(SameOriginGuard)
  @ApiOperation({ summary: 'Kategorie anlegen (nur Admin)' })
  @ApiCreatedResponse({ type: Category })
  @ApiBadRequestResponse()
  @ApiConflictResponse()
  create(
    @Body(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    body: CreateCategoryDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.setHeader('Cache-Control', 'no-store');
    return this.categories.create(body.name);
  }
}

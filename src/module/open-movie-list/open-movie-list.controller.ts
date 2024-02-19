import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Logger, ParseArrayPipe, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { OpenMovieListService } from './open-movie-list.service';
import { Request } from 'express';
import { OpenMovieDto } from 'src/validation/open-movie.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PermitGuard } from 'src/guards/permit.guard';
import { EmptyBodyPipe } from 'src/pipe/empty-body.pipe';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('openList')
@Controller('openList')
export class OpenMovieListController {
    constructor(
        private readonly openMovieService: OpenMovieListService,
        private readonly logger: Logger
    ){}

    @ApiBearerAuth('acc token')
    @ApiBody({ type: [OpenMovieDto] })
    @ApiOkResponse({
        description: 'successful insertions',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' },
            }
        }
    })
    @HttpCode(HttpStatus.OK)
    @Post('/insertNewOpenedMovies')
    @UsePipes(new EmptyBodyPipe(), new ValidationPipe({ transform: true }))
    @UseGuards(AuthGuard, PermitGuard)
    async insertNewOpenedMovies(@Req() req: Request, @Body(new ParseArrayPipe({ items: OpenMovieDto })) body: OpenMovieDto[]){
        const beforeTime: any = new Date()
        await this.openMovieService.insertOpenedMovies(body)
        const afterTime: any = new Date()

        const totalTime = afterTime - beforeTime

        this.logger.log(`${req.ip} ${req.method} | ${req.url}: Execution times ${totalTime} ms`)

        return {
            message: `${body.length} movies inserted`
        }
    }

    @ApiBearerAuth('acc token')
    @ApiOkResponse({
        description: 'successful fetching',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                data: {
                    oneOf: [
                        { type: 'array' },
                        { type: 'string' }
                    ]
                }
            }
        }
    })
    @HttpCode(HttpStatus.OK)
    @Get('/fetchOpenedMovies')
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseGuards(AuthGuard)
    async fetchAll(@Req() req: Request){
        const beforeTime: any = new Date()
        const results = await this.openMovieService.fetchOpenedMovies()
        const afterTime: any = new Date()

        const totalTime = afterTime - beforeTime

        this.logger.log(`${req.ip} ${req.method} | ${req.url}: Execution times ${totalTime} ms`)

        return {
            message: `${results.length} movies fetched`,
            data: results.length > 0 ? results : 'no movies opened currently'
        }
    }

    @Cron(CronExpression.EVERY_2_HOURS)
    async checkMoviesCron(){
        this.logger.log('[CRON] [START] - Generate checking expired movies')
        const beforeTime: any = new Date()
        const res = await this.openMovieService.checkExpiredAndFullMovies()
        const afterTime: any = new Date()

        const totalTime = afterTime - beforeTime

        this.logger.log(`[CRON] [FINISH] - Finish checking expired ${res.modifiedCount} movies: Execution time ${totalTime} ms`)
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async deleteMoviesCron(){
        this.logger.log('[CRON] [START] - Generate deleting expired movies')
        const beforeTime: any = new Date()
        const res = await this.openMovieService.deleteClosedMovies()
        const afterTime: any = new Date()

        const totalTime = afterTime - beforeTime

        this.logger.log(`[CRON] [FINISH] - Finish deleting expired ${res.deletedCount} movies: Execution time ${totalTime} ms`)
    }
}

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
        private readonly logger: Logger,
        private readonly cron: Logger
    ){
        this.logger = new Logger(OpenMovieListController.name)
        this.cron = new Logger('CRON')
    }

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
        const msg = `${body.length} movies inserted`
        const result = {
            message: `${body.length} movies inserted`
        }
        const afterTime: any = new Date()

        const totalTime = afterTime - beforeTime

        this.logger.log(`${req.socket.remoteAddress} HTTP/:${req.httpVersion} ${req.headers['user-agent']} - ${HttpStatus.OK} ${req.method} ${req.url} '${msg}' ${Buffer.byteLength(JSON.stringify(result))} bytes ${totalTime} ms`)

        return result
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
        const msg = `${results.length} movies fetched`
        const result = {
            message: `${results.length} movies fetched`,
            data: results.length > 0 ? results : 'no movies opened currently'
        }
        const afterTime: any = new Date()

        const totalTime = afterTime - beforeTime

        this.logger.log(`${req.socket.remoteAddress} HTTP/:${req.httpVersion} ${req.headers['user-agent']} - ${HttpStatus.OK} ${req.method} ${req.url} '${msg}' ${Buffer.byteLength(JSON.stringify(result))} bytes ${totalTime} ms`)

        return result
    }

    @Cron(CronExpression.EVERY_2_HOURS)
    async checkMoviesCron(){
        this.cron.log('[START] - Generate checking expired movies')
        const beforeTime: any = new Date()
        const res = await this.openMovieService.checkExpiredAndFullMovies()
        const afterTime: any = new Date()

        const totalTime = afterTime - beforeTime

        this.logger.log(`[FINISH] - Finish checking expired ${res.modifiedCount} movies ${totalTime} ms`)
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async deleteMoviesCron(){
        this.cron.log('[START] - Generate deleting expired movies')
        const beforeTime: any = new Date()
        const res = await this.openMovieService.deleteClosedMovies()
        const afterTime: any = new Date()

        const totalTime = afterTime - beforeTime

        this.logger.log(`[FINISH] - Finish deleting expired ${res.deletedCount} movies ${totalTime} ms`)
    }
}

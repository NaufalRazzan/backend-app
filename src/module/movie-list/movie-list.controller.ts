import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Logger, Param, ParseArrayPipe, Patch, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { MovieListService } from './movie-list.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Request } from 'express';
import { NewMovieDto } from 'src/validation/new-movie.dto';
import { Movie } from 'src/schema/movie.schema';
import { UpdateMovieDto } from 'src/validation/update-movie.dto';
import { PermitGuard } from 'src/guards/permit.guard';
import { EmptyBodyPipe } from 'src/pipe/empty-body.pipe';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('movies')
@Controller('movies')
export class MovieListController {
    constructor(
        private readonly movieService: MovieListService,
        private readonly logger: Logger
    ){
        this.logger = new Logger(MovieListController.name)
    }

    @ApiBearerAuth('acc token')
    @ApiBody({ type: [NewMovieDto] })
    @ApiOkResponse({
        description: 'succesfull insertions',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' },
            }
        }
    })
    @HttpCode(HttpStatus.OK)
    @Post('/insertMovies')
    @UsePipes(new EmptyBodyPipe(), new ValidationPipe({ transform: true }))
    @UseGuards(AuthGuard, PermitGuard)
    async insertMovies(@Req() req: Request, @Body(new ParseArrayPipe({ items: NewMovieDto })) body: NewMovieDto[]){
        const beforeTime: any = new Date()
        await this.movieService.insertMovies(body)
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
    @ApiParam({ 
        name: 'movieTitle',
        type: String,
        description: 'the title used to search a movie'
    })
    @ApiOkResponse({
        description: 'fetching movie by title',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                data: {
                    oneOf: [
                        { type: 'object' },
                        { type: 'string' }
                    ]
                }
            }
        }
    })
    @HttpCode(HttpStatus.OK)
    @Get('/searchMovies/:movieTitle')
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseGuards(AuthGuard)
    async fetchMoviesByTitle(@Req() req: Request, @Param('movieTitle') movieTitle: string){
        const beforeTime: any = new Date()
        const movie = await this.movieService.viewMovieFromTitle(movieTitle)
        const msg = `${movie ? `movie title ${movie.title} fetched` : `No movie title ${movie.title}`}`
        const result = {
            message: `movie ${movie?.title}`,
            data: movie ? movie :  `no movie with the title ${movieTitle} exist`
        }
        const afterTime: any = new Date()

        const totalTime = afterTime - beforeTime

        this.logger.log(`${req.socket.remoteAddress} HTTP/:${req.httpVersion} ${req.headers['user-agent']} - ${HttpStatus.OK} ${req.method} ${req.url} '${msg}' ${Buffer.byteLength(JSON.stringify(result))} bytes ${totalTime} ms`)

        return result
    }

    @ApiBearerAuth('acc token')
    @ApiOkResponse({
        description: 'fetching movies',
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
    @Get('/allMovies')
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseGuards(AuthGuard, PermitGuard)
    async fetchAllMovies(@Req() req: Request){
        const beforeTime: any = new Date()
        const movies = await this.movieService.getAllMovies()
        const msg = `${movies ? `${movies.length} fetched` : 'Movies database empty'}`
        const result = {
            message: `${movies.length} movies`,
            data: movies ? movies :  []
        } 
        const afterTime: any = new Date()

        const totalTime = afterTime - beforeTime

        this.logger.log(`${req.socket.remoteAddress} HTTP/:${req.httpVersion} ${req.headers['user-agent']} - ${HttpStatus.OK} ${req.method} ${req.url} '${msg}' ${Buffer.byteLength(JSON.stringify(result))} bytes ${totalTime} ms`)

        return result 
    }

    @ApiBearerAuth('acc token')
    @ApiBody({ type: [UpdateMovieDto] })
    @ApiOkResponse({
        description: 'successful updating movies',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' },
            }
        }
    })
    @HttpCode(HttpStatus.OK)
    @Patch('/updateMovies')
    @UsePipes(new EmptyBodyPipe(), new ValidationPipe({ transform: true }))
    @UseGuards(AuthGuard, PermitGuard)
    async updateMovies(@Req() req: Request, @Body(new ParseArrayPipe({ items: UpdateMovieDto })) body: UpdateMovieDto[]){
        const beforeTime: any = new Date()
        const res = await this.movieService.updateMovies(body)
        const msg = `${res.modifiedCount} updated`
        const result = {
            message: `${res.modifiedCount} movies updated`
        }
        const afterTime: any = new Date()

        const totalTime = afterTime - beforeTime

        this.logger.log(`${req.socket.remoteAddress} HTTP/:${req.httpVersion} ${req.headers['user-agent']} - ${HttpStatus.OK} ${req.method} ${req.url} '${msg}' ${Buffer.byteLength(JSON.stringify(result))} bytes ${totalTime} ms`)

        return result
    }

    @ApiBearerAuth('acc token')
    @ApiBody({ type: [String] })
    @ApiOkResponse({
        description: 'successful deleting movies',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' },
            }
        }
    })
    @HttpCode(HttpStatus.OK)
    @Delete('/removeMovies')
    @UsePipes(new EmptyBodyPipe(), new ValidationPipe({ transform: true }))
    @UseGuards(AuthGuard, PermitGuard)
    async removeMovies(@Req() req: Request, @Body() body: string[]){
        const beforeTime: any = new Date()
        const res = await this.movieService.removeMovies(body)
        const msg = `${res.deletedCount} removed`
        const result = {
            message: `${res.deletedCount} movies removed`
        }
        const afterTime: any = new Date()

        const totalTime = afterTime - beforeTime

        this.logger.log(`${req.socket.remoteAddress} HTTP/:${req.httpVersion} ${req.headers['user-agent']} - ${HttpStatus.OK} ${req.method} ${req.url} '${msg}' ${Buffer.byteLength(JSON.stringify(result))} bytes ${totalTime} ms`)

        return result
    }
}

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
    ){}

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
        const afterTime: any = new Date()

        const totalTime = afterTime - beforeTime

        this.logger.log(`${req.ip} ${HttpStatus.OK} ${req.method} | ${req.url} : ${body.length} movies inserted - Execution times ${totalTime} ms`)

        return {
            message: `${body.length} movies inserted`
        }
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
        const afterTime: any = new Date()

        const totalTime = afterTime - beforeTime

        this.logger.log(`${req.ip} ${HttpStatus.OK} ${req.method} | ${req.url} : ${movie ? `movie title ${movie.title} fetched` : `No movie title ${movie.title}`} - Execution times ${totalTime} ms`)

        return {
            message: `movie ${movie.title}`,
            data: movie ? movie :  `no movie with the title ${movieTitle} exist`
        }
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
        const afterTime: any = new Date()

        const totalTime = afterTime - beforeTime

        this.logger.log(`${req.ip} ${HttpStatus.OK} ${req.method} | ${req.url} : ${movies ? `${movies.length} fetched` : 'Movies database empty'} - Execution times ${totalTime} ms`)

        return {
            message: `${movies.length} movies`,
            data: movies ? movies :  []
        }
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
        const result = await this.movieService.updateMovies(body)
        const afterTime: any = new Date()

        const totalTime = afterTime - beforeTime

        this.logger.log(`${req.ip} ${HttpStatus.OK} ${req.method} | ${req.url} : ${result.modifiedCount} updated - Execution times ${totalTime} ms`)

        return {
            message: `${result.modifiedCount} movies updated`
        }
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
        const result = await this.movieService.removeMovies(body)
        const afterTime: any = new Date()

        const totalTime = afterTime - beforeTime

        this.logger.log(`${req.ip} ${HttpStatus.OK} ${req.method} | ${req.url} : ${result.deletedCount} removed - Execution times ${totalTime} ms`)

        return {
            message: `${result.deletedCount} movies removed`
        }
    }
}

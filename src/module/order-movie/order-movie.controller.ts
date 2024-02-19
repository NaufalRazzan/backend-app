import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Logger, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderMovieService } from './order-movie.service';
import { Request } from 'express';
import { OrderMovieDto } from 'src/validation/order-movie.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('orderMovie')
@Controller('orderMovie')
export class OrderMovieController {
    constructor(
        private readonly orderService: OrderMovieService,
        private readonly logger: Logger
    ){}

    @ApiBearerAuth('acc token')
    @ApiBody({ type: [OrderMovieDto] })
    @ApiOkResponse({
        description: 'successful insertion',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        }
    })
    @HttpCode(HttpStatus.OK)
    @Post('/createNewOrder')
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseGuards(AuthGuard)
    async createNewOrder(@Req() req: Request, @Body() body: OrderMovieDto){
        const beforeTime: any = new Date()
        await this.orderService.createOrder(body)
        const afterTime: any = new Date()

        const totalTime = afterTime - beforeTime

        this.logger.log(`${req.ip} ${req.method} | ${req.url}: Execution times ${totalTime} ms`)

        return {
            message: 'new movie order created'
        }        
    }

    @ApiBearerAuth('acc token')
    @ApiQuery({
        name: 'name',
        type: String,
        description: 'enter username'
    })
    @ApiOkResponse({
        description: 'successful fetching based on username',
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
    @Get('/viewOrderHistory')
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseGuards(AuthGuard)
    async view(@Req() req: Request, @Query('name') username: string){
        const beforeTime: any = new Date()
        const results = await this.orderService.viewOrderHistory(username)
        const afterTime: any = new Date()

        const totalTime = afterTime - beforeTime

        this.logger.log(`${req.ip} ${req.method} | ${req.url}: Execution times ${totalTime} ms`)
    
        return {
            message: `${results.length} orders fetched`,
            data: results.length > 0 ? results : 'you have not made any purchased of ordering tickets'
        }
    }

    @ApiBearerAuth('acc token')
    @ApiQuery({
        name: 'name',
        type: String,
        description: 'enter username'
    })
    @ApiQuery({
        name: 'title',
        type: String,
        description: 'enter movie title'
    })
    @ApiOkResponse({
        description: 'successful deletion',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        }
    })
    @HttpCode(HttpStatus.OK)
    @Delete('/deleteOrder')
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseGuards(AuthGuard)
    async deleteOrder(@Req() req: Request, @Query('name') name: string, @Query('title') title: string){
        const beforeTime: any = new Date()
        await this.orderService.deleteOrder(name, title)
        const afterTime: any = new Date()

        const totalTime = afterTime - beforeTime

        this.logger.log(`${req.ip} ${req.method} | ${req.url}: Execution times ${totalTime} ms`)
    
        return {
            message: `${name} has deleted movie ${title} from order history`
        }
    }
}

import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Movie, MovieDocument } from 'src/schema/movie.schema';
import { OpenMovie, OpenMovieDocument } from 'src/schema/open-movie.schema';
import { OrderMovie, OrderMovieDocument } from 'src/schema/order-movie.schema';
import { User, UserDocument } from 'src/schema/user.schema';
import { OrderMovieDto } from 'src/validation/order-movie.dto';

@Injectable()
export class OrderMovieService {
    constructor(
        @InjectModel(OpenMovie.name)
        private readonly openMovieModel: Model<OpenMovieDocument>,
        @InjectModel(OrderMovie.name)
        private readonly orderMovieModel: Model<OrderMovieDocument>,
        @InjectModel(Movie.name)
        private readonly movieModel: Model<MovieDocument>,
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,

    ){}

    /*
        1. buat order movie dari user
            - query movie ama user buat dapet id masing2
            - query openMovie berdasarkan movie_id, start_time, & finish_time
            - increment avail_seats berdasarkan 
            - total amount = openMovie.ticket_price * ticket_purchase_amount
        2. view history berdasarkan username
        3. cancel order berdasarkan movie_id
    */

    async createOrder(payload: OrderMovieDto){
        const user = await this.userModel.findOne({ userName: payload.username }).lean();
        const movie = await this.movieModel.findOne({ title: payload.title }).lean();
        const openMovie = await this.openMovieModel.findOne({
            movie_id: new Types.ObjectId(movie._id),
            start_time: new Date(payload.start_time).toISOString(),
            finish_time: new Date(payload.finish_time).toISOString()
        })

        if(!user || !movie || !openMovie){
            throw new HttpException('data not found', HttpStatus.NOT_FOUND)
        }

        if(openMovie.status === 'closed'){
            throw new BadRequestException('movie has been closed')
        }
        
        const orderPayload = {
            _id: new Types.ObjectId(),
            movie_id: movie._id,
            user_id: user._id,
            ticket_purchase_amounts: payload.ticket_purchase_amounts,
            total_amount: openMovie.ticket_price * payload.ticket_purchase_amounts,
            start_time: payload.start_time,
            finish_time: payload.finish_time,
            movie_start_time: payload.movie_start_time,
            movie_finish_time: payload.movie_finish_time
        }

        const checkExist = await this.orderMovieModel.exists(orderPayload)
        if(checkExist){
            throw new BadRequestException('same order already exists')
        }
        
        const incOpenMovie = await this.openMovieModel.updateOne(
            { movie_id: movie._id },
            {
                $inc: {
                    available_seats: payload.ticket_purchase_amounts
                },
                $set: {
                    updatedAt: new Date()
                }
            }
        );
        if(incOpenMovie.modifiedCount == 0){
            throw new HttpException('no data to be updated', HttpStatus.NOT_FOUND)
        }

        await this.orderMovieModel.create(orderPayload)
    }

    async viewOrderHistory(username: string){
        return await this.orderMovieModel.aggregate([
            {
                $lookup: {
                    from: 'movies',
                    localField: "movie_id",
                    foreignField: "_id",
                    as: "movie_details"
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user_details"
                }
            },
            {
                $unwind: "$user_details"
            },
            {
                $match: {
                    "user_details.userName": username
                }
            },
            {
                $project: {
                    movie_details: {
                        _id: 1,
                        title: 1,
                        genres: 1,
                        duration: 1,
                        rating: 1
                    },
                    user_id: 1,
                    ticket_purchase_amounts: 1,
                    total_amount: 1,
                    movie_start_time: 1,
                    movie_finish_time: 1,
                }
            },
            {
                $sort: { createdAt: 1 }
            }
        ]);
    }    

    async deleteOrder(username: string, title: string){
        const user = await this.userModel.findOne({ userName: username }).lean();
        const movie = await this.movieModel.findOne({ title: title }).lean();
        if(!user || !movie){
            throw new HttpException('data not found', HttpStatus.NOT_FOUND)
        }

        // get deleted document and immidietly delete it
        const deletedOrder = await this.orderMovieModel.findOneAndDelete({
            user_id: user._id,
            movie_id: movie._id
        }).lean()
        if(!deletedOrder){
            throw new HttpException('no order to be deleted', HttpStatus.NOT_FOUND)
        }

        // decerement avail seats
        await this.openMovieModel.updateOne(
            { 
                movie_id: movie._id,
                start_time: deletedOrder.start_time,
                finish_time: deletedOrder.finish_time
            },
            { 
                $inc: {
                    available_seats: -deletedOrder.ticket_purchase_amounts
                },
                $set: {
                    updatedAt: new Date()
                }
            }
        )
    }
}

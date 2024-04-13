import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Movie, MovieDocument } from 'src/schema/movie.schema';
import { OpenMovie, OpenMovieDocument } from 'src/schema/open-movie.schema';
import { FetchOpenedMoviesResults, OpenMovieDto } from 'src/validation/open-movie.dto';

@Injectable()
export class OpenMovieListService {
    constructor(
        @InjectModel(OpenMovie.name)
        private readonly openMovieModel: Model<OpenMovieDocument>,
        @InjectModel(Movie.name)
        private readonly movieModel: Model<MovieDocument>
    ){}

    /*
        - buat open movie list
        - fetch open movie list (dg movie schema) based start time dari next week sampe penutupan, avail seats < max seats, dan status = open lalu sort dari waktu terdekat
        - (cron) cek setiap 2 jam klo finish time > time now and avail seats = max seats
            - update status = closed
        - (cron) cek setiap hari jika status = closed:
            - delete open movie list
    */

    async insertOpenedMovies(payloads: OpenMovieDto[]){
        for(let payload of payloads){
            // check if movie_id is valid from movies collection
            const res = await this.movieModel.exists({ _id: new Types.ObjectId(payload.movie_id) });
            if(!res){
                throw new BadRequestException(`movie with the given id ${payload.movie_id.toString()} does not exists`)
            }
        }

        return await this.openMovieModel.insertMany(payloads)
    }

    async fetchOpenedMovies(){
        let  now: string = new Date().toISOString()
        let nextweek: Date  = new Date()
        nextweek.setDate(nextweek.getDate() + 7)

        const results =  await this.openMovieModel.aggregate<FetchOpenedMoviesResults>([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $gte: ["$start_time", now] },
                            { $lte: ["$finish_time", nextweek] },
                            { $lt: ["$available_seats", "$max_seats"] },
                            { $eq: ["$status", 'open'] }
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: 'movies',
                    localField: "movie_id",
                    foreignField: "_id",
                    as: 'movie_details'
                }
            },
            {
                $project: {
                    movie_details: { $arrayElemAt: ["$movie_details", 0] },
                    available_seats: 1,
                    max_seats: 1,
                    room_code: 1,
                    start_time: 1,
                    finish_time: 1,
                    ticket_price: 1,
                    status: 1
                }
            },
            {
                $sort: { start_time: 1 }
            }
        ]);

        results.forEach(movie => {
            movie.start_time = movie.start_time.toLocaleString('en-US', { month: 'long', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
            movie.finish_time = movie.finish_time.toLocaleString('en-US', { month: 'long', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        })

        return results
    }

    async checkExpiredAndFullMovies(){
        const finish_date = new Date().toISOString()

        return await this.openMovieModel.updateMany(
            {
                $expr: {
                    $or: [
                        { $lt: ['$finish_time', finish_date] },
                        { $gte: ['$available_seats', '$max_seats'] },
                    ],
                },
            },
            {
                $set: {
                    updatedAt: new Date(), 
                    status: 'closed' 
                }
            }
        )
    }

    async deleteClosedMovies(){
        return await this.openMovieModel.deleteMany(
            { status: 'closed' }
        )
    }
}

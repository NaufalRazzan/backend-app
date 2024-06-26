import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { Movie, MovieDocument } from 'src/schema/movie.schema';
import { NewMovieDto } from 'src/validation/new-movie.dto';
import { UpdateMovieDto } from 'src/validation/update-movie.dto';

@Injectable()
export class MovieListService {
    constructor(
        @InjectModel(Movie.name)
        private readonly movieModel: Model<MovieDocument>
    ){}

    async insertMovies(payloads: NewMovieDto[]){
        return await this.movieModel.insertMany(payloads)
    }

    async getAllMovies(){
        return await this.movieModel.find({})
    }

    async viewMovieFromTitle(movieTitle: string){
        return await this.movieModel.findOne({ title: movieTitle }).lean()
    }

    async updateMovies(payloads: UpdateMovieDto[]): Promise<UpdateWriteOpResult>{
        const titles: string[] = payloads.map((movie) => {
            return movie.title
        })
        const updatedData = payloads.map((data) => {
            const updateObject: Record<string, any> = {};
            if (data.rating !== undefined) {
              updateObject.rating = data.rating;
            }
            if (data.genres !== undefined) {
              updateObject.genres = data.genres;
            }
            if (data.duration !== undefined) {
              updateObject.duration = data.duration;
            }
            updateObject.updatedAt = new Date();
            return updateObject;
        })

        return await this.movieModel.updateMany(
            {
                title: {
                    $in: titles
                }
            },
            {
                $set: {
                    updatedData
                }
            },
            {
                new: true
            }
        )
    }

    async removeMovies(titles: string[]){
        return await this.movieModel.deleteMany(
            {
                title: {
                    $in: titles
                }
            }
        )
    }
}

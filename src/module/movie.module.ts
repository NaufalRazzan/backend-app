import { Logger, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Movie, MovieSchema } from "src/schema/movie.schema";
import { OpenMovie, OpenMovieSchema } from "src/schema/open-movie.schema";
import { OrderMovie, OrderMovieSchema } from "src/schema/order-movie.schema";
import { User, UserSchema } from "src/schema/user.schema";
import { MovieListController } from "./movie-list/movie-list.controller";
import { OpenMovieListController } from "./open-movie-list/open-movie-list.controller";
import { OrderMovieController } from "./order-movie/order-movie.controller";
import { MovieListService } from "./movie-list/movie-list.service";
import { OpenMovieListService } from "./open-movie-list/open-movie-list.service";
import { OrderMovieService } from "./order-movie/order-movie.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: OpenMovie.name,
                schema: OpenMovieSchema
            },
            {
                name: OrderMovie.name,
                schema: OrderMovieSchema
            },
            {
                name: Movie.name,
                schema: MovieSchema
            },
            {
                name: User.name,
                schema: UserSchema
            }
        ])
    ],
    controllers: [MovieListController, OpenMovieListController, OrderMovieController],
    providers: [
        MovieListService,
        OpenMovieListService,
        OrderMovieService,
        Logger,
    ]
})
export class MovieModule{}
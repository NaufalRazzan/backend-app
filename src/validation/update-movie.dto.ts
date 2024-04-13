import { PartialType } from "@nestjs/swagger";
import { NewMovieDto } from "./new-movie.dto";

export class UpdateMovieDto extends PartialType(NewMovieDto){
    title: string;

    genres?: string[];

    duration?: string;

    rating?: string;
}
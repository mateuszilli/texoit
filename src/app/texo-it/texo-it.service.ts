import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TexoItService {
  private path: string = 'https://tools.texoit.com/backend-java/api/movies';

  constructor(private _httpClient: HttpClient) {}

  getMovies(page: number, size: number, winner: boolean, year: number): Observable<Movies> {
    let params = `?page=${page}&size=${size}`;

    if (winner === true || winner === false) params += `&winner=${winner}`;
    if (year) params += `&year=${year}`;

    return this._httpClient.get<Movies>(this.path + params);
  }

  getStudiosWithWinCount(): Observable<Studios> {
    let params = '?projection=studios-with-win-count';
    return this._httpClient.get<Studios>(this.path + params);
  }

  getYearsWithMultipleWinners(): Observable<Years> {
    let params = '?projection=years-with-multiple-winners';

    return this._httpClient.get<Years>(this.path + params);
  }

  getMaxMinWinIntervalForProducers(): Observable<Producers> {
    let params = '?projection=max-min-win-interval-for-producers';

    return this._httpClient.get<Producers>(this.path + params);
  }
}

export interface Movies {
  content: Movie[];
  totalElements: number;
}

export interface Movie {
  id: number;
  year: number;
  title: string;
  studios: Array<string>;
  producers: Array<string>;
  winner: boolean;
}

export interface Studios {
  studios: Studio[];
}

export interface Studio {
  name: string;
  winCount: number;
}

export interface Years {
  years: Year[];
}

export interface Year {
  year: number;
  winnerCount: number;
}

export interface Producers {
  min: Producer[];
  max: Producer[];
}

export interface Producer {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

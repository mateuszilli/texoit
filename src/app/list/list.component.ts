import { Component, ViewChild, AfterViewInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'year', 'title', 'winner'];
  exampleDatabase: MovieHttpClient | null;
  data: Movie[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _httpClient: HttpClient) {}

  ngAfterViewInit() {
    this.exampleDatabase = new MovieHttpClient(this._httpClient);

    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.exampleDatabase!.getMovies(
            this.paginator.pageIndex, 30, false, 1980
          );
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.totalElements;

          return data.content;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.data = data);
  }
}

export interface MovieApi {
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

/** An example database that the data source uses to retrieve data for the table. */
export class MovieHttpClient {
  constructor(private _httpClient: HttpClient) {}

  getMovies(page: number, size: number, winner: boolean, year: number): Observable<MovieApi> {
    const href = 'https://tools.texoit.com/backend-java/api/movies';
    const requestUrl = `${href}?page=${page}&size=${size}&winner=${winner}&year=${year}`;

    return this._httpClient.get<MovieApi>(requestUrl);
  }
}

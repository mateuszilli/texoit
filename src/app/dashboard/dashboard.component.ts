import { Component, AfterViewInit } from '@angular/core';

import { Studio, Year, Producer, Movie, TexoItService } from '../texo-it/texo-it.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
  studiosColumns: string[] = ['name', 'winCount'];
  studios: Studio[] = [];

  yearsColumns: string[] = ['year', 'winnerCount'];
  years: Year[] = [];

  producersColumns: string[] = ['producer', 'interval', 'previousWin', 'followingWin'];
  producersMin: Producer[] = [];
  producersMax: Producer[] = [];

  winner = '';
  year = 1980;
  moviesColumns: string[] = ['year', 'title', 'winner'];
  movies: Movie[] = [];

  constructor(private texoItService: TexoItService) {}

  ngAfterViewInit() {
    this.searchStudios();
    this.searchYears();
    this.searchProducers();
    this.searchMovies();
  }

  searchStudios() {
    this.texoItService!
      .getStudiosWithWinCount()
      .subscribe(data => {
        this.studios = data.studios.slice(0, 3);
      });
  }

  searchYears() {
    this.texoItService!
      .getYearsWithMultipleWinners()
      .subscribe(data => this.years = data.years);
  }

  searchProducers() {
    this.texoItService!
      .getMaxMinWinIntervalForProducers()
      .subscribe(data => {
        this.producersMin = data.min;
        this.producersMax = data.max;
      });
  }

  searchMovies() {
    const winner = Boolean(this.winner) || undefined;
    const year = Number(this.year) || undefined;

    this.texoItService
      .getMovies(0, 3, winner, year)
      .subscribe(data => this.movies = data.content);
  }
}

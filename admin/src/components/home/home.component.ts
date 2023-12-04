import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PANELS, Panel } from '../../lib/panels';
import { CardComponent } from '../card-panel/card.component';
import { CardCounterComponent } from '../card-counter/card-counter.component';
import { CurrencyService } from '../../services/currency.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardComponent, CardCounterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit{
  panels: Panel[] = PANELS;

  usersCount: number = 0;
  currencyCount: number = 0;

  loaded: boolean = false;

  constructor(
    private userService: UserService,
    private currencyService: CurrencyService
  ) {
  }
  ngOnInit(): void {
    this.userService.getUsersCount().then((count) => {
      if (count) {
        this.usersCount = count;
      }
    });
  
    this.currencyService.getCurrencys().then((count) => {
      if (count) {
        this.currencyCount = count.length;
      }
    });

    this.loaded = true;
  }
}

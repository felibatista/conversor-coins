import { CommonModule } from '@angular/common';
import { Component, Signal, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ForeingService } from 'src/app/services/foreing/foreing.service';
import { UserService } from 'src/app/services/user/user.service';
import { ConversorError } from 'src/app/types/error';
import { Foreing } from 'src/app/types/foreing';
import { getColorFromMax } from 'src/app/utils/color-from-max';

@Component({
  selector: 'conversor',
  standalone: true,
  templateUrl: './conversor.component.html',
  styleUrls: ['./conversor.component.css'],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ConversorComponent {
  foreings: any[] = [];
  from: Foreing;
  to: Foreing;
  amount: number = 0;
  result: number = 0;
  errors: ConversorError[] = [];

  totalConversions = computed(() => { return this.userService.conversions().length});
  plan = computed(() => { return this.userService.plan() });
  color = computed(() => { return getColorFromMax((this.plan().limit - this.totalConversions()), this.plan().limit) });

  conversionLimitReached = computed(() => {
    if (this.plan().limit == -1) {
      return false;
    }

    return this.totalConversions() >= this.plan().limit;
  });

  conversionRemaining = computed(() => {
    if (this.plan().limit == -1) {
      return -1;
    }

    return this.plan().limit - this.totalConversions();
  });

  constructor(private foreingService: ForeingService, private authService: AuthService, private userService: UserService) {
    this.from = {
      id: 1,
      code: 'ARS',
      name: 'Pesos Argentinos',
      value: 0.33,
      imageUrl: 'https://cdn.jsdelivr.net/gh/lipis/flag-icon-css@master/flags/4x3/ar.svg'
    }

    this.to = {
      id: 2,
      code: 'USD',
      name: 'Dolar Estadounidense',
      value: 1,
      imageUrl: 'https://cdn.jsdelivr.net/gh/lipis/flag-icon-css@master/flags/4x3/us.svg'
    }

    this.userService.getConversions().then((conversions) => {
      if (conversions) {
        this.userService.conversions.set(conversions);
      }
    });

    this.userService.getPlan().then((plan) => {
      if (plan) {
        this.userService.plan.set(plan);
      }
    });
  }

  canConvert(): boolean {
    return this.from && this.to && this.amount > 0;
  }

  setFrom(foreing: Foreing): void {
    this.from = foreing;
    this.result = 0;
    window.document.getElementById('fromDropdown')?.blur();
  }

  setTo(foreing: Foreing): void {
    this.to = foreing;
    this.result = 0;
    window.document.getElementById('toDropdown')?.blur();
  }

  async convert() {
    this.errors = [];
    const logged = await this.authService.isLogged().then((res) => res);

    if (logged == false) {
      this.errors.push({
        type: 'Auth',
        message: 'Debes estar logueado para poder convertir',
      });

      return;
    }

    if (this.conversionLimitReached()) {
      this.errors.push({
        type: 'Plan',
        message: 'Has alcanzado el límite de conversiones',
      });
    }

    if (!this.canConvert()) {
      this.errors.push({
        type: 'Form',
        message: 'Debes completar todos los campos',
      });
    }

    if (this.errors.length > 0) {
      return;
    }

    this.userService.postConversion(this.from, this.to, this.amount).then((conversion) => {
      if (conversion) {
        this.result = this.amount * this.from.value / this.to.value;
      }
    });
  }

  ngOnInit(): void {
    this.foreingService.getForeings().then((data: Array<Foreing>) => {
      data.forEach((foreing) => {
        this.foreings.push(foreing);
      });
    });
  }
}

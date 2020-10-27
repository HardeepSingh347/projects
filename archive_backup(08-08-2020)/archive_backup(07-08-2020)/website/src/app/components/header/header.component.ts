import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { User } from 'src/app/models/user.model';
import { selectUser } from 'src/app/store/auth/auth.selectors';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { logout } from 'src/app/store/auth/auth.actions';
import { AlertService } from 'src/app/helper/alert/alert.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  userDetails: Observable<User>;
  imgUrl: string;
  constructor(
    private router: Router,
    private store: Store<AppState>,
    private helperService: AlertService
  ) {}

  ngOnInit(): void {
    this.imgUrl = environment.imgUrl;
    this.userDetails = this.store.pipe(select(selectUser));
  }
  onChangeRoute() {
    this.router.navigate(['dashboard', 'profile']);
  }
  onToggleNavbar = () => {
    this.helperService.toggleNavbar();
  }
  onLogout() {
    this.store.dispatch(logout());
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store';
import {
  selectUser,
  isLoadingAuth,
  getAuthError,
} from 'src/app/store/auth/auth.selectors';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { updateProfile } from 'src/app/store/auth/auth.actions';
import { Subscription } from 'rxjs';
import { ErrorForm } from 'src/app/models/errorform.model';

@Component({
  selector: 'app-main-profile',
  templateUrl: './main-profile.component.html',
  styleUrls: ['./main-profile.component.css'],
})
export class MainProfileComponent implements OnInit, OnDestroy {
  userSubscription: Subscription;
  errorSubscription: Subscription;
  loadingSubscription: Subscription;

  loading = false;
  user: User;
  imgUrl: string;
  edit = false;
  errorLogin = false;
  loginErrors: ErrorForm;

  profileImage: File;
  profileUrl: string;
  firstname: string;
  lastname: string;
  phone: string;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.imgUrl = environment.imgUrl;
    this.route.queryParams.subscribe((params) => {
      if (params.edit) {
        this.edit = true;
      } else {
        this.edit = false;
      }
    });
    this.loadingSubscription = this.store
      .pipe(select(isLoadingAuth))
      .subscribe((loading) => {
        this.loading = loading;
      });
    this.errorSubscription = this.store
      .pipe(select(getAuthError))
      .subscribe((error) => {
        if (error) {
          this.errorLogin = true;
          this.loginErrors = error;
        }
      });
    this.userSubscription = this.store
      .pipe(select(selectUser))
      .subscribe((user) => {
        this.user = user;
        this.firstname = this.user?.firstname;
        this.lastname = this.user?.lastname;
        this.phone = this.user?.phone;
      });
  }

  onChangeProfileImage = (files: FileList) => {
    this.profileImage = files.item(0);
  }

  editProfile = () => {
    this.edit = true;
    this.router.navigate(['dashboard', 'profile'], {
      queryParams: { edit: true },
    });
  }

  onUpdateProfile = (form: NgForm) => {
    if (form.invalid) {
      return;
    }
    const formValue = form.value;
    if (this.profileImage) {
      const fd = new FormData();
      // tslint:disable-next-line: forin
      for (const key in formValue) {
        fd.append(key, formValue[key]);
      }
      fd.append('profile_image', this.profileImage);
      this.store.dispatch(updateProfile({ data: fd }));
    } else {
      this.store.dispatch(updateProfile({ data: formValue }));
    }
  }

  ngOnDestroy = () => {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
  }
}

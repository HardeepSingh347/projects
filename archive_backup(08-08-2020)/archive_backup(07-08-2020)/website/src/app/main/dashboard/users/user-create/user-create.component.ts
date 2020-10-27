import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from "@angular/core";
import { Store, select } from "@ngrx/store";
import { AppState } from "src/app/store";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { addUser, updateUser } from "src/app/store/user/user.actions";
import { ErrorForm } from "src/app/models/errorform.model";
import {
  getUserError,
  selectUserDetails,
} from "src/app/store/user/user.selectors";
import { User } from "src/app/models/user.model";
import { Subscription, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Company } from "src/app/models/company.model";
import { selectAllCompanies } from "src/app/store/company/company.selectors";
import { selectUser } from 'src/app/store/auth/auth.selectors';

@Component({
  selector: "app-user-create",
  templateUrl: "./user-create.component.html",
  styleUrls: ["./user-create.component.css"],
})
export class UserCreateComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("userForm") userForm: ElementRef<NgForm>;
  userSubscription: Subscription;
  errorSubscription: Subscription;
  authUserDetails: User;
  loading = true;
  userType: string;
  mode: string;
  role: number;
  userErrors: ErrorForm;
  selectedFile: File = null;
  imgUrl: string;

  companies$: Observable<Company[]>;

  userDetails: User;
  userId: string;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.imgUrl = environment.imgUrl;
    this.route.url.subscribe((url) => {
      this.mode = url[0].path;
    });
    this.companies$ = this.store.pipe(select(selectAllCompanies));
    if (this.mode === "edit" || this.mode === "view") {
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has("id")) {
          this.userId = paramMap.get("id");
          this.userSubscription = this.store
            .select(selectUserDetails(this.userId))
            .subscribe((data: User) => {
              if (data) {
                this.userDetails = data;
              } else {
                this.router.navigate(["dashboard", "user"]); // 404 Error
              }
            });
        } else {
          this.router.navigate(["dashboard", "user"]); // 404 Error
        }
      });
    }
    this.store.pipe(select(selectUser)).subscribe(user => {
      this.authUserDetails = user;
    })
  }

  ngAfterViewInit() {
    this.errorSubscription = this.store
      .pipe(select(getUserError))
      .subscribe((error) => {
        this.loading = false;
        if (error) {
          if (error.hasOwnProperty("type")) {
            for (const errorValue of error?.errorFields) {
              console.log(errorValue);
              switch (errorValue) {
                case "profile_image":
                  // tslint:disable-next-line: no-string-literal
                  this.userForm["form"]?.controls["profile_image"].setErrors({
                    unique: true,
                  });
                  break;
                case "email":
                  // tslint:disable-next-line: no-string-literal
                  this.userForm["form"]?.controls["email"].setErrors({
                    unique: true,
                  });
                  break;
                case "phone":
                  // tslint:disable-next-line: no-string-literal
                  this.userForm["form"]?.controls["phone"].setErrors({
                    unique: true,
                  });
                  break;
                default:
                  console.log(errorValue);
                  break;
              }
            }
          }
        }
      });
  }

  onChangeFile = (files: FileList) => {
    this.selectedFile = files.item(0);
  };

  onCreateUser = (form: NgForm) => {
    if (form.invalid) {
      return;
    }
    const formValue = form.value;
    console.log(this.authUserDetails);
    if (this.authUserDetails?.role === 1 || this.authUserDetails?.role === "1") {
      formValue.companyId = this.authUserDetails?.companyId;
      formValue.role = 2;
    }
    const fd = new FormData();
    // tslint:disable-next-line: forin
    for (const key in formValue) {
      fd.append(key, formValue[key]);
    }
    if (this.mode === "create") {
      fd.append("profile_image", this.selectedFile);
      this.store.dispatch(addUser({ data: fd }));
    } else {
      if (this.selectedFile) {
        fd.append("profile_image", this.selectedFile);
      }
      this.store.dispatch(updateUser({ data: fd, id: this.userId }));
    }
  };

  ngOnDestroy = () => {
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  };
}

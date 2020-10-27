import { Component, OnInit, Input } from "@angular/core";
import { User } from "src/app/models/user.model";
import { AppState } from "src/app/store";
import { Store, select } from "@ngrx/store";
import { selectUser } from "src/app/store/auth/auth.selectors";

@Component({
  selector: "app-side-bar",
  templateUrl: "./side-bar.component.html",
  styleUrls: ["./side-bar.component.css"],
})
export class SideBarComponent implements OnInit {
  toggledStatus: boolean;
  userDetails: User;
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.pipe(select(selectUser)).subscribe((user) => {
      this.userDetails = user;
    });
  }
}

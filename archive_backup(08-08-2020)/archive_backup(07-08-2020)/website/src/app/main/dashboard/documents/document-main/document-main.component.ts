import { Component, OnInit } from "@angular/core";
import { types } from "src/app/helper/constants/type.constant";
import { Store, select } from "@ngrx/store";
import { AppState } from "src/app/store";
import { Subscription } from "rxjs";
import { selectAllDocTypes } from "src/app/store/doc-type/doc-type.selectors";

@Component({
  selector: "app-document-main",
  templateUrl: "./document-main.component.html",
  styleUrls: ["./document-main.component.css"],
})
export class DocumentMainComponent implements OnInit {
  docTypeSubscription: Subscription;
  types = [];

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.docTypeSubscription = this.store
      .pipe(select(selectAllDocTypes))
      .subscribe((docTypes) => {
        this.types = docTypes;
      });
  }
}

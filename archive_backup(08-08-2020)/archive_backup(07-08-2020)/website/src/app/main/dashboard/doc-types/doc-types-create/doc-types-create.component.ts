import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from "@angular/core";
import { DocType } from "src/app/models/doc-type.model";
import {
  getDocTypeError,
  selectDocTypeEntity,
} from "src/app/store/doc-type/doc-type.selectors";
import {
  addDocType,
  updateDocType,
} from "src/app/store/doc-type/doc-type.actions";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { Store, select } from "@ngrx/store";
import { AppState } from "src/app/store";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";

@Component({
  selector: "app-doc-types-create",
  templateUrl: "./doc-types-create.component.html",
  styleUrls: ["./doc-types-create.component.css"],
})
export class DocTypesCreateComponent implements OnInit, OnDestroy {
  @ViewChild("docTypeForm") docTypeForm: ElementRef<NgForm>;
  loadingSubscription: Subscription;
  errorsSubscription: Subscription;
  docTypeSubscription: Subscription;

  loading = true;
  mode: string;
  docTypeDetails: DocType;
  id: string;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe((url) => {
      this.mode = url[0].path;
    });

    this.errorsSubscription = this.store
      .pipe(select(getDocTypeError))
      .subscribe((error) => {
        this.loading = false;
        if (error) {
          if (error.hasOwnProperty("type")) {
            for (const errorValue of error?.errorFields) {
              switch (errorValue) {
                default:
                  console.log(errorValue);
                  break;
              }
            }
          }
        }
      });

    if (this.mode === "edit" || this.mode === "view") {
      this.route.paramMap.subscribe((params: ParamMap) => {
        if (params.has("id")) {
          this.id = params.get("id");
          this.docTypeSubscription = this.store
            .pipe(select(selectDocTypeEntity(this.id)))
            .subscribe((docTypeDetails) => {
              if (docTypeDetails) {
                this.docTypeDetails = docTypeDetails;
              } else {
                this.router.navigate(["dashboard", "category"]);
              }
            });
        } else {
          this.router.navigate(["dashboard", "category"]);
        }
      });
    }
  }

  onCreateDocType = (form: NgForm) => {
    if (form.invalid) {
      return;
    }
    const formValues = form.value;
    console.log(formValues);
    if (this.mode === "create") {
      this.store.dispatch(addDocType({ docType: formValues }));
    } else {
      formValues._id = this.id;
      this.store.dispatch(updateDocType({ docType: formValues }));
    }
  };

  ngOnDestroy = () => {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
    if (this.errorsSubscription) {
      this.errorsSubscription.unsubscribe();
    }
    if (this.docTypeSubscription) {
      this.docTypeSubscription.unsubscribe();
    }
  };
}

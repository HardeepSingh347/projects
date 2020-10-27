import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import {
  periods,
  politicalParties,
} from "src/app/helper/constants/period.constant";
import { types } from "src/app/helper/constants/type.constant";
import { sectors } from "src/app/helper/constants/sector.constant";
import { Store, select } from "@ngrx/store";
import { AppState } from "src/app/store";
import {
  addDocument,
  updateDocument,
  downloadDocument,
  resetProgress,
} from "src/app/store/document/document.actions";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import {
  isDocumentLoading,
  selectDocumentEntity,
  selectProgress,
} from "src/app/store/document/document.selectors";
import { Subscription, Observable } from "rxjs";
import { Document } from "src/app/models/document.model";
import { environment } from "src/environments/environment";
import { Company } from "src/app/models/company.model";
import { selectAllCompanies } from "src/app/store/company/company.selectors";
import { User } from "src/app/models/user.model";
import { selectUser } from "src/app/store/auth/auth.selectors";
import { DocType } from "src/app/models/doc-type.model";
import { selectAllDocTypes } from "src/app/store/doc-type/doc-type.selectors";

@Component({
  selector: "app-document-create",
  templateUrl: "./document-create.component.html",
  styleUrls: ["./document-create.component.css"],
})
export class DocumentCreateComponent implements OnInit, OnDestroy {
  @ViewChild("documentUploadForm") documentUploadForm: ElementRef<NgForm>;
  docSubscription: Subscription;
  loadingSubscription: Subscription;
  progressSubscription: Subscription;
  docTypesSubscription: Subscription;
  userDetails: User;
  loading = true;
  periods = periods;
  types: DocType[];
  sectors = sectors;
  politicalParties = politicalParties;
  selectedFile: File = null;
  selectedPeriod = "";
  mode: string;
  docId: string;
  imgUrl: string;

  companies$: Observable<Company[]>;

  tags: string;
  documentType: string;
  type: string;
  sector: string;
  period: string;
  party: string;
  documentUrl: string;
  isProgress = false;
  progress: number;

  docDetails: Document;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.imgUrl = environment.imgUrl;
    this.store.pipe(select(selectUser)).subscribe((user) => {
      this.userDetails = user;
    });
    this.docTypesSubscription = this.store
      .pipe(select(selectAllDocTypes))
      .subscribe((docTypes) => {
        this.types = docTypes;
      });
    this.route.url.subscribe((url) => {
      this.mode = url[0].path;
    });

    this.loadingSubscription = this.store
      .pipe(select(isDocumentLoading))
      .subscribe((loading) => {
        this.loading = loading;
      });

    this.progressSubscription = this.store
      .pipe(select(selectProgress))
      .subscribe((progress) => {
        if (progress > 0) {
          this.isProgress = true;
          this.progress = progress;
        }
      });

    this.companies$ = this.store.pipe(select(selectAllCompanies));

    if (this.mode === "view" || this.mode === "edit") {
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has("id")) {
          this.docId = paramMap.get("id");
          this.docSubscription = this.store
            .select(selectDocumentEntity(this.docId))
            .subscribe((data: Document) => {
              if (data) {
                this.docDetails = data;
                this.documentUrl = data?.url;
                this.tags = data?.tags.join(", ");
                this.documentType = data?.documentType;
                this.type = data?.type;
                this.sector = data?.sector;
                this.period = data?.period.period;
                this.party = data?.period.politicalParty;
              } else {
                this.router.navigate(["dashboard", "document"]); // 404 Error
              }
            });
        } else {
          this.router.navigate(["dashboard", "document"]); // 404 Error
        }
      });
    }
  }

  onChangeFile = (files: FileList) => {
    if (files.item(0) && files.item(0).size / 1048576 > 500) {
      this.documentUploadForm["form"]?.controls["document"]?.setErrors({
        unique: true,
      });
      return;
    }
    this.selectedFile = files.item(0);
  };

  onDocumentUpload = (form: NgForm) => {
    if (form.invalid || !this.selectedFile) {
      return;
    }
    const formValue = form.value;
    if (this.userDetails?.role !== 0) {
      formValue.companyId = this.userDetails?.companyId;
    }
    if (this.mode === "edit") {
      formValue._id = this.docId;
      this.store.dispatch(updateDocument({ data: formValue }));
    } else if (this.mode === "create") {
      const fd = new FormData();
      for (const key in formValue) {
        if (key) {
          fd.append(key, formValue[key]);
        }
      }
      fd.append("document", this.selectedFile);
      this.store.dispatch(addDocument({ data: fd }));
    }
  };

  onDownloadDocument = (docId: string, docName: string) => {
    this.store.dispatch(downloadDocument({ docId, docName }));
  };

  ngOnDestroy = () => {
    this.store.dispatch(resetProgress());
    if (this.docSubscription) {
      this.docSubscription.unsubscribe();
    }
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
    if (this.progressSubscription) {
      this.progressSubscription.unsubscribe();
    }
  };
}

import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/store';
import { Store, select } from '@ngrx/store';
import {
  selectAllDocuments,
  isDocumentLoading,
} from 'src/app/store/document/document.selectors';
import {
  downloadDocument
} from 'src/app/store/document/document.actions';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { sectors } from 'src/app/helper/constants/sector.constant';
import { periods } from 'src/app/helper/constants/period.constant';

@Component({
  selector: 'app-documents-list',
  templateUrl: './documents-list.component.html',
  styleUrls: ['./documents-list.component.css'],
})
export class DocumentsListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  loadingSubscription: Subscription;
  docSubscription: Subscription;
  loading = false;
  type: string;

  // fields and dataSource
  displayedColumns: string[] = [
    'name',
    'documentType',
    'sector',
    'periodName',
    'size',
    'company',
    'user',
    'createdAt',
    'actions',
  ];
  dataSource: MatTableDataSource<any>;
  // pageinator inputs
  pageIndex: number;
  pageSize: number;
  defaultPageSize = 15;
  pageSizeOptions: number[] = [15, 25, 50];

  // paginator output
  pageEvent: PageEvent;

  // sorting
  sortField: string;
  sortOrder: 'asc' | 'desc';

  // searching and filtering
  searchKeyword: string;
  searchValue: string;

  documents = [];
  sectors: string[];
  periods: string[];
  selectedSector: string;
  selectedPeriod: string;
  selectedDay: Date;
  maxDate: Date;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource(this.documents);
  }

  ngOnInit(): void {
    this.sectors = sectors;
    this.periods = periods;
    this.maxDate = new Date();
    this.route.url.subscribe((url) => {
      this.type = url[0].path;
    });
    this.loadingSubscription = this.store
      .pipe(select(isDocumentLoading))
      .subscribe((loading) => {
        this.loading = loading;
      });

    this.route.queryParamMap.subscribe((params: ParamMap) => {
      const paramData: any = params;
      const tempParams = paramData.params;
      if (tempParams.hasOwnProperty('page')) {
        this.pageIndex = tempParams?.page;
        this.paginator.pageIndex = this.pageIndex;
      }
      if (tempParams.hasOwnProperty('size')) {
        this.pageSize = tempParams?.size;
        this.paginator.pageSize = this.pageSize;
      } else {
        this.paginator.pageSize = this.defaultPageSize;
      }
      if (tempParams.hasOwnProperty('forDate')) {
        this.selectedDay = new Date(tempParams.forDate);
      } else {
        this.selectedDay = undefined;
      }
      if (tempParams.hasOwnProperty('sort')) {
        this.sortField = tempParams?.sort;
        this.sortOrder = tempParams?.by;
        this.sort.active = this.sortField;
        this.sort.direction = this.sortOrder;
      }
      if (tempParams.hasOwnProperty('search')) {
        this.searchKeyword = tempParams?.search;
        this.searchValue = this.searchKeyword;
      }
      if (tempParams.hasOwnProperty('sector')) {
        this.selectedSector = tempParams?.sector;
      } else {
        this.selectedSector = undefined;
      }
      if (tempParams.hasOwnProperty('period')) {
        this.selectedPeriod = tempParams?.period;
      } else {
        this.selectedPeriod = undefined;
      }
    });

    this.docSubscription = this.store
      .pipe(select(selectAllDocuments(this.type)))
      .subscribe((documents) => {
        const temp = documents.map((document) => {
          return Object.assign(
            {
              company: document?.companyId.name,
              user:
                document?.uploadedBy.firstname +
                ' ' +
                document.uploadedBy.lastname,
              periodName: document.period.period,
            },
            document
          );
        });
        this.dataSource = new MatTableDataSource(temp);
        if (this.searchValue) {
          this.dataSource.filter = this.searchValue.trim().toString();
        }
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  onDownloadDocument = (docId: string, docName: string) => {
    this.store.dispatch(downloadDocument({ docId, docName }));
  }

  applySearch = () => {
    if (!this.searchValue) {
      return;
    }
    this.searchKeyword = this.searchValue;
    this.dataSource.filter = this.searchKeyword.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.changeQueryParams();
  }

  onResetFilters = () => {
    this.searchValue = undefined;
    this.searchKeyword = undefined;
    this.dataSource.filter = '';
    this.dataSource.paginator.firstPage();
    this.dataSource.paginator.pageSize = this.defaultPageSize;
    this.dataSource.sort.sort({
      id: null,
      start: 'desc',
      disableClear: false,
    });
    this.router.navigate(['dashboard', 'document', this.type]);
  }

  sortData = (event?: any) => {
    this.sortOrder = event.direction;
    this.sortField = event.active;
    this.changeQueryParams();
    return event;
  }

  onView = (id: string) => {
    this.router.navigate(['dashboard', 'document', 'view', id]);
  }

  onUpdate = (id: string) => {
    this.router.navigate(['dashboard', 'document', 'edit', id]);
  }

  onPageChange = (event?: any) => {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.changeQueryParams();
    return event;
  }

  onDateChange = () => {
    this.changeQueryParams();
  }

  onSectorChange = (value: string) => {
    this.changeQueryParams();
  }

  onPeriodChange = (value: string) => {
    this.changeQueryParams();
  }

  changeQueryParams = () => {
    // console.log('dashboard/document/' + this.type + '/' + this.pageIndex + '/' + this.pageSize + '/' + this.sortField + '/' + this.sortOrder + '/' + (this.selectedDay?.toString() || undefined) + '/' + this.selectedSector + '/' + this.selectedPeriod + '/' + this.selectedPeriod)
    this.router.navigate(['dashboard', 'document', this.type], {
      queryParams: {
        page: this.pageIndex,
        size: this.pageSize,
        sort: this.sortField,
        by: this.sortOrder,
        forDate: this.selectedDay?.toString() || undefined,
        sector: this.selectedSector,
        period: this.selectedPeriod,
        search: this.searchKeyword,
      },
    });
  }

  ngOnDestroy = () => {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
    if (this.docSubscription) {
      this.docSubscription.unsubscribe();
    }
  }
}

import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import {
  isCompanyLoading,
  selectAllCompanies,
} from 'src/app/store/company/company.selectors';
import { DeleteDialogComponent } from 'src/app/components/delete-dialog/delete-dialog.component';
import { deleteCompany } from 'src/app/store/company/company.actions';

@Component({
  selector: 'app-companies-list',
  templateUrl: './companies-list.component.html',
  styleUrls: ['./companies-list.component.css'],
})
export class CompaniesListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  loadingSubscription: Subscription;
  companiesSubscription: Subscription;

  loading = true;
  companies = [];

  // table fields and data
  displayedColumns: string[] = [
    'name',
    'address',
    'companyId',
    'createdAt',
    'actions',
  ];
  dataSource: MatTableDataSource<any>;

  // MatPaginator inputs
  pageSize: number;
  pageSizeOptions: number[] = [15, 25, 50];
  pageIndex: number;

  // MatPaginator Output
  pageEvent: PageEvent;

  // Sorting & Searching
  sortField: string;
  sortOrder: 'asc' | 'desc';
  searchKeyword: string;
  searchValue: string;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource(this.companies);
  }

  ngOnInit(): void {
    this.loadingSubscription = this.store
      .pipe(select(isCompanyLoading))
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
      }
      if (tempParams.hasOwnProperty('search')) {
        this.searchKeyword = tempParams?.search;
        this.searchValue = this.searchKeyword;
      }
      if (tempParams.hasOwnProperty('sort')) {
        this.sortField = tempParams?.sort;
        this.sortOrder = tempParams?.by;
        this.sort.active = this.sortField;
        this.sort.direction = this.sortOrder;
      }
    });

    this.companiesSubscription = this.store
      .pipe(select(selectAllCompanies))
      .subscribe((companies) => {
        if (companies) {
          this.companies = companies;
          this.dataSource = new MatTableDataSource(this.companies);

          if (this.searchKeyword) {
            this.dataSource.filter = this.searchKeyword.trim().toString();
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          } else {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        }
      });
  }

  applySearch = () => {
    if (!this.searchValue) {
      return;
    }
    this.searchKeyword = this.searchValue;
    const filterValue = this.searchKeyword;
    this.dataSource.filter = filterValue.trim().toLowerCase();

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
    this.dataSource.sort.sort({
      id: null, start: 'desc', disableClear: false
    });
    this.router.navigate(['dashboard', 'company']);
  }

  sortData = (event?: any) => {
    this.sortOrder = event.direction;
    this.sortField = event.active;
    this.changeQueryParams();
    return event;
  }

  onView = (id: string) => {
    this.router.navigate(['dashboard', 'company', 'view', id]);
  }

  onUpdate = (id: string) => {
    this.router.navigate(['dashboard', 'company', 'edit', id]);
  }

  onDelete = (id: string, name: string) => {
    this.openDialog(id, name);
  }

  openDialog = (id: string, name: string) => {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id,
      title: name,
      action: 'delete',
      type: 'company',
    };

    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        const data = {
          id,
        };
        this.store.dispatch(deleteCompany({ id }));
      }
    });
  }

  onPageChange = (event?: any) => {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.changeQueryParams();
    return event;
  }

  changeQueryParams = () => {
    this.router.navigate(['dashboard', 'company'], {
      queryParams: {
        page: this.pageIndex,
        size: this.pageSize,
        sort: this.sortField,
        by: this.sortOrder,
        search: this.searchKeyword
      }
    });
  }

  ngOnDestroy = () => {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
    if (this.companiesSubscription) {
      this.companiesSubscription.unsubscribe();
    }
  }
}

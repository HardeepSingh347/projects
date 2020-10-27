import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription, Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { MatTableDataSource } from '@angular/material/table';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import {
  isUserLoading,
  selectActiveUsers,
  selectSuspendedUsers,
} from 'src/app/store/user/user.selectors';
import { DeleteDialogComponent } from 'src/app/components/delete-dialog/delete-dialog.component';
import { suspendUser, updateUser } from 'src/app/store/user/user.actions';

@Component({
  selector: 'app-suspended-users',
  templateUrl: './suspended-users.component.html',
  styleUrls: ['./suspended-users.component.css'],
})
export class SuspendedUsersComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  loadingSubscription: Subscription;
  usersSubscription: Subscription;

  pageNumber = 1;

  users$: Observable<User[]>;
  loading = true;

  imgUrl: string;
  displayedColumns: string[] = [
    'firstname',
    'lastname',
    'email',
    'phone',
    'company',
    'userType',
    'createdAt',
    'actions',
  ];
  dataSource: MatTableDataSource<any>;

  // MatPaginator Inputs
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

  users = [];

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource(this.users);
  }

  ngOnInit(): void {
    this.imgUrl = environment.imgUrl;
    this.loadingSubscription = this.store
      .pipe(select(isUserLoading))
      .subscribe((loading) => {
        this.loading = loading;
      });

    this.route.queryParamMap.subscribe((params: ParamMap) => {
      const paramData: any = params;
      const tempParam = paramData.params;
      if (tempParam.hasOwnProperty('page')) {
        this.pageIndex = tempParam.page;
        this.paginator.pageIndex = this.pageIndex;
      }
      if (tempParam.hasOwnProperty('size')) {
        this.pageSize = tempParam.size;
        this.paginator.pageSize = this.pageSize;
      }
      if (tempParam.hasOwnProperty('search')) {
        this.searchKeyword = tempParam.search;
        this.searchValue = tempParam.search;
      }
      if (tempParam.hasOwnProperty('sort')) {
        this.sortField = tempParam.sort;
        this.sortOrder = tempParam?.by;
        this.sort.active = this.sortField;
        this.sort.direction = this.sortOrder;
      }
    });

    this.usersSubscription = this.store
      .select(selectSuspendedUsers)
      .subscribe((users) => {
        const temp = users.map((user) => {
          return Object.assign(
            {
              company: user?.companyId.name,
            },
            user
          );
        });
        this.dataSource = new MatTableDataSource(temp);
        if (this.searchKeyword) {
          this.dataSource.filter = this.searchKeyword.trim().toLowerCase();
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });
  }

  onView = (id: string) => {
    this.router.navigate(['dashboard', 'user', 'view', id]);
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
    this.dataSource.sort.sort({ id: null, start: 'desc', disableClear: false });
    this.router.navigate(['dashboard', 'user']);
  }

  sortData = (event?) => {
    this.sortField = event.active;
    this.sortOrder = event.direction;
    this.changeQueryParams();
    return event;
  }

  onPageChange = (event?: PageEvent) => {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.changeQueryParams();
    return event;
  }

  changeQueryParams = () => {
    this.router.navigate(['dashboard', 'user'], {
      queryParams: {
        page: this.pageIndex,
        size: this.pageSize,
        sort: this.sortField,
        by: this.sortOrder,
        search: this.searchKeyword,
      },
    });
  }

  ngOnDestroy = () => {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
  }
}

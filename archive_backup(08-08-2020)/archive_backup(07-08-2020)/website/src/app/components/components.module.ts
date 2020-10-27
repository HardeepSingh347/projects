import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// import { FooterComponent } from './footer/footer.component';
// import { NavbarComponent } from './navbar/navbar.component';
// import { SidebarComponent } from './sidebar/sidebar.component';
// import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { UserTypePipe } from '../helper/pipes/user-type.pipe';

@NgModule({
  imports: [CommonModule, RouterModule, MatDialogModule],
  declarations: [
    FooterComponent,
    HeaderComponent,
    // SidebarComponent,
    DeleteDialogComponent,
    HeaderComponent,
    FooterComponent,
    SideBarComponent,
    UserTypePipe
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    SideBarComponent,
    UserTypePipe
  ],
  entryComponents: [DeleteDialogComponent],
})
export class ComponentsModule {}

import { NgModule } from "@angular/core";

import { UsersRoutingModule } from "./users-routing.module";
import { UsersListComponent } from "./users-list/users-list.component";
import { UserCreateComponent } from "./user-create/user-create.component";
import { SharedModule } from "src/app/helper/shared/shared.module";
import { SuspendedUsersComponent } from "./suspended-users/suspended-users.component";

@NgModule({
  declarations: [
    UsersListComponent,
    UserCreateComponent,
    SuspendedUsersComponent,
  ],
  imports: [SharedModule, UsersRoutingModule],
})
export class UsersModule {}

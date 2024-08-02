import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FullComponent } from './layouts/full/full.component';
import { DemoFlexyModule } from './demo-flexy-module'

// Modules
import { DashboardModule } from './dashboard/dashboard.module';
import { ComponentsModule } from './components/components.module';
import { LoginComponent } from './login/login.component';
import { ListUserComponent } from './list-user/list-user.component';
import { AddUpUserComponent } from './add-up-user/add-up-user.component';
import { HttpClientModule } from '@angular/common/http';
import { AddUpRoleComponent } from './add-up-role/add-up-role.component';
import { RoleComponent } from './role/role.component';
import { AddUpTypeReservoirComponent } from './add-up-type-reservoir/add-up-type-reservoir.component';
import { ListTypeReservoirComponent } from './list-type-reservoir/list-type-reservoir.component';

@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    LoginComponent,
    ListUserComponent,
    AddUpUserComponent,
    AddUpRoleComponent,
    RoleComponent,
    AddUpTypeReservoirComponent,
    ListTypeReservoirComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FeatherModule.pick(allIcons),
    DemoFlexyModule,
    HttpClientModule, // Ajouter HttpClientModule ici
    DashboardModule,
    ComponentsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

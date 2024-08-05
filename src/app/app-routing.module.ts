import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertsComponent } from './components/alerts/alerts.component';
import { ButtonsComponent } from './components/buttons/buttons.component';
import { ChipsComponent } from './components/chips/chips.component';
import { ExpansionComponent } from './components/expansion/expansion.component';
import { FormsComponent } from './components/forms/forms.component';
import { GridListComponent } from './components/grid-list/grid-list.component';
import { MenuComponent } from './components/menu/menu.component';
import { ProgressSnipperComponent } from './components/progress-snipper/progress-snipper.component';
import { ProgressComponent } from './components/progress/progress.component';
import { SlideToggleComponent } from './components/slide-toggle/slide-toggle.component';
import { SliderComponent } from './components/slider/slider.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { TooltipsComponent } from './components/tooltips/tooltips.component';
import { ProductComponent } from './dashboard/dashboard-components/product/product.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FullComponent } from './layouts/full/full.component';
import { ListUserComponent } from './list-user/list-user.component';
import { RoleComponent } from './role/role.component';
import { ListTypeReservoirComponent } from './list-type-reservoir/list-type-reservoir.component';
import { ListTypeTransactionComponent } from './list-type-transaction/list-type-transaction.component';
import { ListTypeVoitureComponent } from './list-type-voiture/list-type-voiture.component';
import { ListMarqueComponent } from './list-marque/list-marque.component';
import { ListTransactionComponent } from './list-transaction/list-transaction.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth.guard';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { HistoriquesComponent } from './historiques/historiques.component';

const routes: Routes = [
  {
    path:"",
    component:FullComponent,
    children: [
      {path:"", redirectTo:"/forbidden", pathMatch:"full"},
      {path:"login", component:LoginComponent},
      {path:"home", component:DashboardComponent,  canActivate: [AuthGuard]},
      {path:"users", component:ListUserComponent , canActivate: [AuthGuard]},
      {path:"roles", component:RoleComponent , canActivate: [AuthGuard]},
      {path:"reservoires", component:ListTypeReservoirComponent , canActivate: [AuthGuard]},
      {path:"typeTransactions", component:ListTypeTransactionComponent , canActivate: [AuthGuard]},
      {path:"typeVoitures", component:ListTypeVoitureComponent , canActivate: [AuthGuard]},
      {path:"marques", component:ListMarqueComponent , canActivate: [AuthGuard]},
      {path:"transactions", component:ListTransactionComponent , canActivate: [AuthGuard]},
      {path:"forbidden", component:ForbiddenComponent },
      {path:"historiques", component:HistoriquesComponent , canActivate: [AuthGuard] },
      
    ]
  },

  {path:"", redirectTo:"/forbidden", pathMatch:"full"},
  {path:"**", redirectTo:"/forbidden", pathMatch:"full"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuard],  // Ensure AuthGuard is provided in your module
  exports: [RouterModule]
})
export class AppRoutingModule { }

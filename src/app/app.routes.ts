import { Routes } from '@angular/router';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { AppComponent } from './app.component';
import { InvoiceComponent } from './invoice/invoice.component';

export const routes: Routes = [
    { path: "list", component: InvoiceListComponent },
    { path: "invoice", component: InvoiceComponent },
    { path: "", component: AppComponent }
];

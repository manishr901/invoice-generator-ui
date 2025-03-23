import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    private apiUrl='https://invoice-generator-idf0.onrender.com';
    //private apiUrl = 'http://localhost:8080'; // Replace with your actual API URL

    constructor(private http: HttpClient) {}

    saveInvoice(invoiceData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/save-invoice`, invoiceData);
    }

    getAll():Observable<any>{
        return this.http.get(`${this.apiUrl}/get-all-invoices`);
    }

    printPdf(invoiceId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/print-pdf/${invoiceId}`,{ responseType:'blob' });
    }
}
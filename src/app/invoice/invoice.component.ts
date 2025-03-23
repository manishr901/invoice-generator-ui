import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../app.service';

interface Alert {
  type: string;
  message: string;
}

const ALERTS: Alert[] = [
  {
    type: 'success',
    message: 'This is an success alert',
  },
  {
    type: 'info',
    message: 'This is an info alert',
  },
  {
    type: 'warning',
    message: 'This is a warning alert',
  },
  {
    type: 'danger',
    message: 'This is a danger alert',
  },
  {
    type: 'primary',
    message: 'This is a primary alert',
  },
  {
    type: 'secondary',
    message: 'This is a secondary alert',
  },
  {
    type: 'light',
    message: 'This is a light alert',
  },
  {
    type: 'dark',
    message: 'This is a dark alert',
  },
];


@Component({
  selector: 'app-invoice',
  imports: [ReactiveFormsModule, CommonModule, NgbAlertModule,HttpClientModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss'
})
export class InvoiceComponent {
  alerts: Alert[] = [];


  invoiceForm: FormGroup;

  constructor(private fb: FormBuilder, private appService: AppService) {
    this.invoiceForm = this.fb.group({
      buyer_date: [this.getCurrentDate()],
      dated: [this.getCurrentDate()],
      delivery_note_date: [this.getCurrentDate()],
      total_amont: [0],
      bill_to: [''],
      buyers_order_no: [''],
      company_name_and_address: [''],
      delivery_note: [''],
      destination: [''],
      dis_patch_doc_no: [''],
      dispatch_through: [''],
      other_ref: [''],
      ref_no_and_date: [''],
      ship_to: [''],
      terms_of_delivery: [''],
      terms_of_payment: [''],
      items: this.fb.array([this.createItem()])
    });
  }

  onSubmit() {
    const invoiceData = this.mapFormValuesToInvoice(this.invoiceForm.value);
    console.log(this.invoiceForm.value);
    this.appService.saveInvoice(invoiceData).subscribe((response) => {
      console.log(response);
      this.alerts.push({ type: 'success', message: 'Invoice saved successfully' });
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    });
  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  onSelectionChange($event: any, companyName: string) {
    if (companyName === 'vinayak') {
      this.invoiceForm.controls['company_name_and_address'].setValue('VINAYAKRAJ CONSTRUCTIONS PVT LTD. Thal tola shiv vihar colony ,Patna, Bihar, 800014 GSTIN/UIN: 10AAKCV1650L1ZD State Name: Bihar, Code:843327');
      $event.target.checked = false;
    }
    else if (companyName === 'sai') {
      this.invoiceForm.controls['company_name_and_address'].setValue('RAM PRAVESH CONSTRUCTIONS PVT LTD. Thal tola shiv vihar colony ,Patna, Bihar, 800014 GSTIN/UIN: 10AAKCV1650L1ZD State Name: Bihar, Code:843327');
      $event.target.checked = false;
    }
  }
  createItem(): FormGroup {
    return this.fb.group({
      amount: [''],
      gst_rate: [''],
      quantity: [''],
      rate: [''],
      hsn_sac: [''],
      item_name: ['']
    });
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  addItem(): void {
    if (this.items.length == 0 || this.items.at(this.items.length - 1).get('item_name')?.value) {
      if (this.items.length > 0 && this.items.at(this.items.length - 1).get('amount')?.value) {
        if (this.items.length > 0) {
          //this.invoiceForm.controls['total_amont'].setValue(this.items.at(this.items.length - 1).get('amount')?.value + this.invoiceForm.controls['total_amont'].value);
          this.items.push(this.createItem());
        }
      }
    } else {
      this.alerts.push({ type: 'danger', message: 'Please fill the previous item details' });
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }



  }

  removeItem(index: number): void {
    if (this.items.length > 0 && this.invoiceForm.controls['total_amont'].value > 0 && this.items.at(index).get('amount')?.value) {
      this.invoiceForm.controls['total_amont'].setValue(this.invoiceForm.controls['total_amont'].value - this.items.at(index).get('amount')?.value);
    }
    this.items.removeAt(index);
  }

  setAmount(index: number): void {
    const item = this.items.at(index);
    if (item && item.get('quantity')?.value && item.get('rate')?.value && item.get('gst_rate')?.value) {
      const quantity = item.get('quantity')?.value;
      const rate = item.get('rate')?.value;
      const gstRate = item.get('gst_rate')?.value;
      const amount = quantity * rate;
      const gstAmount = (amount * gstRate) / 100;
      item.get('amount')?.setValue(amount + gstAmount,{emitEvent: true});
      this.invoiceForm.controls['total_amont'].setValue(this.invoiceForm.controls['total_amont'].value + item.get('amount')?.value);
    }

  }


  close(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

  reset() {
    this.alerts = Array.from(ALERTS);
  }

  private mapFormValuesToInvoice(formValues: any): any {
    return {
      id: null, // Assuming id is auto-generated
      items: formValues.items.map((item: any) => ({
        id: null, // Assuming id is auto-generated
        itemName: item.item_name,
        gstRate: item.gst_rate,
        hsnSac: item.hsn_sac,
        quantity: item.quantity,
        amount: item.amount,
        rate: item.rate
      })),
      dated: formValues.dated,
      deliveryNote: formValues.delivery_note,
      termsOfPayment: formValues.terms_of_payment,
      refNoAndDate: formValues.ref_no_and_date,
      otherRef: formValues.other_ref,
      buyersOrderNo: formValues.buyers_order_no,
      buyerDate: formValues.buyer_date,
      disPatchDocNo: formValues.dis_patch_doc_no,
      deliveryNoteDate: formValues.delivery_note_date,
      dispatchThrough: formValues.dispatch_through,
      destination: formValues.destination,
      termsOfDelivery: formValues.terms_of_delivery,
      shipTo: formValues.ship_to,
      billTo: formValues.bill_to,
      companyNameAndAddress: formValues.company_name_and_address,
      totalAmont: formValues.total_amont
    };
  }

}

import { CheckoutService } from './../../../core/services/checkout.service';
import { ToastrService } from 'ngx-toastr';
import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { CState } from '../../../core/models/state';

@Injectable()
export class AddressService {
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastrService: ToastrService,
    private checkoutService: CheckoutService
  ) { }

  initAddressForm() {
    return this.fb.group({
      'firstname': ['', Validators.required],
      'lastname': ['', Validators.required],
      'address1': ['', Validators.required],
      'address2': ['', Validators.required],
      'city': ['', Validators.required],
      'phone': ['', Validators.required],
      'zipcode': ['', Validators.required],
      'state_name': ['', Validators.required]
    });
  }

  initEmailForm() {
    return this.fb.group({
      email: ['', Validators.required]
    });
  }

  createAddresAttributes(address) {
    return {
      order: {
        bill_address_attributes: address,
        ship_address_attributes: address
      }
    };
  }

  createGuestAddressAttributes(address, email) {
    return {
      order: {
        email: email,
        bill_address_attributes: address,
        ship_address_attributes: address
      }
    };
  }
  // Country ID: 105 is for INDIA.
  getAllStates(): Observable<Array<CState>> {
    return this.http
      .get<{states: Array<CState>}>(`api/v1/countries/105/states`)
      .pipe(map(res => res.states));
  }

  updateAddress(updatedAddress, addressId, orderNumber) {
    const url = `api/v1/orders/${orderNumber}/addresses/${addressId}?`
      + `address[firstname]=${updatedAddress.firstname}`
      + `&address[lastname]=${updatedAddress.lastname}`
      + `&address[address1]=${updatedAddress.address1}`
      + `&address[address2]=${updatedAddress.address2}`
      + `&address[city]=${updatedAddress.city}`
      + `&address[state_name]=${updatedAddress.state_name}`
      + `&address[phone]=${updatedAddress.phone}`
      + `&address[zipcode]=${updatedAddress.zipcode}`
      + `&address[state_id]=${updatedAddress.state_id}`
      + `&address[country_id]=${updatedAddress.country_id}`
      + `&order_token=${this.checkoutService.getOrderToken()}`
    return this.http.put(url, {})
      .pipe(
        tap(
          _ => this.toastrService.success('Address Updated SuccesFully!', 'Success'),
          _err => this.toastrService.error('Address Could not be Updated', 'Failed')
        )
      );
  }
}

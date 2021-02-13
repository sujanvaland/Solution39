import { Component } from '@angular/core';
import { CommonService } from '../../services/common.service';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';

@Component({
  templateUrl: 'transferfund.component.html'
})
export class TransferFundComponent {

  constructor(private commonservice:CommonService,
    private toastr:ToastrService) { }
  CustomerId:string = localStorage.getItem("CustomerId");
  CustomerEmail="";
  Amount=0;
  ngOnInit(): void {
    
    
  }

  transferfund(){
    let model = { CustomerId : this.CustomerId,CustomerEmail:"",Amount:0 };
    model.CustomerEmail = this.CustomerEmail;
    model.Amount = this.Amount;
    model.CustomerId = this.CustomerId;

    if(model.CustomerEmail == ""){
      this.toastr.error("Please enter User Name");
      return;
    }
    if(model.Amount <= 0){
      this.toastr.error("Please enter Amount");
      return;
    }

    $('.loaderbo').show();
    this.commonservice.TransferFund(model)
    .subscribe(
      res => {
        if(res.Message == "success"){
          this.CustomerEmail= "";
          this.Amount = 0;
          this.toastr.success("Transfer Successfull");
        }
        else{
          this.toastr.error(res.Message);
        }
        $('.loaderbo').hide();
      },
      err => {
        this.toastr.error("Something went wrong");
        $('.loaderbo').hide();
      }
    )
  }
}

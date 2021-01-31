import { Component ,OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { RevShareService } from '../../services/revshare.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import * as $ from 'jquery';
@Component({
  selector: 'buyadpack',
  templateUrl: 'buyadpack.component.html'
})
export class BuyAdPackComponent  implements OnInit {

submitted = false;
CustomerId = localStorage.getItem("CustomerId");
PlanId = 0;
constructor(
  private toastr:ToastrService,
  private revshare:RevShareService,
  private router: Router) { }

ngOnInit (){
    if(!environment.AllowAdPack){
      this.toastr.info("Purchase is diabled till launch date");
    }
}

    onSubmit(planid) {
        this.submitted = true;
        if(!environment.AllowAdPack){
          this.toastr.info("Purchase is diabled till launch date");
          return;
        }
        // stop here if form is invalid
        
        let CustomerPlanModel = {
          CustomerId : this.CustomerId,
          PlanId : planid,
          NoOfPosition:1
        }
        $('.loaderbo').show();
        this.revshare.BuyShare(CustomerPlanModel).subscribe(res =>{
          if(res.Message == "success"){
            this.toastr.success("Your purchase was successful");
          }
          else{
            this.toastr.error(res.Message);
          }
          $('.loaderbo').hide();
        },
        err => {
          if(err.status == 401){
            localStorage.clear();
            this.router.navigate(['/login']);
          }
          else{
            this.toastr.error("Something went wrong, contact support","Error")
          }
        })
        
    }
}

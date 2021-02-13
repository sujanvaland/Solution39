import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MatrixService } from '../../services/matrix.service';
import { CustomerService } from '../../services/customer.service';
import * as $ from 'jquery';
@Component({
  templateUrl: 'tree.component.html'
})
export class TreeComponent {
  constructor(private matrixservice:MatrixService,
    private customerservice:CustomerService){
  }
  PositionId = 10
  CustomerId:string;
  CustomerBoard=[];
  matrixPlan = [];
  plan = { Id : 1,Height:4}
  MyTreeView = [];
  PhaseDetail = [];
  TreeViewHTML:string="";
  Level = 1;
  ngOnInit() {
    this.CustomerId = localStorage.getItem("CustomerId");
    this.GetBoards();
    this.GetTeam();
    
  }

  GetBoards(){
    this.matrixservice.GetMatrixPlan().subscribe(
      res => {
        this.matrixPlan = res.data;
        this.plan = this.matrixPlan[0];
      },
      err => console.log(err)
    );
  }
  
  GetTeam(){
    this.TreeViewHTML = "";
    let model = {
      CustomerId : this.CustomerId
    }
    let phaseid = this.plan.Id;
    let positionreq =1;
    this.PhaseDetail =[];
    for (let index = 1; index <= this.plan.Height; index++) {
      this.PhaseDetail.push({
        'Level':index,
        'Position':positionreq * 3,
        'FilledPosition':0
      })  
      positionreq = positionreq * 3;
    }
    this.customerservice.GetCustomerBoard(model).subscribe(
      res => {
        this.CustomerBoard = res.data.Data;
        if(this.CustomerBoard.length > 0){
          let Phase1 = this.CustomerBoard.find(function(position) { 
            return position.BoardId == phaseid; 
          })
          if(Phase1){
            this.matrixservice.GetTreeView(Phase1.Id).subscribe(
              response =>{
                  this.MyTreeView = response.data;
                  let level = 1;
                  if(this.MyTreeView.length > 0){
                    let parentRow = this.MyTreeView.find(element => element.parentid == 0);
                    this.TreeViewHTML += '<ul>';
                    this.display_with_children(parentRow,level);
                    this.TreeViewHTML += '</ul>';
                  }
              }
            );
          }
        }
        
      },
      err => console.log(err)
    );
  }
  
  display_with_children(parentRow, level) { 
      this.TreeViewHTML +=  '<li><span class="tf-nc"><img width="20" src="assets/img/user-male-icon.png"/><br>'+ 
      parentRow.PositionId +"-" +parentRow.Name +' (' + parentRow.CustomerId+')</span>';
      let childlist = this.MyTreeView.filter(node =>node.parentid == parentRow.PositionId)

      if (childlist.length != 0) {
        this.PhaseDetail[level-1].FilledPosition = this.PhaseDetail[level-1].FilledPosition + childlist.length;
        this.TreeViewHTML +=  '<ul>';
          // use the fetch_assoc to get an associative array
          childlist.forEach(childnode =>{
            this.display_with_children(childnode,level+1);
          }) 

          this.TreeViewHTML += '</ul>';
      }
      this.TreeViewHTML += '</li>';
  } 

}

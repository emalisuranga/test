import { ICompanyCommentWith } from './../../../../../../http/models/recervationdata.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { HelperService } from '../../../../../../http/shared/helper.service';
import { GeneralService } from '../../../../../../http/services/general.service';
import { NameResarvationService } from '../../../../../../http/services/name-resarvation.service';
import { INames } from '../../../../../../http/models/recervationdata.model';
import { DebenturesDataService } from '../../issue-of-debentures/debentures-data.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { RoleGuard } from 'src/app/http/guards/role-guard';
import { environment } from '../../../../../../../environments/environment';
import { DataService } from '../../../../../../storage/data.service';
import { IirdInfo } from '../../../../../../http/models/incorporation.model';
import { AuthService } from '../../../../../../http/shared/auth.service';
import { APIForm34Connection } from '../../appoints-of-administrator/services/connections/APIForm34Connection';
import { Form34Service } from '../../appoints-of-administrator/services/form34.service';
import { ISelectedAdminCompanies } from '../../appoints-of-administrator/models/form34.model';

@Component({
  selector: 'app-register-admin-other-company',
  templateUrl: './register-admin-other-company.component.html',
  styleUrls: ['./register-admin-other-company.component.scss']
})
export class RegisterAdminOtherCompanyComponent implements OnInit {

  url: APIForm34Connection = new APIForm34Connection();

  pvNumber: '';
  adminCompanies = [];
  currentCompanyList: Array<ISelectedAdminCompanies> = [];
  message_succcess = '';
  message_fail = '';

  companyId: string;

  constructor(private helper: HelperService,
    private route: ActivatedRoute,
    private general: GeneralService,
    private form34Service: Form34Service,
    private spinner: NgxSpinnerService,
    private dataservice: DataService,
    public gard: RoleGuard,
    private reservationService: NameResarvationService,
    private router: Router,
    private DebData: DebenturesDataService,
    private Auth: AuthService
    ) {

     // this.companyId = route.snapshot.paramMap.get('id');
     }

  ngOnInit() {
  }


  addAdminCompanies() {
    if (!this.pvNumber) {
        return false;
    }

    const data = {
      registration_no: this.pvNumber ,
    };
    this.spinner.show();
    this.message_fail = '';
    this.message_succcess = '';
    // load Company data from the server
    this.form34Service.checkAdminCompanies(data)
      .subscribe(
        req => {
          if (req['status']) {

            if (this.adminCompanies.includes( req['company_id'] ) ){
              this.message_fail = 'You have already added this company';
              this.spinner.hide();
              return false;
            }

            this.adminCompanies.push(req['company_id']);
            console.log(this.adminCompanies);
            this.currentCompanyList.push({id: req['company_id'] , regNumber: this.pvNumber, name: req['company_name']} );
            this.pvNumber = '';
            this.message_succcess = req['message'];
          } else {
            this.message_fail = req['message'];
          }
          this.spinner.hide();
        }
      );

  }


  removeAssignedCompany(companyId){
    let copyAdminCompanies = this.adminCompanies;
    this.adminCompanies = [];
    for ( var i = 0; i < copyAdminCompanies.length; i++){
      if ( copyAdminCompanies[i] === companyId ) {
       continue;
      }
      this.adminCompanies.push(copyAdminCompanies[i]);

    }

    let copyList = Object.assign({}, this.currentCompanyList);
    this.currentCompanyList = [];

    for (let j in copyList) {
         if (copyList[j].id === companyId ) {
            continue;
         }
         this.currentCompanyList.push(copyList[j]);

    }


  }

  updateJoinList() {
    const data = {
      assignedCompanies:  this.adminCompanies ,
    };
    this.spinner.show();
    this.message_fail = '';
    this.message_succcess = '';
    // load Company data from the server
    this.form34Service.addAdminCompanies(data)
      .subscribe(
        req => {
          if (req['status']) {

            this.adminCompanies = [];
            this.currentCompanyList = [];
            this.pvNumber = '';
            this.message_succcess = req['message'];
          } else {
            this.message_fail = req['message'];
          }
          this.spinner.hide();
        }
      );

  }

}

import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../../../storage/data.service';
import { GeneralService } from '../../../../../http/services/general.service';
import { IAddressData, IOldAddressData } from '../../../../../http/models/address.model';
import { AddressChangeService } from '../../../../../http/services/address-change.service';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIConnection } from '../../../../../http/services/connections/APIConnection';
import { HelperService } from '../../../../../http/shared/helper.service';
import { PaymentService } from '../../../../../http/services/payment.service';
import { Item, IBuy } from '../../../../../http/models/payment';
import { Router, ActivatedRoute } from '@angular/router';
import { CalculationService } from './../../../../../http/shared/calculation.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-address-change',
  templateUrl: './address-change.component.html',
  styleUrls: ['./address-change.component.scss']
})
export class AddressChangeComponent implements OnInit {

  companyId: string;
  changeId: string;
  newaddressid: string;
  oldaddressId: string;
  companyName: string;
  postfix: string;
  companyRegno: string;
  incorporation_at: string;
  effectiveDate: string;
  signbyid: any;
  convert: any;
  blockBackToForm = false;
  blockPayment = false;
  storage1: any;
  storage2: any;
  members: any;
  application = [];
  extra = [];
  url: APIConnection = new APIConnection();
  paymentGateway: string = environment.paymentGateway;
  date = new Date();
  email = '';
  stepOn = 0;
  cipher_message: string;
  address: IAddressData = { id: 0, gnDivision: null, province: null, district: null, city: null, localAddress1: null, localAddress2: null, postcode: null };
  oldaddress: IOldAddressData = { id: 0, gnDivision: null, province: null, district: null, city: null, localAddress1: null, localAddress2: null, postcode: null };
  enableStep1Submission: boolean;
  document_confirm = false;

  province: string;
  district: string;
  city: string;
  gnDivision: string;
  datebool: boolean;
  form: boolean;
  description: string;


  progress = {

    stepArr: [
      { label: 'Address Details', icon: 'fa fa-list-ol', status: 'active' },
      { label: 'Download Documents', icon: 'fa fa-download', status: '' },
      { label: 'Upload Documents', icon: 'fa fa-upload', status: '' },
      { label: 'Payments', icon: 'fa fa-money-bill-alt', status: '' },

    ],

    progressPercentage: '12.5%'

  };

  constructor(private router: Router, public calculation: CalculationService, private crToken: PaymentService, private helper: HelperService, private spinner: NgxSpinnerService, private httpClient: HttpClient, public data: DataService, private general: GeneralService, private addressChangeService: AddressChangeService) {

    if (JSON.parse(localStorage.getItem('storage1'))) {
      this.storage2 = JSON.parse(localStorage.getItem('storage1'));

      if (this.storage2['comId'] === JSON.parse(localStorage.getItem('companyId')) && JSON.parse(localStorage.getItem('status')) === 'processing') {
        this.storage1 = JSON.parse(localStorage.getItem('storage1'));
        this.companyId = this.storage1['comId'];
        this.changeId = this.storage1['changeid'];
        this.newaddressid = this.storage1['newaddressid'];
        this.effectiveDate = this.storage1['date'];
        console.log(this.companyId);
        console.log(this.changeId);
        this.loadUploadedFile();
        this.loadCompanyAddressProcessing();
        // this.changeProgressStatuses(2);
      }
      else {
        this.companyId = JSON.parse(localStorage.getItem('companyId'));
        console.log(this.companyId);
        this.loadCompanyAddress();
      }

    }
    else {
      this.companyId = JSON.parse(localStorage.getItem('companyId'));
      console.log(this.companyId);
      this.loadCompanyAddress();
    }
  }

  ngOnInit() {
  }



  changeProgressStatuses(newStatus = 1) {
    this.stepOn = newStatus;
    this.progress.progressPercentage = (this.stepOn >= 4) ? (12.5 * 2 + this.stepOn * 25) + '%' : (12.5 + this.stepOn * 25) + '%';

    for (let i = 0; i < this.progress['stepArr'].length; i++) {
      if (this.stepOn > i) {
        this.progress['stepArr'][i]['status'] = 'activated';
      } else if (this.stepOn === i) {
        this.progress['stepArr'][i]['status'] = 'active';
      } else {
        this.progress['stepArr'][i]['status'] = '';
      }
    }
    return this.progress;
  }

  loadCompanyAddressProcessing() {
    const data = {
      id: this.companyId,
      type: 'processing',
      addressid: this.storage1['newaddressid'],
      changeid: this.storage1['changeid'],
    };
    this.addressChangeService.loadCompanyAddress(data)
      .subscribe(
        req => {
          if (req['status']) {
            this.oldaddress.localAddress1 = req['data']['address']['address1'];
            this.oldaddress.localAddress2 = req['data']['address']['address2'];
            this.oldaddress.province = req['data']['address']['province'];
            this.oldaddress.district = req['data']['address']['district'];
            this.oldaddress.city = req['data']['address']['city'];
            this.oldaddress.postcode = req['data']['address']['postcode'];
            this.oldaddress.gnDivision = req['data']['address']['gn_division'];
            this.oldaddressId = req['data']['address']['id'];
            this.companyName = req['data']['company'][0]['name'];
            this.postfix = req['data']['company'][0]['postfix'];
            this.companyRegno = req['data']['company'][0]['registration_no'];
            this.incorporation_at = req['data']['company'][0]['incorporation_at'];

            this.address.localAddress1 = req['data']['newaddress']['address1'];
            this.address.localAddress2 = req['data']['newaddress']['address2'];
            this.address.province = req['data']['newaddress']['province'];
            this.address.district = req['data']['newaddress']['district'];
            this.address.city = req['data']['newaddress']['city'];
            this.address.postcode = req['data']['newaddress']['postcode'];
            this.address.gnDivision = req['data']['newaddress']['gn_division'];
            this.members = req['data']['members'];
            if (req['data']['signedbytype'] === 'COMPANY_MEMBERS') {
              this.convert = req['data']['signedby'];
              this.signbyid = this.convert.toString() + '-' + 0;

            }
            else if (req['data']['signedbytype'] === 'COMPANY_MEMBER_FIRMS') {
              this.convert = req['data']['signedby'];
              this.signbyid = this.convert.toString() + '-' + 1;

            }

          }
          this.addressValidationStep1();
        },
        error => {
          console.log(error);
        }
      );
  }


  loadCompanyAddress() {
    const data = {
      id: this.companyId,
      type: 'submit'
    };
    this.addressChangeService.loadCompanyAddress(data)
      .subscribe(
        req => {
          if (req['status']) {
            this.oldaddress.localAddress1 = req['data']['address']['address1'];
            this.oldaddress.localAddress2 = req['data']['address']['address2'];
            this.oldaddress.province = req['data']['address']['province'];
            this.oldaddress.district = req['data']['address']['district'];
            this.oldaddress.city = req['data']['address']['city'];
            this.oldaddress.postcode = req['data']['address']['postcode'];
            this.oldaddress.gnDivision = req['data']['address']['gn_division'];
            this.oldaddressId = req['data']['address']['id'];
            this.companyName = req['data']['company'][0]['name'];
            this.postfix = req['data']['company'][0]['postfix'];
            this.companyRegno = req['data']['company'][0]['registration_no'];
            this.incorporation_at = req['data']['company'][0]['incorporation_at'];
            this.members = req['data']['members'];

          }
        },
        error => {
          console.log(error);
        }
      );
  }

  getEmail() {

    this.email = localStorage.getItem('currentUser');
    this.email = this.email.replace(/^"(.*)"$/, '$1');
    return this.email;
  }

  checkDate() {
    let today = new Date();
    var arred = this.effectiveDate.toString().split('-');
    var Y = today.getFullYear().toString();
    var m = (today.getMonth() + 1).toString();
    var d = today.getDate().toString();
    var D = d.length === 1 ? '0' + d : d;
    var M = m.length === 1 ? '0' + m : m;

    var d1 = (today.getDate() + 1).toString();
    var D1 = d1.length === 1 ? '0' + d1 : d1;

    var d2 = (today.getDate() + 2).toString();
    var D2 = d2.length === 1 ? '0' + d2 : d2;

    var d3 = (today.getDate() + 3).toString();
    var D3 = d3.length === 1 ? '0' + d3 : d3;

    var d4 = (today.getDate() + 4).toString();
    var D4 = d4.length === 1 ? '0' + d4 : d4;

    if (Y === arred[0] && M === arred[1] && (D === arred[2] || D1 === arred[2] || D2 === arred[2] || D3 === arred[2] || D4 === arred[2])) {
      this.form = false;
      this.datebool = true;
      return true;

    }
    else if (Y === arred[0] && M === arred[1] && (D4 < arred[2])) {
      this.datebool = false;
      this.form = true;
      return true;

    }
    else {
      this.datebool = false;
      this.form = false;
      return false;
    }

  }

  convertAndAdd(date: string) {
    // tslint:disable-next-line:prefer-const
    let dt = new Date(date);
    dt.setDate(dt.getDate() + 7);
    var Y = dt.getFullYear().toString();
    var m = (dt.getMonth() + 1).toString();
    var d = dt.getDate().toString();
    var D = d.length === 1 ? '0' + d : d;
    var M = m.length === 1 ? '0' + m : m;
    return Y + '-' + M + '-' + D;
  }



  addressValidationStep1() {
    if (
      this.address.localAddress2 &&
      this.address.localAddress1 &&
      this.address.city &&
      this.address.district &&
      this.address.province &&
      this.address.gnDivision &&
      this.address.postcode && this.postcode(this.address.postcode) &&
      this.effectiveDate &&
      this.signbyid
      // this.societyDetails.case_of_society
    ) {
      this.enableStep1Submission = true;
      console.log(this.effectiveDate);


    }
    else {
      this.enableStep1Submission = false;
      console.log(this.effectiveDate);
    }
  }

  addressSubmit() {

    if (this.changeId && this.newaddressid) {
      this.province = this.address.province;
      this.district = this.address.district;
      this.city = this.address.city;
      this.gnDivision = this.address.gnDivision;

      const data = {

        comId: this.companyId,
        changeid: this.changeId,
        newaddressid: this.newaddressid,
        type: 'COMPANY_ADDRESS_CHANGE',
        oldaddressId: this.oldaddressId,
        localAddress2: this.address['localAddress2'],
        localAddress1: this.address['localAddress1'],
        province: this.address.province.description_en === undefined ? this.province : this.address.province.description_en,
        district: this.address.district.description_en === undefined ? this.district : this.address.district.description_en,
        city: this.address.city.description_en === undefined ? this.city : this.address.city.description_en,
        gnDivision: this.address.gnDivision.description_en === undefined ? this.gnDivision : this.address.gnDivision.description_en,
        postcode: this.address['postcode'],
        country: 'Sri Lanka',
        // date: this.datebool === true ? this.convertAndAdd(this.effectiveDate) : this.effectiveDate,
        date: this.effectiveDate,
        email: this.getEmail(),
        signby: this.signbyid,
      };

      this.addressChangeService.addressSubmit(data)
        .subscribe(
          req => {
            if (req['status']) {
              this.changeProgressStatuses(1);
              this.blockBackToForm = false;
              this.changeId = req['changeid'];
              this.newaddressid = req['newaddressid'];
              // localStorage.setItem('changeid', JSON.stringify(req['changeid']));
            }
            else {
              console.log('error happened!!!');
            }

          },
          error => {
            console.log(error);
          }
        );
    }
    else {
      this.province = this.address.province;
      this.district = this.address.district;
      this.city = this.address.city;
      this.gnDivision = this.address.gnDivision;
      const data = {

        comId: this.companyId,
        type: 'COMPANY_ADDRESS_CHANGE',
        oldaddressId: this.oldaddressId,
        localAddress2: this.address['localAddress2'],
        localAddress1: this.address['localAddress1'],
        province: this.address.province.description_en === undefined ? this.province : this.address.province.description_en,
        district: this.address.district.description_en === undefined ? this.district : this.address.district.description_en,
        city: this.address.city.description_en === undefined ? this.city : this.address.city.description_en,
        gnDivision: this.address.gnDivision.description_en === undefined ? this.gnDivision : this.address.gnDivision.description_en,
        postcode: this.address['postcode'],
        country: 'Sri Lanka',
        date: this.datebool === true ? this.convertAndAdd(this.effectiveDate) : this.effectiveDate,
        email: this.getEmail(),
        signby: this.signbyid,
      };

      this.addressChangeService.addressSubmit(data)
        .subscribe(
          req => {
            if (req['status']) {
              this.changeProgressStatuses(1);
              this.blockBackToForm = false;
              this.changeId = req['changeid'];
              this.newaddressid = req['newaddressid'];
              // localStorage.setItem('changeid', JSON.stringify(req['changeid']));
            }
            else {
              console.log('error happened!!!');
            }

          },
          error => {
            console.log(error);
          }
        );
    }

  }

  addressChangeGeneratePDF() {

    const data = {

      comId: this.companyId,
      email: this.getEmail(),
      changeid: this.changeId,

    };

    this.addressChangeService.getApplicationPDFService(data)
      .subscribe(
        response => {
          this.helper.download(response);
        },
        error => {
          console.log(error);

        }
      );
  }

  // for uplaod secretary pdf files...
  fileUpload(event, description, docType) {

    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let fileSize = fileList[0].size;
      let filetype = fileList[0].type;
      if (fileSize > 1024 * 1024 * 4) { // 4mb restriction
        alert('File size should be less than 4 MB');
        return false;
      }
      if (!filetype.match('application/pdf')) {
        alert('Please upload pdf files only');
        return false;
      }

      let formData: FormData = new FormData();

      formData.append('uploadFile', file, file.name);
      formData.append('docType', docType);
      formData.append('comId', this.companyId);
      formData.append('description', description);
      // formData.append('changeid', JSON.parse(localStorage.getItem('changeid')));
      formData.append('filename', file.name);

      let headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');

      let uploadurl = this.url.getAddressChangeFileUploadUrl();
      this.spinner.show();

      this.httpClient.post(uploadurl, formData, { headers: headers })
        .subscribe(
          (data: any) => {
            const datas = {
              id: data['docid'],
              name: data['name'],
              token: data['token'],
              pdfname: data['pdfname'],
              file_description: data['file_description'],
            };
            if (docType === 'applicationUpload') {
              this.application.push(datas);
            }
            else if (docType === 'extraUpload') {
              this.extra.push(datas);
            }
            this.spinner.hide();
            // this.gotoPay();
           this.description = '';
            // this.description2 = '';
            // this.description3 = '';
          },
          error => {
            console.log(error);
            this.spinner.hide();
          }
        );
    }



  }

  loadUploadedFile() {

    const data = {
      comId: this.companyId,
      type: 'submit'
    };
    this.addressChangeService.addresschangeFiles(data)
      .subscribe(
        req => {
          if (req['status']) {
            if (req['data']['file']) {
              this.application = [];
              this.extra = [];
              for (let i in req['data']['file']) {
                const data1 = {
                  id: req['data']['file'][i]['id'],
                  name: req['data']['file'][i]['docname'],
                  key: req['data']['file'][i]['docKey'],
                  token: req['data']['file'][i]['file_token'],
                  pdfname: req['data']['file'][i]['name'],
                  description: req['data']['file'][i]['description'],
                  file_description: req['data']['file'][i]['file_description'],
                };
                if (req['data']['file'][i]['docKey'] === 'FORM_13') {
                  this.application.push(data1);

                }
                else if (req['data']['file'][i]['docKey'] === 'EXTRA_DOCUMENT') {
                  this.extra.push(data1);

                }
              }
              // this.gotoPay();
            }


          }
        }
      );
  }

  // for view the uploaded pdf...
  ngOnDownload(token: string): void {
    this.spinner.show();
    this.general.getDocumenttoServer(token)
      .subscribe(
        response => {
          this.helper.download(response);
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
        }
      );
  }

  // for delete the uploaded pdf from the database...
  fileDelete(docId, docType, index) {
    if (confirm('Are you sure you want to delete this document?')) {
      const data = {
        documentId: docId,
      };
      this.spinner.show();
      this.addressChangeService.addresschangeDeleteUploadedPdf(data)
        .subscribe(
          response => {


            if (response['status']) {

              this.loadUploadedFile();
              this.spinner.hide();
            }
          },
          error => {
            this.spinner.hide();
            console.log(error);
          }
        );
    }

  }

  getCipherToken() {
    if (!this.companyId) { return this.router.navigate(['dashboard/home']); }

    const item: Array<Item> = [{
      fee_type: 'PAYMENT_COMPANY_ADDRESS_CHANGE',
      description: `For Company Address Change - ${this.companyRegno}`,
      quantity: 1,
    }];

    const buy: IBuy = {
      module_type: 'MODULE_COMPANY_ADDRESS_CHANGE',
      module_id: this.changeId,
      description: 'Company Address Change',
      item: item,
      extraPay: null
    };

    this.crToken.getCrToken(buy).subscribe(
      req => {
        this.cipher_message = req.token;
        this.blockPayment = true;

      },
      error => { console.log(error); }
    );
  }

  areYouSurePayYes() {
    this.blockPayment = true;
  }
  areYouSurePayNo() {
    this.blockPayment = false;
  }

  areYouSureYes() {
    this.blockBackToForm = true;
  }
  areYouSureNo() {
    this.blockBackToForm = false;
  }

  private postcode(inputtxt) {
    if (!inputtxt) { return true; }
    // tslint:disable-next-line:prefer-const
    let code = /^[0-9]+$/;
    return inputtxt.match(code);
  }

}

import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuditorService } from '../../../../../../http/services/auditor.service';
import { HelperService } from '../../../../../../http/shared/helper.service';
import { DataService } from '../../../../../../storage/data.service';
import { GeneralService } from '../../../../../../http/services/general.service';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { APIConnection } from '../../../../../../http/services/connections/APIConnection';
import { IAuditorData } from '../../../../../../http/models/auditor.model';
import { AuditorDataService } from '../auditor-data.service';
import { ToastrService } from 'ngx-toastr';
import { Item, IBuy } from './../../../../../../http/models/payment';
import { PaymentService } from '../../../../../../http/services/payment.service';
declare var google: any;

@Component({
  selector: 'app-resubmit-auditor-naturalp-sl',
  templateUrl: './resubmit-auditor-naturalp-sl.component.html',
  styleUrls: ['./resubmit-auditor-naturalp-sl.component.scss']
})
export class ResubmitAuditorNaturalpSlComponent implements OnInit {

  url: APIConnection = new APIConnection();

  auditorDetails: IAuditorData = {
    registeredUser: false, nic: '', passport: '', loggedInUser: '', id: 0, title: '', sinFullName: '', tamFullName: '', sinAd: '', tamAd: '',
    firstname: '', lastname: '', residentialLocalAddress1: '', residentialLocalAddress2: '', residentialProvince: null, residentialDistrict: null,
    residentialCity: null, rgnDivision: null, residentialPostCode: '', businessName: '', businessLocalAddress1: '', businessLocalAddress2: '',
    businessProvince: '', businessDistrict: '', businessCity: '', gnDivision: '', businessPostCode: '', birthDay: '',
    pQualification: '', nationality: '', race: '', whereDomiciled: '', dateTakeResidenceInSrilanka: '',
    dateConResidenceInSrilanka: '', ownedProperty: '', otherFacts: '',
    isUnsoundMind: '', isInsolventOrBankrupt: '', reason1: '', isCompetentCourt: '', reason2: '', otherDetails: '', subClauseQualified: '', isExistAud: '', certificateNo: '',
  };

  nic: string;
  loggedinUserEmail: string;
  audId: number;
  enableStep1Submission = false;
  enableStep2Submission = false;
  enableGoToPay = false;
  blockBackToForm = false;
  blockPayment = false;

  application = [];
  additional = [];
  pCertificateUploadList = [];
  regCertificateUploadList = [];
  practiceCertificateUploadList = [];
  description: string;
  cipher_message: string;

  applicationComment: string;
  professionalComment: string;

  businessProvince: string;
  businessDistrict: string;
  businessCity: string;
  bgnDivision: string;

  residentialProvince: string;
  residentialDistrict: string;
  residentialCity: string;
  rgnDivision: string;

  sinFullName = null;
  tamFullName = null;
  tamilelements;
  sinElements;

  email: any;
  mobile: any;
  tel: any;

  sinAd = null;
  tamAd = null;
  adtamilelements;
  adsinElements;

  stepOn = 0;
  processStatus: string;
  progress = {
    stepArr: [
      { label: 'Personal Details', icon: 'fa fa-list-ol', status: 'active' },
      { label: 'Qualifications', icon: 'fa fa-users', status: '' },
      { label: 'Download Documents', icon: 'fa fa-download', status: '' },
      { label: 'Upload Documents', icon: 'fa fa-upload', status: '' },
      { label: 'Payments', icon: 'fa fa-money-bill-alt', status: '' },
    ],
    progressPercentage: '10%'
  };

  constructor(
    public data: DataService,
    private helper: HelperService,
    private auditorService: AuditorService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private httpClient: HttpClient,
    private general: GeneralService,
    private AudData: AuditorDataService,
    private crToken: PaymentService,
    private snotifyService: ToastrService,

  ) {
    this.audId = this.AudData.getAudId;
    if ((this.audId === undefined)) {
      this.audId = parseInt(localStorage.getItem('audId'), 10);
      this.loadAuditorData(this.audId);
      this.loadUploadedFile(this.audId);
    }
    else if (!(this.audId === undefined)) {
      localStorage.setItem('audId', this.audId.toString());
      this.changeProgressStatuses(0);
      this.loadAuditorData(this.audId);
      this.loadUploadedFile(this.audId);
      this.AudData.audId = undefined;
    }
    this.nic = route.snapshot.paramMap.get('nic');

    this.loggedinUserEmail = localStorage.getItem('currentUser');
    this.loggedinUserEmail = this.loggedinUserEmail.replace(/^"(.*)"$/, '$1');

    this.auditorValidationStep1();
    this.auditorValidationStep2();

  }

  ngOnInit() {
    document.getElementById('div1').style.display = 'none';
    document.getElementById('div2').style.display = 'none';
    document.getElementById('div3').style.display = 'none';
    this.sinElements = document.getElementsByClassName('sinhalaname');
    this.tamilelements = document.getElementsByClassName('tamilname');
    this.adsinElements = document.getElementsByClassName('adsinhalaname');
    this.adtamilelements = document.getElementsByClassName('adtamilname');
  }
  /*....below show () functions for the radio buttons validations....*/
  show1() {
    document.getElementById('div1').style.display = 'none';
    this.auditorDetails['reason1'] = '';
  }
  show2() {
    document.getElementById('div1').style.display = 'block';
  }
  show3() {
    document.getElementById('div2').style.display = 'none';
    this.auditorDetails['reason2'] = '';
  }
  show4() {
    document.getElementById('div2').style.display = 'block';
  }
  show5() {
    document.getElementById('div3').style.display = 'none';
    this.auditorDetails['certificateNo'] = '';
  }
  show6() {
    document.getElementById('div3').style.display = 'block';
  }
  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  changeProgressStatuses(newStatus = 1) {
    this.stepOn = newStatus;
    this.progress.progressPercentage = (this.stepOn >= 4) ? (10 * 2 + this.stepOn * 20) + '%' : (10 + this.stepOn * 20) + '%';
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

  loadsinhala() {
    const sinhalOptions = {
      sourceLanguage: google.elements.transliteration.LanguageCode.ENGLISH,
      destinationLanguage: [google.elements.transliteration.LanguageCode.SINHALESE],
      shortcutKey: 'ctrl+s',
      transliterationEnabled: true
    };
    const TrSinhalaControl = new google.elements.transliteration.TransliterationControl(sinhalOptions);
    TrSinhalaControl.makeTransliteratable(this.sinElements);
  }

  loadTamil() {
    const tamilOptions = {
      sourceLanguage: google.elements.transliteration.LanguageCode.ENGLISH,
      destinationLanguage: [google.elements.transliteration.LanguageCode.TAMIL],
      shortcutKey: 'ctrl+s',
      transliterationEnabled: true
    };
    const TrtamilControl = new google.elements.transliteration.TransliterationControl(tamilOptions);
    TrtamilControl.makeTransliteratable(this.tamilelements);
  }

  adloadsinhala() {
    const sinhalOptions = {
      sourceLanguage: google.elements.transliteration.LanguageCode.ENGLISH,
      destinationLanguage: [google.elements.transliteration.LanguageCode.SINHALESE],
      shortcutKey: 'ctrl+s',
      transliterationEnabled: true
    };
    const TrSinhalaControl = new google.elements.transliteration.TransliterationControl(sinhalOptions);
    TrSinhalaControl.makeTransliteratable(this.adsinElements);
  }

  adloadTamil() {
    const tamilOptions = {
      sourceLanguage: google.elements.transliteration.LanguageCode.ENGLISH,
      destinationLanguage: [google.elements.transliteration.LanguageCode.TAMIL],
      shortcutKey: 'ctrl+s',
      transliterationEnabled: true
    };
    const TrtamilControl = new google.elements.transliteration.TransliterationControl(tamilOptions);
    TrtamilControl.makeTransliteratable(this.adtamilelements);
  }

  @HostListener('keydown', ['$event']) onKeyDown(e) {
    if (e.keyCode === 32 || e.keyCode === 13 || e.keyCode === 46 || e.keyCode === 8) {
      setTimeout(() => {
        this.sinFullName = this.sinElements[0].value;
        this.tamFullName = this.tamilelements[0].value;
        this.sinAd = this.adsinElements[0].value;
        this.tamAd = this.adtamilelements[0].value;
      },
        1000);
    }
  }


  loadAuditorData(audId) {
    const data = {
      audId: audId,
    };
    this.auditorService.auditorDataLoad(data)
      .subscribe(
        req => {
          if (req['status']) {
            this.sinFullName = req['data']['auditor']['name_si'];
            this.tamFullName = req['data']['auditor']['name_ta'];
            this.email = req['data']['auditor']['email'];
            this.mobile = req['data']['auditor']['mobile'];
            this.tel = req['data']['auditor']['telephone'];
            this.sinAd = req['data']['auditor']['address_si'];
            this.tamAd = req['data']['auditor']['address_ta'];
            this.auditorDetails.title = req['data']['auditor']['title'];
            this.auditorDetails.firstname = req['data']['auditor']['first_name'];
            this.auditorDetails.lastname = req['data']['auditor']['last_name'];
            this.auditorDetails.businessName = req['data']['auditor']['business_name'];
            this.auditorDetails.nationality = req['data']['auditor']['nationality'];
            this.auditorDetails.race = req['data']['auditor']['race'];
            this.auditorDetails.birthDay = req['data']['auditor']['dob'];
            this.auditorDetails.pQualification = req['data']['auditor']['professional_qualifications'];
            this.auditorDetails.isUnsoundMind = req['data']['auditor']['is_unsound_mind'];
            this.auditorDetails.isInsolventOrBankrupt = req['data']['auditor']['is_insolvent_or_bankrupt'];
            this.auditorDetails.isCompetentCourt = req['data']['auditor']['is_competent_court'];
            this.auditorDetails.isExistAud = req['data']['auditor']['is_existing_auditor'] + '';
            if (this.auditorDetails.isInsolventOrBankrupt === 'yes') {
              this.auditorDetails.reason1 = req['data']['auditor']['reason'];
              this.show2();
            } else {
              this.auditorDetails.reason1 = '';
            }
            if (this.auditorDetails.isCompetentCourt === 'yes') {
              if (req['data']['auditor']['competent_court_type'] === 'pardoned') {
                this.auditorDetails.reason2 = 'pardoned';
                this.show4();
              } else if (req['data']['auditor']['competent_court_type'] === 'appeal') {
                this.auditorDetails.reason2 = 'appeal';
                this.show4();
              }
            } else {
              this.auditorDetails.reason2 = '';
            }
            if (this.auditorDetails.isExistAud === '1') {
              this.auditorDetails.certificateNo = req['data']['certificateNumber'];
              this.show6();
            } else {
              this.auditorDetails.certificateNo = '';
            }
            this.auditorDetails.otherDetails = req['data']['auditor']['other_details'];
            this.auditorDetails.subClauseQualified = req['data']['auditor']['which_applicant_is_qualified'];
            if (req['data']['businessaddress']) {
              this.auditorDetails.businessLocalAddress1 = req['data']['businessaddress']['address1'];
              this.auditorDetails.businessLocalAddress2 = req['data']['businessaddress']['address2'];
              this.auditorDetails.businessPostCode = req['data']['businessaddress']['postcode'];

              this.businessProvince = req['data']['businessaddress']['province'];
              this.auditorDetails.businessProvince = this.businessProvince;

              this.businessDistrict = req['data']['businessaddress']['district'];
              this.auditorDetails.businessDistrict = this.businessDistrict;

              this.businessCity = req['data']['businessaddress']['city'];
              this.auditorDetails.businessCity = this.businessCity;

              this.bgnDivision = req['data']['businessaddress']['gn_division'];
              this.auditorDetails.gnDivision = this.bgnDivision;
            }
            if (req['data']['audaddress']) {
              this.auditorDetails.residentialLocalAddress1 = req['data']['audaddress']['address1'];
              this.auditorDetails.residentialLocalAddress2 = req['data']['audaddress']['address2'];
              this.auditorDetails.residentialPostCode = req['data']['audaddress']['postcode'];

              this.residentialProvince = req['data']['audaddress']['province'];
              this.auditorDetails.residentialProvince = this.residentialProvince;

              this.residentialDistrict = req['data']['audaddress']['district'];
              this.auditorDetails.residentialDistrict = this.residentialDistrict;

              this.residentialCity = req['data']['audaddress']['city'];
              this.auditorDetails.residentialCity = this.residentialCity;

              this.rgnDivision = req['data']['audaddress']['gn_division'];
              this.auditorDetails.rgnDivision = this.rgnDivision;
            }
          }
          this.auditorValidationStep1();
          this.auditorValidationStep2();
        },
        error => {
          console.log(error);
        }
      );
  }


  updateAuditorData() {
    if (this.auditorDetails['isInsolventOrBankrupt'] === 'no') {
      this.auditorDetails['reason1'] = '';
    }
    if (this.auditorDetails['isCompetentCourt'] === 'no') {
      this.auditorDetails['reason2'] = 'no';
    }
    const data = {
      id: this.audId,
      nic: this.nic,
      sinFullName: this.sinFullName,
      tamFullName: this.tamFullName,
      sinAd: this.sinAd,
      tamAd: this.tamAd,
      email: this.email,
      mobile: this.mobile,
      tel: this.tel,
      passport: '',
      isExistAud: this.auditorDetails['isExistAud'],
      certificateNo: this.auditorDetails['certificateNo'],
      loggedInUser: this.loggedinUserEmail,
      registeredUser: this.auditorDetails['registeredUser'],
      title: this.auditorDetails['title'],
      firstname: this.auditorDetails['firstname'],
      lastname: this.auditorDetails['lastname'],
      residentialLocalAddress1: this.auditorDetails['residentialLocalAddress1'],
      residentialLocalAddress2: this.auditorDetails['residentialLocalAddress2'],
      residentialPostCode: this.auditorDetails['residentialPostCode'],
      residentialProvince: this.auditorDetails.residentialProvince.description_en === undefined ? this.residentialProvince : this.auditorDetails.residentialProvince.description_en,
      residentialDistrict: this.auditorDetails.residentialDistrict.description_en === undefined ? this.residentialDistrict : this.auditorDetails.residentialDistrict.description_en,
      residentialCity: this.auditorDetails.residentialCity.description_en === undefined ? this.residentialCity : this.auditorDetails.residentialCity.description_en,
      rgnDivision: this.auditorDetails.rgnDivision.description_en === undefined ? this.rgnDivision : this.auditorDetails.rgnDivision.description_en,
      businessName: this.auditorDetails['businessName'],
      businessLocalAddress1: this.auditorDetails['businessLocalAddress1'],
      businessLocalAddress2: this.auditorDetails['businessLocalAddress2'],
      businessPostCode: this.auditorDetails['businessPostCode'],
      businessProvince: this.auditorDetails.businessProvince.description_en === undefined ? this.businessProvince : this.auditorDetails.businessProvince.description_en,
      businessDistrict: this.auditorDetails.businessDistrict.description_en === undefined ? this.businessDistrict : this.auditorDetails.businessDistrict.description_en,
      businessCity: this.auditorDetails.businessCity.description_en === undefined ? this.businessCity : this.auditorDetails.businessCity.description_en,
      gnDivision: this.auditorDetails.gnDivision.description_en === undefined ? this.bgnDivision : this.auditorDetails.gnDivision.description_en,
      birthDay: this.auditorDetails['birthDay'],
      pQualification: this.auditorDetails['pQualification'],
      nationality: this.auditorDetails['nationality'],
      race: this.auditorDetails['race'],
      whereDomiciled: this.auditorDetails['whereDomiciled'],
      dateTakeResidenceInSrilanka: this.auditorDetails['dateTakeResidenceInSrilanka'],
      dateConResidenceInSrilanka: this.auditorDetails['dateConResidenceInSrilanka'],
      ownedProperty: this.auditorDetails['ownedProperty'],
      otherFacts: this.auditorDetails['otherFacts'],
      isUnsoundMind: this.auditorDetails['isUnsoundMind'],
      isInsolventOrBankrupt: this.auditorDetails['isInsolventOrBankrupt'],
      reason1: this.auditorDetails['reason1'],
      isCompetentCourt: this.auditorDetails['isCompetentCourt'],
      reason2: this.auditorDetails['reason2'],
      otherDetails: this.auditorDetails['otherDetails'],
      subClauseQualified: this.auditorDetails['subClauseQualified'],
    };
    this.auditorService.auditorDataUpdate(data)
      .subscribe(
        req => {
          if (req['status']) {
            this.blockBackToForm = false;
            this.audId = req['audId'];
            this.changeProgressStatuses(2);
          }
        },
        error => {
          console.log(error);
        }
      );
  }

  // for download the generated pdf...
  clickDownload() {
    this.auditorGeneratePDF(this.audId);
  }
  auditorGeneratePDF(audId) {
    this.spinner.show();
    this.auditorService.auditorPDF(audId)
      .subscribe(
        response => {
          this.spinner.hide();
          this.helper.download(response);
        },
        error => {
          console.log(error);
          this.spinner.hide();
        }
      );
  }

  // for uplaod auditor pdf files...
  fileUpload(event, description, docType) {

    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let fileSize = fileList[0].size;
      let filetype = fileList[0].type;
      if (fileSize > 1024 * 1024 * 4) {
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
      formData.append('audId', this.audId.toString());
      formData.append('description', description);
      formData.append('filename', file.name);

      let headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');

      let uploadurl = this.url.getAuditorFileUploadUrl();
      this.spinner.show();

      this.httpClient.post(uploadurl, formData, { headers: headers })
        .subscribe(
          (data: any) => {
            const datas = {
              id: data['docid'],
              name: data['name'],
              token: data['token'],
              pdfname: data['pdfname'],
            };
            if (docType === 'applicationUpload') {
              this.application.push(datas);
            } else if (docType === 'pCertificateUpload') {
              this.pCertificateUploadList.push(datas);
            }
            this.spinner.hide();
            this.description = '';
          },
          error => {
            console.log(error);
            this.spinner.hide();
          }
        );
    }
  }

  // for update uplaoded auditor pdf files...
  updateFileUploaded(event, id, description, docType) {

    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let fileSize = fileList[0].size;
      let filetype = fileList[0].type;
      if (fileSize > 1024 * 1024 * 4) {
        alert('File size should be less than 4 MB');
        return false;
      }
      if (!filetype.match('application/pdf')) {
        alert('Please upload pdf files only');
        return false;
      }

      let formData: FormData = new FormData();

      formData.append('uploadFile', file, file.name);
      formData.append('docId', id);
      formData.append('docType', docType);
      formData.append('audId', this.audId.toString());
      formData.append('description', description);
      formData.append('filename', file.name);

      let headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');

      let uploadurl = this.url.getAuditorFileUpdateUploadedUrl();
      this.spinner.show();

      this.httpClient.post(uploadurl, formData, { headers: headers })
        .subscribe(
          (data: any) => {
            this.loadUploadedFile(this.audId);
            this.spinner.hide();
            this.description = '';
          },
          error => {
            console.log(error);
            this.spinner.hide();
          }
        );
    }
  }

  // for delete the uploaded pdf from the database...
  fileDelete(docId, docType, index) {
    const data = {
      documentId: docId,
    };
    this.spinner.show();
    this.auditorService.auditorDeleteUploadedPdf(data)
      .subscribe(
        rq => {
          this.spinner.hide();
          if (index > -1) {
            if (docType === 'applicationUpload') {
              this.application.splice(index, 1);
            } else if (docType === 'pCertificateUpload') {
              this.pCertificateUploadList.splice(index, 1);
            }
          }
        },
        error => {
          this.spinner.hide();
          console.log(error);
        }
      );
  }

  // for load uplaoded auditor all pdf files...
  loadUploadedFile(audId) {
    const data = {
      audId: audId,
      type: 'individual',
    };
    this.auditorService.auditorDocCommentsLoad(data)
      .subscribe(
        req => {
          if (req['status']) {
            if (req['data']['file']) {
              this.application = [];
              this.pCertificateUploadList = [];
              this.regCertificateUploadList = [];
              this.practiceCertificateUploadList = [];
              this.additional = [];
              for (let i in req['data']['file']) {
                const data1 = {
                  id: req['data']['file'][i]['id'],
                  key: req['data']['file'][i]['dockey'],
                  token: req['data']['file'][i]['file_token'],
                  pdfname: req['data']['file'][i]['name'],
                  comment: req['data']['file'][i]['comments'],
                  setkey: req['data']['file'][i]['setkey'],
                  value: req['data']['file'][i]['value'],
                };
                if ((req['data']['file'][i]['dockey'] === 'AUDITOR_APPLICATION')) {
                  this.application.push(data1);
                } else if ((req['data']['file'][i]['dockey'] === 'AUDITOR_PROFESSIONAL_QUALIFICATION')) {
                  this.pCertificateUploadList.push(data1);
                } else if ((req['data']['file'][i]['dockey'] === 'AUDITOR_CERTIFICATE_TO_PRACTICE')) {
                  this.practiceCertificateUploadList.push(data1);
                } else if ((req['data']['file'][i]['dockey'] === 'AUDITOR_CERTIFICATE')) {
                  this.regCertificateUploadList.push(data1);
                }else {
                  this.additional.push(data1);
                }
              }
              this.gotoSubmit(this.application, this.pCertificateUploadList, this.regCertificateUploadList, this.additional, this.practiceCertificateUploadList);
            }
          }
        }
      );
  }

  // for delete the uploaded pdf in resubmit process...
  fileDeleteResubmited(docId, docType, index) {
    const data = {
      documentId: docId,
      type: docType,
    };
    this.spinner.show();
    this.auditorService.auditorDeleteUploadedPdfResubmited(data)
      .subscribe(
        rq => {
          this.spinner.hide();
          this.loadUploadedFile(this.audId);
        },
        error => {
          this.spinner.hide();
          console.log(error);
        }
      );
  }

  // for load uplaoded  pdf file comments...(not used)
  loadDocComments(audId) {
    const data = {
      audId: audId,
      type: 'individual',
    };
    this.auditorService.auditorDocCommentsLoad(data)
      .subscribe(
        req => {
          if (req['status']) {
            for (let i in req['data']['auditorDoc']) {

              if (req['data']['auditorDoc'][i]['comments']) {
                if (req['data']['auditorDoc'][i]['key'] === 'AUDITOR_APPLICATION') {
                  this.applicationComment = req['data']['auditorDoc'][i]['comments'];
                }
                if (req['data']['auditorDoc'][i]['key'] === 'AUDITOR_PROFESSIONAL_QUALIFICATION') {
                  this.professionalComment = req['data']['auditorDoc'][i]['comments'];
                }
              }
            }
            this.loadUploadedFile(audId);
          }
        }
      );
  }

  // for view the uploaded pdf...
  ngOnDownload(token: string): void {
    this.spinner.show();
    this.general.getDocumenttoServer(token, 'CAT_AUDITOR_DOCUMENT')
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

  // for complete resubmition...
  submit() {
    const data = {
      audId: this.audId,
      type: 'individual',
    };
    this.auditorService.auditorStatusUpdate(data)
      .subscribe(
        req => {
          if (req['status']) {
            this.router.navigate(['dashboard/selectregisterauditor']);
          } else {
            alert('Error!');
          }
        }
      );
  }

  changeSubClause() {
    if (this.auditorDetails.subClauseQualified === '') {
      this.auditorDetails.pQualification = '';
    } else if (this.auditorDetails.subClauseQualified === '5(1)a') {
      this.auditorDetails.pQualification = 'Possess Certificate to Practice issued by the council of the Institute of chartered accountants of Ceylon';
    } else if (this.auditorDetails.subClauseQualified === '5(1)b') {
      this.auditorDetails.pQualification = 'Has been an officer in the department of Inland revenue not below the rank of assessor';
    } else if (this.auditorDetails.subClauseQualified === '5(1)c') {
      this.auditorDetails.pQualification = 'Posses Diploma in accountancy granted by the Ceylon Technical college or any institute or society recommend by the board';
    } else if (this.auditorDetails.subClauseQualified === '5(1)d') {
      this.auditorDetails.pQualification = 'Has been a member of the Ceylon Audit service not below the rank of superintendent of audit. Class II, Being a person who has been appointed to that service on the results of competitive examination';
    } else if (this.auditorDetails.subClauseQualified === '5(1)e') {
      this.auditorDetails.pQualification = 'Has been a member of the Ceylon government Accountants service not below class III of that service being a person appointed to that service on the results of competitive examination';
    } else if (this.auditorDetails.subClauseQualified === '5(1)f') {
      this.auditorDetails.pQualification = 'A member of any other institute or society of accountants or secretaries approved by the board';
    }
    this.auditorValidationStep2();
  }

  isUnsoundMindPopUp() {
    if (this.auditorDetails.isUnsoundMind === 'yes') {
      alert('Warning! You cannot proceed further');
    }
  }

  auditorValidationStep1() {
    if (
      this.auditorDetails.title &&
      this.auditorDetails.firstname &&
      this.auditorDetails.lastname &&
      this.email && this.validateEmail(this.email) &&
      this.mobile && this.phonenumber(this.mobile) &&
      this.phonenumber(this.tel) &&
      this.auditorDetails.birthDay &&
      this.auditorDetails.nationality &&
      this.auditorDetails.race &&
      this.auditorDetails.residentialLocalAddress1 &&
      this.auditorDetails.residentialLocalAddress2 &&
      this.auditorDetails.residentialProvince &&
      this.auditorDetails.residentialDistrict &&
      this.auditorDetails.residentialCity &&
      this.auditorDetails.rgnDivision &&
      this.auditorDetails.residentialPostCode
    ) {
      this.enableStep1Submission = true;
      if (this.auditorDetails.businessName) {
        if (this.auditorDetails.businessLocalAddress1 &&
          this.auditorDetails.businessLocalAddress2 &&
          this.auditorDetails.businessProvince &&
          this.auditorDetails.businessDistrict &&
          this.auditorDetails.businessCity &&
          this.auditorDetails.gnDivision &&
          this.auditorDetails.businessPostCode

        ) {
          this.enableStep1Submission = true;
        } else {
          this.enableStep1Submission = false;
        }
      } else {
        if (this.auditorDetails.businessLocalAddress1 &&
          this.auditorDetails.businessLocalAddress2 &&
          this.auditorDetails.businessProvince &&
          this.auditorDetails.businessDistrict &&
          this.auditorDetails.businessCity &&
          this.auditorDetails.gnDivision &&
          this.auditorDetails.businessPostCode
        ) {
          this.enableStep1Submission = false;
        } else {
          this.enableStep1Submission = true;
        }
      }
    } else {
      this.enableStep1Submission = false;
    }
  }
  auditorValidationStep2() {
    if (
      this.auditorDetails.isExistAud &&
      this.auditorDetails.pQualification &&
      this.auditorDetails.subClauseQualified &&
      (this.auditorDetails.isUnsoundMind === 'no') &&
      (this.auditorDetails.isInsolventOrBankrupt === 'yes' || this.auditorDetails.isInsolventOrBankrupt === 'no') &&
      (this.auditorDetails.isCompetentCourt === 'yes' || this.auditorDetails.isCompetentCourt === 'no')
    ) {
      this.enableStep2Submission = true;
      if (this.auditorDetails.isInsolventOrBankrupt === 'yes') {
        if (this.auditorDetails.reason1) {
          this.enableStep2Submission = true;
          if (this.auditorDetails.isCompetentCourt === 'yes') {
            if (this.auditorDetails.reason2 === 'pardoned' || this.auditorDetails.reason2 === 'appeal') {
              this.enableStep2Submission = true;
              this.validateExsistingAud();
            } else {
              this.enableStep2Submission = false;
            }
          } else if (this.auditorDetails.isCompetentCourt === 'no') {
            if (this.auditorDetails.reason2 === 'pardoned' || this.auditorDetails.reason2 === 'appeal') {
              this.enableStep2Submission = false;
            } else {
              this.enableStep2Submission = true;
              this.validateExsistingAud();
            }
          }
        } else {
          this.enableStep2Submission = false;
        }
      } else if (this.auditorDetails.isInsolventOrBankrupt === 'no') {
        if (this.auditorDetails.reason1) {
          this.enableStep2Submission = false;
        } else {
          this.enableStep2Submission = true;

          if (this.auditorDetails.isCompetentCourt === 'yes') {
            if (this.auditorDetails.reason2 === 'pardoned' || this.auditorDetails.reason2 === 'appeal') {
              this.enableStep2Submission = true;
              this.validateExsistingAud();
            } else {
              this.enableStep2Submission = false;
            }
          } else if (this.auditorDetails.isCompetentCourt === 'no') {
            if (this.auditorDetails.reason2 === 'pardoned' || this.auditorDetails.reason2 === 'appeal') {
              this.enableStep2Submission = false;
            } else {
              this.enableStep2Submission = true;
              this.validateExsistingAud();
            }
          }
        }
      }
    } else {
      this.enableStep2Submission = false;
    }
  }

  validateExsistingAud() {
    if (this.auditorDetails.isExistAud === '1') {
      if (this.auditorDetails.certificateNo && this.certnum(this.auditorDetails.certificateNo)) {
        this.enableStep2Submission = true;
      } else {
        this.enableStep2Submission = false;
      }
    } else if (this.auditorDetails.isExistAud === '0') {
      this.enableStep2Submission = true;
    }
  }

  gotoSubmit(application, pCertificateUploadList, cert, additional, practiceCertificateUploadList) {

    if (application) {

      for (let i in pCertificateUploadList) {
        if (pCertificateUploadList[i].setkey === 'DOCUMENT_REQUEST_TO_RESUBMIT') {
          this.enableGoToPay = false;
          return false;
        }
        else {
          continue;
        }
      }
      for (let i in application) {
        if (application[i].setkey === 'DOCUMENT_REQUEST_TO_RESUBMIT') {
          this.enableGoToPay = false;
          return false;
        }
        else {
          continue;
        }
      }
      for (let i in cert) {
        if (cert[i].setkey === 'DOCUMENT_REQUEST_TO_RESUBMIT') {
          this.enableGoToPay = false;
          return false;
        }
        else {
          continue;
        }
      }
      for (let i in practiceCertificateUploadList) {
        if (practiceCertificateUploadList[i].setkey === 'DOCUMENT_REQUEST_TO_RESUBMIT') {
          this.enableGoToPay = false;
          return false;
        }
        else {
          continue;
        }
      }
      for (let i in additional) {

        if (additional[i].setkey === 'DOCUMENT_REQUESTED' || additional[i].setkey === 'DOCUMENT_REQUEST_TO_RESUBMIT') {
          this.enableGoToPay = false;

          return false;
        }
        else {
          continue;
        }
      }
    }
    this.enableGoToPay = true;
    return true;
  }

  // for confirm to going document download step...
  areYouSureYes() {
    if (this.auditorDetails.reason2 === 'appeal') {
      if (confirm('You cannot proceed further because of appeal')) {
        this.router.navigate(['dashboard/selectregisterauditor']);
      }
    } else {
      this.blockBackToForm = true;
    }
  }
  areYouSureNo() {
    this.blockBackToForm = false;
  }
  // for confirm to complete payment step...
  areYouSureSubmitYes() {
    this.blockPayment = true;
  }
  areYouSureSubmitNo() {
    this.blockPayment = false;
  }

  dateValidate(type) {
    if (type === 'birthday') {
      const date = this.auditorDetails.birthDay;
      let sendDate: Date = new Date(Date.parse(date.replace(/-/g, ' ')));
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      const age = this.getAge(date);
      if (sendDate > today) {
        alert('The date of birth can\'t be in the future. Please pick another date.');
        this.auditorDetails.birthDay = '';
      } else if (21 > age) {
        alert('Unless you have attained the age of 21 years, you can\'t register as an auditor.');
        this.auditorDetails.birthDay = '';
      }
      return false;
    }
  }

  getAge(DOB) {
    var today = new Date();
    var birthDate = new Date(DOB);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age = age - 1;
    }
    return age;
  }

  private certnum(inputtxt) {
    if (!inputtxt) { return true; }
    // tslint:disable-next-line:prefer-const
    let code = /^.{3,}$/;
    return inputtxt.match(code);
  }

  private validateEmail(email) {
    if (!email) { return false; }
    // tslint:disable-next-line:prefer-const
   // let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     // tslint:disable-next-line:prefer-const
  // let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

   // let re = /^[A-Za-z0-9]([a-zA-Z0-9]+([_.-][a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,4})$/;
   /**
    *  source : https://stackoverflow.com/questions/201323/how-to-validate-an-email-address-using-a-regular-expression?rq=1
    *
    **/
   let re = /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
   // return re.test(String(email).toLowerCase());
    return re.test(email);
  }

  private phonenumber(inputtxt) {
    if (!inputtxt) { return true; }
    // tslint:disable-next-line:prefer-const
    let phoneno = /^\d{10}$/;
    return inputtxt.match(phoneno);
  }

}

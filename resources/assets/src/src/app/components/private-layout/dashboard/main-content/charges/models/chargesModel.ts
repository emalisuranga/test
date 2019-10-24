
export interface IDownloadDoc {
  name: string;
  file_name_key: string;
  download_link: string;
}

export interface IDownloadDocs {
  docs: Array<IDownloadDoc>;
}
export interface ISignedStakeholder {
  id: number;
  name: string;
}
export interface IUploadDoc {
 name: string;
 file_name_key: string;
 doc_comment: string;
 doc_status: string;
 is_required: boolean;
 file_name: string;
 file_type: string;
 dbid: number;
}
export interface IUploadDocs {
  docs: Array<IUploadDoc>;
}

export interface IUploadedDoc {
  name: string;
  file_name_key: string;
  doc_comment: string;
  doc_status: string;
  is_required: boolean;
  file_name: string;
  file_type: string;
  dbid: number;
}

export interface IUploadedDocs {
  docs: Array<IUploadedDoc>;
}

export interface IremoveAnnualDoc {
  companyId: string;
  fileTypeId: number;
}


/************** */

export interface IshareholderItem {
  id: number;
  name: string;
}
export interface IshareholderItems {
  sh: Array<IshareholderItem>;
}

export interface ICallShare {
  id?: number;
  shareholder_id: string;
  shareholder_type: string;
  share_prior_to_this_call?: string;
  value_respect_of_share?: string;
  name_of_shares?: string;
  value_respect_of_total_share?: string;
  showEditPane: number;

}
export interface ICallShares {
  share: Array<ICallShare>;
}

export interface ISubmitCallRecords {
  companyId: string;
  call_records: ICallShares;
  action?: string;
  stated_capital?: string;
  total_amount_of_call?: string;
  signing_party_designation?: string;
  singning_party_name?: string;
}

export interface IremoveCallShareDoc {
  companyId: string;
  fileTypeId: number;
}
export interface Iresubmit {
  companyId: string;
}

/**************** */
export interface IRegisterChargeRecord {
  id?: number;
  total_amount_secured: string;
  satisfaction_amount: string;
  date_of_issue_series: string;
  amount_commisison_allowance: string;
  amount_issue_series: string;
  date_of_resolutions: string;
  manager_date_of_ceasing: string;
  manager_name: string;
  manager_date_of_appointment: string;
  date_of_deed: string;
  description_of_property: string;
  name_of_trustee: string;
  showEditPane: number;

}
export interface IRegisterChargeRecords {
  record: Array<IRegisterChargeRecord>;
}

export interface ISubmitRegisterOfChargesRecords {
  companyId: string;
  register_charges: IRegisterChargeRecords;
  action?: string;
  date_of_registration?: string;
  document_serial_no?: string;
  date_of_creation_of_charge?: string;
  date_of_acquisition_of_property?: string;
  amount_secured_by_charge?: string;
  short_particulars_of_charge?: string;
  person_name_entitled?: string;
}

/**************** */

export interface ICharges {
  id?: number;
  charge_type: string;
  charge_date: string;
  deed_no: string;
  deed_date: string;
  bank_name: string;
  bank_branch: string;
  lawyers: string;
  short_perticular_description ?: string;
  amount_secured: string;
  person_name: string;
  person_address1: string;
  person_address2: string;
  person_address3 ?: string;
  person_description ?: string;
  other_details ?: string;
  signing_party_state ?: string;
  signing_party_name ?: string;
  notarial_type?: string;
  excecuted_in_srilanka?: string;
  excecuted_country?: string;
  exist_record?: string;
  signing_party_state_other?: string;

}
export interface Icountry {
  id: number;
  name: string;
  status: number;
}
export interface ISubmitChargeRegistrationRecords {
  companyId: string;
  charges: ICharges;
  action?: string;
}

export interface IChargeTypes {
  id: number;
  setting_type_id ?: number;
  key: string;
  value: string;
  value_si ?: string;
  value_ta ?: string;
  sort ?: number;
}

export interface IdeedItem  {
  deed_no: string;
  deed_date: string;
  amount_secured: string;
  bank_name: string;
  bank_branch?: string;
  lawyers?: string;
  description?: string;
  id?: number;
  showEditPane?: number;
}

export interface IdeedItems {
  items: Array<IdeedItem>;
}
export interface ISubmitDeedItems {
  companyId: string;
  items: IdeedItems;
}

export interface IEntitledPerson  {
  name: string;
  address_1: string;
  address_2: string;
  address_3?: string;
  bank_name?: string;
  branch_name?: string;
  description?: string;
  id?: number;
  showEditPane?: number;
}

export interface IEntitledPersons {
  items: Array<IEntitledPerson>;
}
export interface ISubmitEntitledPersons {
  companyId: string;
  persons: IEntitledPersons;
}

export interface IRemoveDeedItem {
  companyId: string;
  record_id: number;
}

export interface IRemovePersonItem {
  companyId: string;
  record_id: number;
}
export interface IRemoveOtherDoc {
  file_token: string;
}

export interface IupdateCourtDetails {
  companyId: string;
  court_status: string;
  court_date: string;
  court_case_no: string;
  court_penalty?: string;
  court_period?: string;
  court_discharged?: string;
}

export class ICheckAttachedCompany {
  registration_no: string;
}


export class ISelectedAttachedCompanies {
  regNumber: string;
  name: string;
  id: string;
}

export class IAddAttachedCompanies {
  assignedCompanies: Array<string>;
}

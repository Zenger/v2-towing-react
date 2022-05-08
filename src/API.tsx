import axios from "axios";


export interface ApiResponseModel {
    data?: any,
    meta?: any
}

export interface IAccount {
    id: number;
    hid?: string;
    name?: string;
    phone?: string;
    account_type?: number;
    address?: number;
    meta?: number;
    created_at?: string;
    updated_at?: string;
}

export interface IUnit {
    id: number;
    unit_type: number,
    make: string,
    model: string,
    year: string,
    license: string,
    vin: string,
    color: string,
    meta: string
}

export interface IEmployee {
    id: number;
    email: string;
    password: string;
    name: string;
    phone: string;
    role: number;
    meta: string;
    created_at: string;
    updated_at: string;
}

export interface Charges {
    name: string,
    amount: number
}

export interface ChargeGroup {
    name: string,
    charges: Charges[]
}
export interface PaymentStatus {
    id? : number,
    paid?: boolean,
    payment_type: number,
    payment_date?: string,
    amount: number | string,
    paid_by?: string,
    charges?: Charges[] | string
}

export interface Attachment {
    attachmentType?: string,
    attachmentSrc?: string,
    creationDate?: string
}

export interface IJob {
  id: number;
  from: string;
  destination: string;
  unit: number;
  account: number;
  created_by: number;
  updated_by: number;
  assigned_to: number;
  tow_type: number;
  rate: string;
  meta: string;
  status: number;
  schedule_date: string;
  payment_id: number;
  unit_data?: IUnit;
  account_data?: IAccount;
  employee_data?: IEmployee;
  attachments? : any[],
  created_at: string;
  updated_at: string;
  new?: boolean;
  onCreated?: any;
  onChanged?: any;
  job?: any;
  preventEditing?: boolean;
}

export interface IPageMeta {
    pagination?: IPagination
}

export interface IPagination {
    current_page?: number,
    next_page?: number,
    prev_page?: number,
    total_pages?: number,
    total_count?: number,
    page_size?: number
}

export interface IFleetUnit {
    id: number;
    unit_type?: number,
    make:string,
    model:string,
    year:string,
    license:string,
    vin:string,
    odo:string,
    registration?: string,
    meta?: string
}

export interface IJobMeta {
    notes?: string,
    equipment_type?: number,
    reference_from?: string,
    reference_number?: string,
    attachments?: Attachment[],
    changelog?: string,
}

export interface IOption {
    id: number,
    name: string,
    value: string,
    created_at: string,
    updated_at: string
}


export interface IUser {
    id: number,
    name: string,
    email: string,
    phone: string,
    meta: string,
    role: number,
    created_at: string,
    update_at:string
}

export interface IImpound {
    id: number,
    name: string,
    account_id: number,
    properties: string[],
    authorized: number[]
}

export default class API {

    private static instance: API;

    TEST_BEARER_TOKEN = '<bearer-token>';

    private constructor() { }

    public static getInstance(): API {
        if (!API.instance) {
            API.instance = new API();
        }
        return API.instance;
    }



    public setBearerToken() {

    }

    getHeaderConfigDefault(bearer_token?: string) {
        const token = bearer_token || this.TEST_BEARER_TOKEN;

        if (!token) return;

        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    }


    fetchAccounts(page: number = 1) {
        page = isNaN(page) ? 1 : page;
        return axios.get(process.env.REACT_APP_API_BASE + "/accounts/?page=" + page, this.getHeaderConfigDefault());
    }

    fetchAccount(id: number) {
        return axios.get(process.env.REACT_APP_API_BASE + "/accounts/" + id, this.getHeaderConfigDefault() );
    }

    createAccount(account: IAccount) {
        return axios.post(process.env.REACT_APP_API_BASE + "/accounts/", account, this.getHeaderConfigDefault())
    }

    updateAccount(account: IAccount) {
        return axios.patch(process.env.REACT_APP_API_BASE + "/accounts/" + account.id, account, this.getHeaderConfigDefault())
    }


    fetchUnits( page : number = 1) {
        let qs = isNaN(page) ? "" : "?page=" + page;

        return axios.get(process.env.REACT_APP_API_BASE + `/units/${qs}` , this.getHeaderConfigDefault() );
    }

    fetchUnit(id: number) {
        return axios.get(process.env.REACT_APP_API_BASE + "/units/" + id, this.getHeaderConfigDefault());
    }

    createUnit( unit : IUnit ) {
        return axios.post(process.env.REACT_APP_API_BASE + "/units/", unit, this.getHeaderConfigDefault());
    }


    updateUnit(account: IUnit) {
        return axios.patch(process.env.REACT_APP_API_BASE + "/units/" + account.id, account, this.getHeaderConfigDefault())
    }

    fetchScheduled() {
        return axios.get( process.env.REACT_APP_API_BASE + "/scheduled", this.getHeaderConfigDefault());
    }

    fetchJobs( page : number = 1) {
        return axios.get(process.env.REACT_APP_API_BASE + "/tows/?page=" + page, this.getHeaderConfigDefault() );
    }


    fetchJob( id? : any ) {
        return axios.get( process.env.REACT_APP_API_BASE + "/tows/" + id , this.getHeaderConfigDefault() );
    }

    createJob( job:IJob ){
        return axios.post( process.env.REACT_APP_API_BASE + "/tows/" , this.getHeaderConfigDefault());
    }

    updateJob( job : IJob) {
        return axios.patch( process.env.REACT_APP_API_BASE + "/tows/" + job.id, job, this.getHeaderConfigDefault());
    }

    fetchFleetUnit( id?: any) {
        return axios.get( process.env.REACT_APP_API_BASE + "/fleet_units/" + id , this.getHeaderConfigDefault() );
    }

    fetchFleetUnits(  page : number = 1 ) {
         page = isNaN(page) ? 1 : page;
         return axios.get(process.env.REACT_APP_API_BASE + "/fleet_units/?page=" + page, this.getHeaderConfigDefault() );
    }

    updateFleetUnit( fleetUnit: IFleetUnit ) {
        return axios.patch(process.env.REACT_APP_API_BASE + "/fleet_units/" + fleetUnit.id, fleetUnit, this.getHeaderConfigDefault())
    }

    fetchPaymentInfo(id? : any ) {
        return axios.get( process.env.REACT_APP_API_BASE + "/payments/" + id , this.getHeaderConfigDefault() );
    }

    updatePaymentInfo(id: number | undefined, payment:any) {
        return axios.patch( process.env.REACT_APP_API_BASE + "/payments/" + id, payment, this.getHeaderConfigDefault() );
    }

    fetchOptions( name: string) {
       return axios.get( process.env.REACT_APP_API_BASE + "/options/" + name, this.getHeaderConfigDefault()  )
    }

    updateOptions( name:string, obj:any ) {
        return axios.patch( process.env.REACT_APP_API_BASE + "/options/" + name, obj, this.getHeaderConfigDefault());
    }

    fetchUsers() {
        return axios.get(  process.env.REACT_APP_API_BASE + "/users/", this.getHeaderConfigDefault() );
    }

    updateUser(user: IUser) {
        return axios.patch( process.env.REACT_APP_API_BASE + "/users/" + user.id, user, this.getHeaderConfigDefault());

    }

    search( entity: string, value: string ) {
        return axios.get(  process.env.REACT_APP_API_BASE + "/search/?entity=" + entity + "&query=" + value , this.getHeaderConfigDefault() );
    }

    createAttachment( job_id: number, filename: string = "picture.jpg", form_data: FormData ) {
            if (!process.env.REACT_APP_API_BASE)  process.env.REACT_APP_API_BASE = "http://localhost:3000/";



            return  axios.post(process.env.REACT_APP_API_BASE  + "/attachments/create/" + job_id + "?name=" + filename, form_data, { headers: { "Content-Type": "multipart/form-data" }} )

    }
}

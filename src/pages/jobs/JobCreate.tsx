import {AutoComplete, Button, Card, Col, Dropdown, Menu, Modal, Row, Skeleton, Steps, Upload} from "antd";
import {useEffect, useRef, useState} from "react";
import Account from "../accounts/Account";
import Unit from "../units/Unit";
import Job from "./Job";
import PaymentDetails from "./PaymentDetails";
import {UserAddOutlined, CarOutlined, DollarOutlined, EnvironmentOutlined, CheckOutlined} from "@ant-design/icons";
import {IAccount, IJob, IUnit} from "../../API";

const {Step} = Steps;


const JobCreate = (props: any) => {

    const [isSelectAccountVisible, setSelectAccountVisible] = useState(false);
    const [isSelectUnitVisible, setSelectUnitVisible] = useState(false);

    const [currentStep, setCurrentStep] = useState(0);
    const [nextVisible, setNextVisible] = useState(true);
    const [account, setAccount] = useState({} as IAccount);
    const [unit, setUnit] = useState({} as IUnit);
    const [job, setJob] = useState({} as IJob);
    const [payment, setPayment] = useState({});


    const accountChanged = (account:IAccount) => {
        setAccount(account);
    }

    const unitChanged = (unit: IUnit) => {
        setUnit(unit);
    }

    const onChange = (step:any) => {
        setCurrentStep(step);

    }

    const nextStep = () => {
        setCurrentStep( currentStep + 1);
    }


    const renderAccountStep = () => {
            return <Account new={true} account={account} onCreated={accountCreated} onChanged={accountChanged} hideSaveButton={true} />;
    }

    const renderUnitStep = () => {
        return <Unit new={true} unit={unit} onCreated={unitCreated} onChanged={unitChanged} hideSaveButton={true} />;
    }
    const renderJobStep = () => {
        if (Object.keys(job).length !== 0) {
            return <Job job={job} />
        } else {
            return <Job new={true} onCreated={jobCreated} />;
        }
    }

    const renderPaymentStep = () => {
        if (Object.keys(payment).length !== 0) {
            return <PaymentDetails payment={payment} />
        } else {
            return <PaymentDetails new={true} onCreated={paymentCreated} />
        }
    }

    const accountCreated = (account:IAccount) => {
        setAccount(account);
        setNextVisible(true);
        setCurrentStep( currentStep + 1);
        setNextVisible( false );
    }

    const unitCreated = (unit:IUnit) => {
        setUnit(unit);
        setNextVisible(true);
        setCurrentStep( currentStep + 1);
        setNextVisible( false );
    }


    const jobCreated = (job:IJob) => {
        setJob(job);
        setNextVisible(true);
        setCurrentStep( currentStep + 1);
        setNextVisible( false );
    }

    const paymentCreated = (payment:any) => {
        setPayment(payment);
        setNextVisible(true);
        setCurrentStep( currentStep + 1);
        setNextVisible( false );
    }

    return (

        <>
        <Steps current={currentStep} onChange={onChange}>
            <Step title="Account" icon={<UserAddOutlined />} />
            <Step title="Unit" icon={<CarOutlined />}/>
            <Step title="Job" icon={<EnvironmentOutlined />} />
            <Step title="Payment" icon={<DollarOutlined />} />
            <Step title="Review" icon={<CheckOutlined />} />
        </Steps>
            <>
                { (currentStep === 0) ? renderAccountStep() : "" }
                { (currentStep === 1) ? renderUnitStep() : "" }
                { (currentStep === 2) ? renderJobStep() : "" }
                { (currentStep === 3)? renderPaymentStep() : ""}

                { (nextVisible) ? <Button type="primary" onClick={nextStep} >Next</Button> : ""}
            </>
        </>
    )
}
export default JobCreate;
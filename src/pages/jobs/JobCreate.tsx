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

    const jobChanged = (job: IJob) => {
        setJob(job);
    }

    const paymentChanged = (payment:any) => {
        setPayment(payment);
    }
    const onChange = (step:any) => {
        setCurrentStep(step);
        if (currentStep === 3) {
            setNextVisible(false);
        } else {
            setNextVisible(true);
        }
    }

    const nextStep = () => {
        setCurrentStep( currentStep + 1);
        if (currentStep === 3) {
            setNextVisible(false);
        }
    }


    const renderAccountStep = () => {
            return <Account new={true} account={account} onCreated={accountCreated} onChanged={accountChanged} preventEditing={true} />;
    }

    const renderUnitStep = () => {
        return <Unit new={true} unit={unit} onCreated={unitCreated} onChanged={unitChanged} preventEditing={true} />;
    }
    const renderJobStep = () => {
            return <Job new={true} onCreated={jobCreated} onChanged={jobChanged} preventEditing={true} />;
    }

    const renderPaymentStep = () => {
        return <PaymentDetails new={true} onCreated={paymentCreated} onChanged={paymentChanged} preventEditing={true} />
    }

    const renderReviewStep = () => {
        return <>
            <br/>
             <Row gutter={16}>
                  <Col span={12}>
                     <Card size="small" title="Account Details">
                          <Account preventEditing={true} account={account} />
                     </Card>
                  </Col>
                 <Col span={12}>
                      <Card size="small" title="Unit Details">
                          <Unit preventEditing={true}  unit={unit} />
                      </Card>
                 </Col>
             </Row>
                <br/>
            <Row gutter={16}>
                <Col span={18}>
                    <Card size="small" title="Job Details">
                        <Job preventEditing={true} job={job} />
                    </Card>
                </Col>
                <Col span={6}>
                   <Card size="small" title="Payment Details">
                        <PaymentDetails payment={payment} />
                   </Card>
                </Col>
            </Row>


        </>
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
                { (currentStep === 3) ? renderPaymentStep() : ""}
                { (currentStep === 4) ? renderReviewStep() : "" }

                { (nextVisible) ? <Button type="primary" onClick={nextStep} >Next</Button> : ""}
            </>
        </>
    )
}
export default JobCreate;
import {useEffect, useState} from "react";
import {Button, DatePicker, Descriptions, Divider, Form, Input, Popconfirm, Select} from "antd";

import API, {ChargeGroup, Charges, PaymentStatus} from "../../API";
import {PaymentMethod} from "../../Types";
import ChargeEntry from "./payment/ChargeEntry";

import moment from "moment";
import {PlusOutlined} from "@ant-design/icons";


const { Option } = Select;

const PaymentDetails = (props:any) => {

    const [isEdit, setEdit] = useState( false );
    const [isLoading, setLoading] = useState(false);


    const [priceGroup, setPriceGroups] = useState([] as ChargeGroup[]);
    const [paymentCharges, setPaymentCharges] = useState([] as Charges[]);

    const [total, setTotal ] = useState(0);


    const {id, onChanged, onChargesChanged } = props;

    const [payment, setPayment ] = useState({
            id: props.id,
            paid: props.paid,
            payment_type: props.payment_type,
            amount: props.amount,
            paid_by: props.paid_by,
            payment_date: props.payment_date,
            payment: props.payment,
            total: props.total,
            onChanged: props.onChanged,
            onChargesChanged: props.onChargesChanged,
            new: props.new,
            preventEditing: props.preventEditing
    })



    const isNew = props.new;

    const isEmpty = (obj:Object) => {
        return Object.keys(obj).length === 0;
    }


    useEffect( () => {
        if (props.payment) {
            setPayment(props.payment);
            if (props.payment.charges) {
                setPaymentCharges(props.payment.charges);

                setTotal( props.payment.amount );
            }

        }
        if (Object.keys(paymentCharges).length === 0 && !props.payment) {
            paymentCharges.push(
                {
                    name: "Base Rate",
                    amount: 0

                } as Charges
            )
            setTotal(0);
        }
    }, []);


    const loadPaymentInfo = () => {
        setLoading( true );
        let api = API.getInstance();
        if ( id ) {
            api.fetchPaymentInfo( id ).then( response => {

                let r = response.data;
                r.charges = JSON.parse(r.charges);

                setPaymentCharges( r.charges );
                onChanged( {...payment, ['charges'] : r.charges });

                setPayment( r );
                onChanged( r );

                setLoading( false );
            }).catch( response => {
                console.log(response);
            })
        }
    }

    const handlePaymentChange = ( k: keyof PaymentStatus, value : any) => {
        setPayment( paymentData => ({...paymentData, [k] : value }));
        onChanged(  {...payment, [k] : value } );
    }



    const handleChange = () => {}
    const savePaymentDetails = () => {

        let pp :any = payment;
        pp.charges = JSON.stringify( paymentCharges );
        pp.amount = total;
        setLoading(true);
        let api = API.getInstance();
        api.updatePaymentInfo( pp.id, pp ).then( response => {
            console.log(response );
        }).finally( () => {
            setLoading(false);
        });
    }


    const loadPriceGroups = () => {

        if (priceGroup.length > 0) {
            calculateTotal();
        } else {
            let api = API.getInstance();
            setLoading(true);

            // prefetch
            api.fetchCachedOption("price_group").then( (response:any) => {
                setPriceGroups( response );
                calculateTotal();
            }).finally(
                () => {
                    setLoading(false);
                }
            )


        }

    }

    const setEditState = (e: any) => {
        setEdit(!isEdit)
        loadPriceGroups();
    }

    const setPriceGroup = (target:any) => {
        const selectedPaymentGroup = priceGroup[ target ];
        setPaymentCharges( selectedPaymentGroup.charges );
        onChanged({...payment, ['charges'] : selectedPaymentGroup.charges.slice(0)} )
        calculateTotal();
    }

    const removeCharge = (index:number) => {
        let charges = paymentCharges;
        let valueToRemove = [charges[index]];
        setPaymentCharges( charges.filter( e => !valueToRemove.includes(e)) );
        onChanged( {...payment, ['charges'] : charges.filter( e => !valueToRemove.includes(e)) });
        calculateTotal();
    }

    const addCharge = () => {
        let charge: Charges = { "name": "Towing Charge", "amount": 0};
        let currentCharges = paymentCharges;
        currentCharges.push( charge );
        paymentCharges.slice(0);
        setPaymentCharges( currentCharges.slice(0)); // @TODO: WTH? Why this slicing the array trigger a rerender?
        onChanged( {...payment, ['charges'] : currentCharges.slice(0)});
        calculateTotal();

    }


    const chargeChanged = (i: number, amount: number ) => {
        let pc = paymentCharges;
        pc[i].amount = amount;
        setPaymentCharges( pc.slice(0) );
        onChanged( {...payment, ['charges'] : pc.slice(0)});
        calculateTotal();
    }

    const calculateTotal = () => {
        let _total: number = 0;
        for (let i = 0; i< paymentCharges.length; i++) {
            _total = +_total + +paymentCharges[i].amount;
        }

        let p = payment;
        payment.amount = _total;
        setPayment( payment );
        setTotal( _total );




        //onChanged( {...payment, ['charges'] : paymentCharges.slice(0)});

    }


    const renderEditMode = () => {
        return (
            <div>
                <Form layout="horizontal" labelCol={{ span:8 }} wrapperCol={{ span: 10 }} initialValues={{ remember: true }}>
                    <Form.Item label="Paid">
                        <Select defaultValue={payment.paid?.toString()} value={payment.paid}  onChange={value => handlePaymentChange("paid", value)}>
                            <Option value="false">No</Option>
                            <Option value="true">Yes</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Paid By">
                        <Select defaultValue={payment.payment_type} value={payment.payment_type} onChange={value => handlePaymentChange("payment_type", value)}>
                            {
                                PaymentMethod.map( (el, index) => {
                                    return <Option key={index} value={index}>{el}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label="Payment Date">
                        <DatePicker defaultValue={moment(payment.payment_date) || ""} onChange={ (o, date)=> handlePaymentChange("payment_date", date)} />
                    </Form.Item>


                    <Form.Item label="Paid By">
                        <Input name="paid_by" defaultValue={payment.paid_by} value={payment.paid_by} placeholder="Paid by person or org." onChange={e=>handlePaymentChange("paid_by", e.target.value)} />
                    </Form.Item>

                    <Divider />

                    <Form.Item label="Pricing Group">
                        <Popconfirm title="This will reset current charges. Are you sure?">
                            <Select  onClick={loadPriceGroups} onChange={setPriceGroup}>
                                {
                                    priceGroup.map( (el, index) => {
                                        return <Option key={el.name + index} value={index}>{el.name}</Option>
                                    })
                                }

                            </Select>
                        </Popconfirm>
                    </Form.Item>

                    {
                        paymentCharges.map( (el, i) => {

                            return ( <ChargeEntry key={i} index={i} charge={el} onDelete={removeCharge} onEntryChanged={chargeChanged} /> )
                        })
                    }

                </Form>
                <br />
                <Button onClick={addCharge}><PlusOutlined /></Button> { props.preventEditing ? "" : <Button danger onClick={setEditState}>Cancel</Button> } { props.preventEditing ? "" : <Button type="primary" onClick={savePaymentDetails}>Save</Button>} <span style={{float: "right", fontSize:"16px"}}>Transaction Total: ${total} </span>
            </div>
        )
    }

    const renderDisplayMode = () => {
        return  (<div className="payment-details">
            <Descriptions bordered={true} size="small">
                <Descriptions.Item label="Paid" span={4}>{ payment.paid ? "YES" : "NO"  }</Descriptions.Item>
                <Descriptions.Item label="Type" span={4}>{ PaymentMethod[payment.payment_type] }</Descriptions.Item>
                <Descriptions.Item label="Date" span={4}>{ payment.payment_date }</Descriptions.Item>
                <Descriptions.Item label="Paid By" span={4}>{payment.paid_by }</Descriptions.Item>
                <Descriptions.Item label="Charges" span={4}>
                    <table>
                        <tbody>
                        { paymentCharges.map(( el,i)  => {
                            return (<tr key={i}><td>{el.name}</td><td>{el.amount}</td></tr>)
                        } )}
                        </tbody>
                    </table>
                </Descriptions.Item>
                <Descriptions.Item label="Total" span={4}>${total}</Descriptions.Item>
            </Descriptions>
            <p>
                {props.preventEditing ? "" : <Button onClick={setEditState}>Edit</Button> }
            </p>

        </div>)
    }


    const renderView = () => {
        return (
            <div>{isEdit || isNew ? renderEditMode() : renderDisplayMode()}</div>
        )
    }
    const addPaymentDetails = () => {
        return (
            <p>
                <Button onClick={setEditState}>Add Payment Details</Button>
            </p>
        )
    }

    return (
        <div className="account">
            { renderView() }
        </div>
    )
}

export default PaymentDetails;

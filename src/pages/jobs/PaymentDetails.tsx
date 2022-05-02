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

    const [payment, setPayment] = useState({} as PaymentStatus);

    const [priceGroup, setPriceGroups] = useState([] as ChargeGroup[]);
    const [paymentCharges, setPaymentCharges] = useState([] as Charges[]);

    const [total, setTotal ] = useState(0);


   const {id} = props;


    const isEmpty = (obj:Object) => {
        return Object.keys(obj).length === 0;
    }


    const loadPaymentInfo = () => {
        setLoading( true );
        let api = API.getInstance();
        if ( id ) {
             api.fetchPaymentInfo( id ).then( response => {

                let r = response.data;
                r.charges = JSON.parse(r.charges);

                setPaymentCharges( r.charges );
                setPayment( r );

                console.log( r );

                setLoading( false );
            }).catch( response => {
                console.log(response);
            })
        }


        console.log(`Load Payment Info`);
    }



    useEffect(() => {

        if (id !== undefined) loadPaymentInfo()

        caclulateTotal();

    }, [payment.id]);

    const handlePaymentChange = ( k: keyof PaymentStatus, value : any) => {

        setPayment( paymentData => ({...paymentData, [k] : value }));
    }

    const setPaidBy = (v:string) => {
        let p = payment;
        p.paid_by = v;
        setPayment(p);

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
        let api = API.getInstance();
        setLoading(true);

        api.fetchOptions("price_group").then(response => {
            setPriceGroups( JSON.parse( response.data.value ) );


        }).finally(
            () => {
                setLoading(false);
            }
        )

        console.log(`Load Price Groups`);
    }

    const setEditState = (e: any) => {
        setEdit(!isEdit)
        loadPriceGroups();
    }


    const setPriceGroup = (target:any) => {
       const selectedPaymentGroup = priceGroup[ target ];
       setPaymentCharges( selectedPaymentGroup.charges );
    }



    const removeCharge = (index:number) => {
        let charges = paymentCharges;
        let valueToRemove = [charges[index]];
        setPaymentCharges( charges.filter( e => !valueToRemove.includes(e)) );
        caclulateTotal();
    }

    const addCharge = () => {
        let charge: Charges = { "name": "Towing Charge", "amount": 0};
        let currentCharges = paymentCharges;
        currentCharges.push( charge );
        paymentCharges.slice(0);
        setPaymentCharges( currentCharges.slice(0)); // @TODO: WTH? Why this slicing the array trigger a rerender?
        caclulateTotal();
    }


    const chargeChanged = (i: number, amount: number ) => {
        let pc = paymentCharges;
        pc[i].amount = amount;
        setPaymentCharges( pc.slice(0) );
        caclulateTotal();
    }

    const caclulateTotal = () => {
        let _total: number = 0;
        for (let i = 0; i< paymentCharges.length; i++) {
            _total = +_total + +paymentCharges[i].amount;
        }

        let p = payment;
        payment.amount = _total;
        setPayment( payment );
        setTotal( _total );

        console.log(`Calc Total Payment Info`);
    }


      const renderEditMode = () => {
        return (
            <div>
                 <Form layout="horizontal" labelCol={{ span:8 }} wrapperCol={{ span: 10 }} initialValues={{ remember: true }}>
                    <Form.Item label="Paid">
                         <Select defaultValue={payment.paid?.toString()}  onChange={value => handlePaymentChange("paid", value)}>
                             <Option value="false">No</Option>
                             <Option value="true">Yes</Option>
                        </Select>
                    </Form.Item>
                     <Form.Item label="Paid By">
                         <Select defaultValue={payment.payment_type}>
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
                             <Select onChange={setPriceGroup}>
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
               <Button onClick={addCharge}><PlusOutlined /></Button> <Button danger onClick={setEditState}>Cancel</Button> <Button type="primary" onClick={savePaymentDetails}>Save</Button> <span style={{float: "right", fontSize:"16px"}}>Transaction Total: ${total} </span>
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
                        <Button onClick={setEditState}>Edit</Button>
                    </p>

                </div>)
      }


      const renderView = () => {
        return (
            <div>{isEdit ? renderEditMode() : renderDisplayMode()}</div>
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
            { !isEmpty(payment) ? renderView() : addPaymentDetails() } <br />
        </div>
    )
}

export default PaymentDetails;

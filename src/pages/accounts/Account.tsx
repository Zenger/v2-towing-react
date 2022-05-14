import React from 'react';
import { useState, useEffect } from 'react';

import {Descriptions, Button, Form, Input, message, Col, Row, Space} from 'antd';
import API, { IAccount } from '../../API'
import Mask from "../../Mask";


const { TextArea } = Input;

const Account = (props: any) => {

    const [isEdit, setEdit] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const [account, setAccount] = useState({
        id: props.id,
        name: props.name,
        phone: props.phone,
        address: props.address,
        notes: props.notes,
        new: props.new,
        onCreated: props.onCreated,
        onChanged: props.onChanged,
        preventEditing: props.preventEditing,
    })

    const handleChange = (e: any) => {
        if (e.target.name === "phone") {
            e.target.value = Mask( e.target.value, '###-###-####');
        }
        setAccount(accountData => ({ ...accountData, [e.target.name]: e.target.value }));
        if (props.onChanged) {
            props.onChanged( {...account, [e.target.name]: e.target.value} );
        }
    }

    const setEditState = (e: any) => {
        setEdit(!isEdit)
    }

    const saveAccount = () => {
        let api = API.getInstance();
        setLoading(true);

        if (props.new === true) {
            api.createAccount(account as IAccount).then( (response) => {
                message.success("Account Created");

                account.onCreated( response.data );

            }).catch( (e) => {
                message.error(e);
            }).finally(() => {
                setLoading(false);
            });
        } else {
            api.updateAccount(account as IAccount).then((response) => {
                message.success("Account Saved");
                setEdit(false);
            }).catch(e => {
                message.error(e.message, 1.5);
            }).finally(() => {
                setLoading(false);
            });
        }


    }

    const renderDisplayMode = () => {
        return (
            <Descriptions bordered={true} size="small">
                <Descriptions.Item label="Name" span={2}>{account.name}</Descriptions.Item>
                <Descriptions.Item label="Phone" span={2}><a href={"tel:" + account.phone}>{account.phone}</a></Descriptions.Item>
                <Descriptions.Item label="Address" span={2}><a href="tel:">{account.address}</a></Descriptions.Item>
                <Descriptions.Item label="Notes" span={2}>{account.notes}</Descriptions.Item>
                { props.preventEditing ? "" : <Descriptions.Item label="Edit"><Button onClick={setEditState}>Edit</Button></Descriptions.Item> }
            </Descriptions>
        )
    }

    useEffect(() => {
        if (props.account) {
            setAccount( props.account );
        }
        return () => {
            console.log('Component will be unmount');
        }
    }, []);


    const renderEditMode = () => {


        return (
            <div>
                <Form layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} initialValues={{ remember: true }}>
                    <Form.Item label="Name">
                        <Input name="name" value={account.name} placeholder="eg. Company Name LLC" onChange={handleChange} />
                    </Form.Item>
                    <Form.Item label="Phone">
                        <Input name="phone" value={account.phone} placeholder="111-222-3456" onChange={handleChange}  />
                    </Form.Item>
                    <Form.Item label="Address">
                        <Input name="address" value={account.address} placeholder="eg. 1111 Some St, CITY ST, 99999" onChange={handleChange} />
                    </Form.Item>
                    <Form.Item label="Notes">
                        <TextArea name="notes" value={account.notes} placeholder="eg. Additional Info" onChange={handleChange} />
                    </Form.Item>
                </Form>
                <Row>
                    <Col xs={6} push={4}>
                       <Space>
                           { props.new ? "" : <Button danger onClick={setEditState}>Cancel</Button> }
                           { props.preventEditing ? "" : <Button type="primary" loading={isLoading} onClick={saveAccount}>Save</Button> }
                       </Space>
                    </Col>
                </Row>

                </div>
        )
    }


    return (

        <div className="account">
            {isEdit || props.new ? renderEditMode() : renderDisplayMode()} <br />
        </div>  
    )
    
}




export default Account;

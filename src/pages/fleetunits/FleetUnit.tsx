import React from 'react';
import { useState, useEffect } from 'react';

import {  Descriptions, Button, Form, Input, message } from 'antd';
import API, { IFleetUnit } from '../../API'


const { TextArea } = Input;



const FleetUnit = (props: any) => {



    const [isEdit, setEdit] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const [fleetunit, setFleetUnit] = useState({
        id: props.id,
        unit_type: props.unit_type,
        make: props.make,
        model: props.model,
        year: props.year,
        license: props.license,
        vin: props.vin,
        odo: props.odo,
        registration: props.registration,
        meta: props.meta,
        new: props.new,
        onAccountCreated: props.onAccountCreated
    })


    const handleChange = (e: any) => {
        setFleetUnit(fleetUnitData => ({ ...fleetUnitData, [e.target.name]: e.target.value }));
    }

    const setEditState = (e: any) => {
        setEdit(!isEdit)
    }

    const saveFleetUnit = () => {
        let api = API.getInstance();
        api.updateFleetUnit(fleetunit as IFleetUnit).then((response) => {
            message.success("Saved!");
        }).catch(e => {
            message.error(e.message, 1.5);
        });

    }

    const renderDisplayMode = () => {
        return (
            <Descriptions bordered={true} size="small">
                <Descriptions.Item label="Year" span={2}>{fleetunit.year}</Descriptions.Item>
                <Descriptions.Item label="Make" span={2}>{fleetunit.make}</Descriptions.Item>
                <Descriptions.Item label="Model" span={2}>{fleetunit.model}</Descriptions.Item>
                <Descriptions.Item label="VIN" span={2}>{fleetunit.vin}</Descriptions.Item>
                <Descriptions.Item label="License" span={2}>{fleetunit.license}</Descriptions.Item>
                <Descriptions.Item label="ODO" span={2}>{fleetunit.odo}</Descriptions.Item>
                <Descriptions.Item label="Registration" span={2}>{fleetunit.registration}</Descriptions.Item>
                <Descriptions.Item label="Notes" span={2}>{fleetunit.meta}</Descriptions.Item>

                <Descriptions.Item label="Edit"><Button onClick={setEditState}>Edit</Button></Descriptions.Item>
            </Descriptions>
        )
    }

    useEffect(() => {
        console.log('FleetUnit mounted ');
        return () => {
            console.log('FleetUnit is unmounted ');
        }
    });


    const renderEditMode = () => {


        return (
            <div>
                <Form layout="horizontal" labelCol={{ span: 1 }} wrapperCol={{ span: 16 }} initialValues={{ remember: true }}>
                    <Form.Item label="Year">
                        <Input name="year" value={fleetunit.year} placeholder="Year" onChange={handleChange} />
                    </Form.Item>
                    <Form.Item label="Make">
                        <Input name="make" value={fleetunit.make} placeholder="Make" onChange={handleChange} />
                    </Form.Item>
                    <Form.Item label="Model">
                        <Input name="model" value={fleetunit.model} placeholder="Model" onChange={handleChange} />
                    </Form.Item>
                    <Form.Item label="ODO">
                        <Input name="odo" value={fleetunit.odo} placeholder="ODO" onChange={handleChange} />
                    </Form.Item>
                    <Form.Item label="VIN">
                        <Input name="vin" value={fleetunit.vin} placeholder="VIN" onChange={handleChange} />
                    </Form.Item>
                    <Form.Item label="License">
                        <Input name="license" value={fleetunit.license} placeholder="License" onChange={handleChange} />
                    </Form.Item>
                    <Form.Item label="Registration">
                        <Input name="registration" value={fleetunit.registration} placeholder="Registration" onChange={handleChange} />
                    </Form.Item>
                    <Form.Item label="Notes">
                        <TextArea name="meta" value={fleetunit.meta} placeholder="eg. Additional Info" onChange={handleChange} />
                    </Form.Item>
                </Form>
                <Button danger onClick={setEditState}>Cancel</Button> <Button type="primary" onClick={saveFleetUnit}>Save</Button>
            </div>
        )
    }


    return (
        <div className="account">
            {isEdit ? renderEditMode() : renderDisplayMode()} <br />
        </div>
    )

}
export default FleetUnit;

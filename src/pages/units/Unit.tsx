import React from 'react';
import { useState, useEffect } from 'react';

import {  Descriptions, Button, Form, Input, message,  Select } from 'antd';
import API, { IUnit } from '../../API'

import { UnitType } from '../../Types';

const { TextArea } = Input;

const { Option } = Select;



const Unit = (props: any) => {


    const [isEdit, setEdit] = useState(false);
    const [unit, setUnit] = useState({
        id: props.id,
        unit_type: props.unit_type,
        make: props.make,
        model: props.model,
        year: props.year,
        license: props.license,
        vin: props.vin,
        color: props.color,
        meta: props.meta
    })

    const handleChange = (e: any) => {
        setUnit(unitData => ({ ...unitData, [e.target.name]: e.target.value }));
    }

    const handleSelect = (value :any) => {
       
        setUnit(unitData => ({ ...unitData, "unit_type": value }));
    }

    const setEditState = (e: any) => {
        setEdit(!isEdit)
    }

    const saveUnit = () => {
        let api = API.getInstance();
        api.updateUnit(unit as IUnit).then((response) => {
            console.log('yeet');
        }).catch(e => {
            message.error(e.message, 1.5);
        });

    }

    const renderDisplayMode = () => {
        return (
            <Descriptions bordered={true} size="small">
                <Descriptions.Item label="Year">{unit.year}</Descriptions.Item>
                <Descriptions.Item label="Make">{unit.make}</Descriptions.Item>
                <Descriptions.Item label="Model">{unit.model}</Descriptions.Item>
                <Descriptions.Item label="VIN">{unit.vin}</Descriptions.Item>
                <Descriptions.Item label="License">{unit.license}</Descriptions.Item>
                <Descriptions.Item label="Color">{unit.color}</Descriptions.Item>
                <Descriptions.Item label="Type">{UnitType[ unit.unit_type] }</Descriptions.Item>
                <Descriptions.Item label="Notes" span={2}>{unit.meta}</Descriptions.Item>
                <Descriptions.Item label="Edit"><Button onClick={setEditState}>Edit</Button></Descriptions.Item>
            </Descriptions>
        )
    }

    useEffect(() => {
        if (props.unit) {
            setUnit( props.unit );
        }

        return () => {
            console.log('Unit unmounting...');
        }


    }, [props] );


    const renderEditMode = () => {


        return (
            <div>
                <Form layout="horizontal" labelCol={{ span: 1 }} wrapperCol={{ span: 16 }} initialValues={{ remember: true }}>
                    <Form.Item label="Year">
                        <Input name="year" value={unit.year} placeholder="eg. 2019" onChange={handleChange} />
                    </Form.Item>
                    <Form.Item label="Make">
                        <Input name="make" value={unit.make} placeholder="eg. Acura" onChange={handleChange} />
                    </Form.Item>
                    <Form.Item label="Model">
                        <Input name="model" value={unit.model} placeholder="eg. Integra" onChange={handleChange} />
                    </Form.Item>
                    <Form.Item label="License">
                        <Input name="license" value={unit.license} placeholder="2 digit state - plate number" onChange={handleChange} />
                    </Form.Item>
                    <Form.Item label="VIN">
                        <Input name="vin" value={unit.vin} placeholder="13 digit vehicle identification number" onChange={handleChange} />
                    </Form.Item>
                    <Form.Item label="Color">
                        <Input name="color" value={unit.color} placeholder="eg. Red" onChange={handleChange} />
                    </Form.Item>
                    <Form.Item label="Type">
                        <Select defaultValue={unit.unit_type} onChange={handleSelect}>
                            {
                                UnitType.map( (type, i) => {
                                    return (<Option key={i} value={i} >{type}</Option> )
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label="Notes">
                        <TextArea name="meta" value={unit.meta} placeholder="Notes" onChange={handleChange} />
                    </Form.Item>
                </Form>
                <Button danger onClick={setEditState}>Cancel</Button> <Button type="primary" onClick={saveUnit}>Save</Button>
            </div>
        )
    }


    return (
        <div className="unit">
            {isEdit ? renderEditMode() : renderDisplayMode()} <br />
        </div>
    )

}




export default Unit;

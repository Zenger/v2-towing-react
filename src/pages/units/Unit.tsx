import React from 'react';
import { useState, useEffect } from 'react';

import {Descriptions, Button, Form, Input, message, Select, Col, Space, Row} from 'antd';
import API, { IUnit } from '../../API'

import { UnitType } from '../../Types';


import Mask from "../../Mask";

const { TextArea } = Input;

const { Option } = Select;



const Unit = (props: any) => {


    const [isEdit, setEdit] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [unit, setUnit] = useState({
        id: props.id,
        unit_type: props.unit_type,
        make: props.make,
        model: props.model,
        year: props.year,
        license: props.license,
        vin: props.vin,
        color: props.color,
        meta: props.meta,
        new: props.new,
        onCreated: props.onCreated,
        onChanged: props.onChanged,
        preventEditing: props.preventEditing
    })

    const handleChange = (e: any) => {
        if (e.target.name === "license") {
            e.target.value = Mask( e.target.value, 'XX-XXXXXXXXX');
        } else if (e.target.name === "vin") {
            e.target.value = Mask( e.target.value, '#################');
        } else if (e.target.name === "year") {
            e.target.value = Mask( e.target.value , "####");
        }
        setUnit(unitData => ({ ...unitData, [e.target.name]: e.target.value }));
        if (props.onChanged) {
            props.onChanged( unit );
        }
    }

    const handleSelect = (value :any) => {
        setUnit(unitData => ({ ...unitData, "unit_type": value }));
    }

    const setEditState = (e: any) => {
        setEdit(!isEdit)
    }

    const saveUnit = () => {
        let api = API.getInstance();
        setLoading(true);

        if ( props.new === true) {
           api.createUnit( unit as IUnit).then( (response) => {
                props.onCreated( response.data );
                message.success("Unit was created!");
           }).catch( (e:any) => {
               message.error(e.message);
           }).finally( () => {
               setLoading(false);
           });
        }  else {
            api.updateUnit(unit as IUnit).then((response) => {
            message.success("Unit was updated!");
            }).catch( (e:any) => {
                message.error(e.message, 1.5);
            }).finally( () => {
                setLoading(false);
            })
        }


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
                { props.preventEditing ? "" : <Descriptions.Item label="Edit"><Button onClick={setEditState}>Edit</Button></Descriptions.Item> }
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


    }, [] );


    const renderEditMode = () => {


        return (
            <div>
                <Form layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} initialValues={{ remember: true }}>
                    <Form.Item label="Year">
                        <Input type="number" name="year" value={unit.year} placeholder="eg. 2019" onChange={handleChange} />
                    </Form.Item>
                    <Form.Item label="Make">
                        <Input name="make" value={unit.make} placeholder="eg. Acura" onChange={handleChange} />
                    </Form.Item>
                    <Form.Item label="Model">
                        <Input name="model" value={unit.model} placeholder="eg. Integra" onChange={handleChange} />
                    </Form.Item>
                    <Form.Item label="License">
                        <Input name="license" value={unit.license} placeholder="STATE CODE - plate number" onChange={handleChange} />
                    </Form.Item>
                    <Form.Item label="VIN">
                        <Input name="vin" value={unit.vin} placeholder="17 digit vehicle identification number" onChange={handleChange} />
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
                <Row>
                    <Col xs={6} push={4}>
                        <Space>
                            { props.new ? "" : <Button danger onClick={setEditState}>Cancel</Button> }
                            { props.preventEditing ? "" : <Button type="primary" loading={isLoading} onClick={saveUnit}>Save</Button> }
                        </Space>
                    </Col>
                </Row>
            </div>
        )
    }


    return (
        <div className="unit">
            {isEdit || props.new ? renderEditMode() : renderDisplayMode()} <br />
        </div>
    )

}




export default Unit;

import React from 'react';
import { useState, useEffect } from 'react';

import { Card, Row, Col, Descriptions, Button, Form, Input, message, Collapse, Select, DatePicker } from 'antd';
import API, {IEmployee, IJob, IJobMeta, IUnit, PaymentStatus} from '../../API'
import {EquipmentType, JobType, PaymentMethod, StatusType} from "../../Types";
import Config from "../../Config";


const { Option } = Select;


const { TextArea } = Input;

const { Panel } = Collapse;


const getAvailableDriverList = () => {
    let names = sessionStorage.getItem('users');
    if (names) {

        return JSON.parse(names);
    } else {
        return [];
    }
}

const parseDisplayNames = (j:any, id:string|number) => {
    let names = JSON.parse(j);
    for (let i =0; i < names.length; i++) {
        if (names[i].id === id) {
            return names[i].name;
        }
    }
}

const getDisplayNameFromSession = (id:string|number) => {
    let names = sessionStorage.getItem('users');
    if (!names) {
        let api = API.getInstance();
        api.fetchUsers().then( (res) => {
            sessionStorage.setItem('users', JSON.stringify(res.data.data));
            return parseDisplayNames(JSON.stringify(res.data.data), id);
        }).catch( (e) => {
            message.error(e);
        })
    }
    else {
        return parseDisplayNames(names, id);
    }
}



const Job = (props: any) => {

    const [isCollapsed, setCollapsed] = useState(false);

    const [isEdit, setEdit] = useState(false);
    const [job, setJob] = useState({
          id: props.id,
          from: props.from,
          destination: props.destination,
          unit: props.unit,
          account: props.account,
          created_by: props.created_by,
          updated_by: props.updated_by,
          assigned_to: props.assigned_to,
          tow_type: props.tow_type,
          rate: props.rate,
          meta: props.meta as IJobMeta,
          status: props.status,
          schedule_date: props.schedule_date,
          payment_id: props.payment_id,
          created_at: props.created_at,
          updated_at: props.updated_at,
          new: props.new,
          onCreated: props.onCreated,
          onChanged: props.onChanged,
          preventEditing: props.preventEditing,
          job: props.job
    })

    const handleChange = (e: any) => {
        setJob(jobData => ({ ...jobData, [e.target.name]: e.target.value }));
        if (props.onChanged) {
            props.onChanged( { ...job, [e.target.name]: e.target.value} );
        }
    }


    useEffect(() => {
        if (props.job) {
            setJob( props.job );
        }
    });

    type JM = keyof IJobMeta;

    const handleMetaChange = (key: JM, value:any) => {
        let jobMeta = job.meta || {};
        jobMeta[key] = value || "";

        setJob( jobData => ({...jobData, ["meta"] : jobMeta }));
        if (props.onChanged){
            props.onChanged( {...job, ["meta"]: jobMeta });
        }
        return value;

    }

    const setEditState = (e: any) => {
        setEdit(!isEdit)
    }

    const saveJob = () => {
        let api = API.getInstance();
        if (props.new === true) {
            api.createJob(job as IJob).then((response) => {
                message.success("Job created!");
                props.onCreated( response.data );
            }).catch(e => {
                message.error(e.message, 1.5);
            }).finally(() =>{

            })
        } else {
            api.updateJob(job as IJob).then((response) => {
                message.success("Job Saved!");
            }).catch(e => {
                message.error(e.message, 1.5);
            }).finally(() =>{

            })
        }


    }

    const renderDisplayMode = () => {

        const from_map_url = Config.getMapProviderUrl( job.from );
        const to_map_url = Config.getMapProviderUrl( job.destination );


        return (
           <div>
                <Descriptions bordered={true} size="small">
                    <Descriptions.Item label="From" ><a target="_blank" href={from_map_url}>{job.from}</a></Descriptions.Item>
                    <Descriptions.Item label="To" span={2}><a target="_blank" href={to_map_url}>{job.destination}</a></Descriptions.Item>
                    <Descriptions.Item label="Status">{ StatusType [ job.status || 0 ]}</Descriptions.Item>
                    <Descriptions.Item label="Type">{ JobType[ job.tow_type || 0 ]}</Descriptions.Item>
                    <Descriptions.Item label="Equipment">{ EquipmentType[ job.meta?.equipment_type || 0 ]}</Descriptions.Item>
                    <Descriptions.Item label="Reference From">{ job.meta?.reference_from || "N/A" }</Descriptions.Item>
                    <Descriptions.Item label="Reference Number">{ job.meta?.reference_number || "N/A" }</Descriptions.Item>
                    <Descriptions.Item label="Notes">{ job.meta?.notes || "N/A" }</Descriptions.Item>
                    <Descriptions.Item label="Driver">{ getDisplayNameFromSession(job.assigned_to) || "N/A" }</Descriptions.Item>
                    { props.preventEditing ? "" : <Descriptions.Item label="Edit"><Button onClick={setEditState}>Edit</Button></Descriptions.Item> }
                </Descriptions>


               { (job.meta?.changelog) ?

                    <Card size="small" title="Stats">
                       <p>
                           { job.meta?.changelog }
                       </p>
                   </Card>
                   : ""
               }



           </div>
        )
    }



    const renderEditMode = () => {
        return (
              <div>
                <Form layout="horizontal" labelCol={{ span: 3 }} wrapperCol={{ span: 16 }} initialValues={{ remember: true }}>
                    <Form.Item label="Address From">
                        <Input name="from" value={job.from} placeholder="Pickup address" onChange={handleChange} />
                    </Form.Item>
                    <Form.Item label="Address To">
                        <Input name="destination" value={job.destination} placeholder="Drop off address if applicable" onChange={handleChange} />
                    </Form.Item>

                    <Form.Item label="Status">
                        <Select value={ job.status || 0 } style={{ width: 300 }} onChange={event => {
                            handleChange({
                                target : {
                                    name : "status",
                                    value: event
                                },
                            });
                        }}>
                            { StatusType.map( (el, i)  => <Option value={i}>{el}</Option> ) }
                        </Select>
                    </Form.Item>

                    <Form.Item label="Job Type">
                        <Select value={ job.tow_type || 0 } style={{ width: 300 }} onChange={event => {
                            handleChange({
                                target : {
                                    name : "tow_type",
                                    value: event
                                },
                            });
                        }}>
                            { JobType.map( (el, i)  => <Option value={i}>{el}</Option> ) }
                        </Select>
                    </Form.Item>
                    <Form.Item label="Equipment">
                        <Select value={ job.meta?.equipment_type || 0 } style={{ width: 300 }} onChange={value => handleMetaChange("equipment_type", value)}>
                            { EquipmentType.map( (el, i)  => <Option value={i}>{el}</Option> ) }
                        </Select>
                    </Form.Item>

                    <Form.Item label="Reference From">
                        <Input name="meta.reference_from" value={job.meta?.reference_from || ""} placeholder="Reference if applicable" onChange={e=>handleMetaChange("reference_from", e.target.value)} />
                    </Form.Item>
                     <Form.Item label="Reference Number">
                        <Input name="meta.reference_number" value={job.meta?.reference_number || ""} placeholder="Reference number if applicable" onChange={e=>handleMetaChange("reference_number", e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Notes">
                        <TextArea name="meta.notes" value={job.meta?.notes || ""} placeholder="Notes" onChange={e=>handleMetaChange("notes", e.target.value)} />
                    </Form.Item>

                    <Form.Item label="Drivers">
                        <Select value={job.assigned_to || 0} style={{width: 300}} onChange={ e => handleChange({
                                target : {
                                    name : "assigned_to",
                                    value: e
                                },
                            })}>
                            {
                                getAvailableDriverList().map( (e:any, i:number) => {

                                   return <Option value={e.id}>{e.name}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>


                </Form>
                  { props.new ? "" : <Button danger onClick={setEditState}>Cancel</Button> } { props.preventEditing ? "" : <Button type="primary" onClick={saveJob}>Save</Button> }
            </div>
        )
    }


    return (
        <div className="account">
            {isEdit || props.new ? renderEditMode() : renderDisplayMode()} <br />
        </div>
    )

}




export default Job;

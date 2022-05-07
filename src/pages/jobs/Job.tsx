import React from 'react';
import { useState, useEffect } from 'react';

import { Card, Row, Col, Descriptions, Button, Form, Input, message, Collapse, Select, DatePicker } from 'antd';
import API, {IEmployee, IJob, IJobMeta, IUnit, PaymentStatus} from '../../API'
import {EquipmentType, JobType, PaymentMethod, StatusType} from "../../Types";
import Config from "../../Config";


const { Option } = Select;


const { TextArea } = Input;

const { Panel } = Collapse;



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
    })

    const handleChange = (e: any) => {


        setJob(jobData => ({ ...jobData, [e.target.name]: e.target.value }));
    }


    type JM = keyof IJobMeta;

    const handleMetaChange = (key: JM, value:any) => {
        let jobMeta = job.meta || {};
        jobMeta[key] = value || "";

        setJob( jobData => ({...jobData, ["meta"] : jobMeta }));
        console.log( job, jobMeta);
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
            api.createJob(job as IJob).then((response) => {
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
                    <Descriptions.Item label="Edit"><Button onClick={setEditState}>Edit</Button></Descriptions.Item>
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
                        <Select defaultValue={ job.status || 0 } style={{ width: 300 }} onChange={event => {
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
                        <Select defaultValue={ job.tow_type || 0 } style={{ width: 300 }} onChange={event => {
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
                        <Select defaultValue={ job.meta?.equipment_type || 0 } style={{ width: 300 }} onChange={value => handleMetaChange("equipment_type", value)}>
                            { EquipmentType.map( (el, i)  => <Option value={i}>{el}</Option> ) }
                        </Select>
                    </Form.Item>

                    <Form.Item label="Reference From">
                        <Input name="meta.reference_from" value={job.meta?.reference_from || ""} placeholder="Reference if applicable" onChange={e=>handleMetaChange("reference_from", e.target.value)} />
                    </Form.Item>
                     <Form.Item label="Reference Number">
                        <Input name="meta.reference_number" value={job.meta?.reference_number || ""} placeholder="Reference number if applicable" onChange={e=>handleMetaChange("reference_number", e.target.value)} />
                    </Form.Item>



                </Form>
                  { props.new ? "" : <Button danger onClick={setEditState}>Cancel</Button> }<Button type="primary" onClick={saveJob}>Save</Button>
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

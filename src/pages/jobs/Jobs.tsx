import { useEffect, useState } from "react";
import API, { IJob, IPageMeta, IPagination } from "../../API";

import Config from "../../Config"

import {Button, Skeleton, Collapse, Pagination, Tag, message, Result} from "antd";
import Job from "./Job";
import { useParams, useNavigate } from "react-router-dom";


type IPageParams = {
    page: string,
}

const { Panel } = Collapse;


const Jobs = (props: any) => {

    const [isLoading, setLoading] = useState(false);

    const [data, setData] = useState([] as IJob[]);
    const [scheduled, setScheduled] = useState([]);
    const [totalPages, setTotalPages] = useState();
    const [isError, setError] = useState(false);
    const [errorReason, setErrorReason] = useState("");

    const { page } = useParams<keyof IPageParams>() as IPageParams;


    let navigate = useNavigate();

    const loadJobs = () => {
        setLoading(true);
        let api = API.getInstance();

        console.log(`mounted ${page}`);

        api.fetchJobs(parseInt(page)).then(response => {
            setLoading(false);
            setData(response.data.data);
            setTotalPages(response.data.meta.pagination.total_count);

        }).catch((e) => {

            setError(true);
            setErrorReason(e.message);

        }).finally(() => {
            setLoading(false);
        })
    }

    const loadScheduled = () => {
        setLoading(true);
        let api = API.getInstance();

        api.fetchScheduled().then( response => {
            setLoading( false )
            setScheduled(response.data.data);
        }).catch((e) => {

            setError(true);
            setErrorReason(e.message);

        }).finally(() => {
            setLoading(false);
        })
    }


    useEffect(() => {

        loadScheduled()
        loadJobs()
        return () => {
          return;
        }
    }, []);


    const changePage = (page: Number) => {

        navigate("/jobs/" + page);
        loadJobs();
    }


    const renderPanelHeader = (unit: any) => {
        return (
            <span><span>{unit.year} {unit.make} {unit.model}</span><span style={{ float: "right" }}>{unit.vin} {unit.color} <strong>{unit.license}</strong></span></span>
        )
    }


    const renderRow = (job: any) => {
        const job_url = "/job/" + job.id;

        const from_map_url = Config.getMapProviderUrl( job.from );
        const dest_map_url = Config.getMapProviderUrl(job.destination);
        const unit_url = "/unit/" + job.unit;
        const user_url = "/user/" + job.assigned_to;
        const account_url = "/account/" + job.account;

        const status_background = ["status-open", "status-open", "status-cancelled", "status-closed", "status-scheduled"];

        const background_class = (job.status != null && job.status != undefined) ? status_background[ job.status ] : "status-open";



        return (
                <tr key={job.id}>
                    <td className={background_class}><a href={job_url}>{job.id}</a></td>
                    <td><a href={from_map_url} target="_blank">{job.from}</a></td>
                    <td><a href={dest_map_url} target="_blank">{job.destination}</a></td>
                    <td><a href={unit_url}>{job.unit_data.year} {job.unit_data.make} {job.unit_data.model} {job.unit_data.license}</a></td>
                    <td><a href={account_url}>{job.account_data.name} {job.account_data.phone}</a></td>
                    <td><a href={user_url}><Tag>{job.assignee_data.name}</Tag></a></td>

                </tr>
        )
    }


    const renderScheduled = () => {
        let size = scheduled.length || 0;
        let scheduled_header = "Scheduled: " + size;

        if (size > 0) {
            return (
                <div className="scheduled-wrapper">
                    <Collapse collapsible="header">
                            <Panel key="scheduled" header={scheduled_header}>
                                <table className="main-jobs-table">
                                    {
                                        scheduled.map( job => {
                                            return renderRow(job)
                                        })
                                    }
                                </table>
                            </Panel>
                        </Collapse>
                        <br />
                </div>
            )
        }
       else {
           return ""
        }
    }


    if (isLoading) {
        return <Skeleton active />
    }

    if (isError) {
        return (
            <Result
                status="500"
                title={errorReason}
                extra={
                    <Button onClick={() => {  window.location.reload() }
                    } type="primary">Retry</Button>
                }
            />
        )
    }
    else {
        return (
            <div>
                { renderScheduled() }

                <table className="main-jobs-table">
                    <thead>
               			<tr>
                            <th >#</th>
                            <th>FROM</th>
                            <th>TO</th>
                            <th>UNIT</th>
                            <th>ACCOUNT</th>
                            <th>DRIVER</th>

                        </tr>
                    </thead>
                    <tbody>
                    {
                        data.map( job => {
                            return renderRow( job )
                        })
                    }
                    </tbody>
                </table>



                <br />


                <Pagination defaultCurrent={parseInt(page)} defaultPageSize={25} total={totalPages} showSizeChanger={false} onChange={changePage} />
            </div>
        )
    }
}


export default Jobs;

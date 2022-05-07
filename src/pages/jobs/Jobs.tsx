import { useEffect, useState } from "react";
import API, { IJob, IPageMeta, IPagination } from "../../API";
import Config from "../../Config";
import {Button, Skeleton, Collapse, Tag, message, Result} from "antd";
import Job from "./Job";
import { useParams, useNavigate } from "react-router-dom";
import Pagination from "react-js-pagination";
import { ReactComponent as IconGas } from '../../icons/icon_gas.svg';
import { ReactComponent as IconJumpStart } from '../../icons/icon_jump_start.svg';
import { ReactComponent as IconLockOut } from '../../icons/icon_lock_out.svg';
import { ReactComponent as IconTireChange } from '../../icons/icon_tire_change.svg';
import { ReactComponent as IconTowing } from '../../icons/icon_towing.svg';
import { ReactComponent as IconWinchOut } from '../../icons/icon_winch_out.svg';
import {PlusOutlined} from "@ant-design/icons";

type IPageParams = {
    page: string,
}

interface IJobs {
    data: IJob[],
    meta: IPageMeta
}

const { Panel } = Collapse;
const Jobs = (props: any) => {

    const [isLoading, setLoading] = useState(false);

    const [data, setData] = useState([] as IJob[]);
    const [scheduled, setScheduled] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [isError, setError] = useState(false);
    const [errorReason, setErrorReason] = useState("");

    const [currentPage, setCurrentPage ] = useState(0 );


    let navigate = useNavigate();
    const loadJobs = () => {
        setLoading(true);
        let api = API.getInstance();

        let params = new URLSearchParams(window.location.search);
        let page : number = Number(params.get('page'));
        if (page === 0 ) page = 1;
        setCurrentPage(page);

        api.fetchJobs(page).then(response => {
            setLoading(false);
            const jobs : IJobs = response.data;
            setData(jobs.data);
            const totalPages : number =  jobs.meta?.pagination?.total_count || 0;
            setTotalPages(totalPages );

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
        navigate("/jobs/?page=" + page);
        loadJobs();
    }

    const getJobIcon = (job_type:number) => {
        switch (job_type) {
            case 1:
                return <IconTowing />
            case 8:
                return <IconTireChange />
            case 9:
                return <IconLockOut />
            case 10:
                return <IconJumpStart />
            case 11:
                return <IconGas />
            case 13:
                return <IconWinchOut />
            case 14:
                return <IconWinchOut />
            default:
                return <IconTowing />
        }
    }


    const renderRow = (job: any) => {
        const job_url = "/jobs/" + job.id;
        const from_map_url = Config.getMapProviderUrl( job.from );
        const dest_map_url = Config.getMapProviderUrl(job.destination);
        const unit_url = "/unit/" + job.unit;
        const user_url = "/user/" + job.assigned_to;
        const account_url = "/account/" + job.account;
        const status_background = ["status-open", "status-open", "status-cancelled", "status-closed", "status-scheduled"];
        const background_class = (job.status !== null && job.status !== undefined) ? status_background[ job.status ] : "status-open";
        return (
                <tr key={job.id}>
                    <td className={background_class}><a href={job_url}>{job.id} { getJobIcon(job.tow_type) }</a></td>
                    <td><a href={from_map_url} target="_blank" rel="noreferrer">{job.from}</a></td>
                    <td><a href={dest_map_url} target="_blank" rel="noreferrer">{job.destination}</a></td>
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
                <Button onClick={() => { navigate('/jobs/create') }} type="primary" style={{"float": "right"}}><PlusOutlined /> Add New </Button> <br/> <br/>
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


                <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={25}
                    totalItemsCount={totalPages}
                    pageRangeDisplayed={5}
                    onChange={changePage}
                />
            </div>
        )
    }
}


export default Jobs;

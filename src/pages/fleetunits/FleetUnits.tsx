import { useEffect, useState } from "react";
import API, { IFleetUnit } from "../../API";

import {  Skeleton, Collapse, Pagination } from "antd";
import FleetUnit from "./FleetUnit";
import { useParams, useNavigate } from "react-router-dom";


type IPageParams = {
    page: string,
}

const { Panel } = Collapse;


const FleetUnits = (props: any) => {

    const [isLoading, setLoading] = useState(false);
    const [id, setId] = useState(0);

    const [data, setData] = useState([] as IFleetUnit[]);
    const [totalPages, setTotalPages] = useState();

    const { page } = useParams<keyof IPageParams>() as IPageParams;



    let navigate = useNavigate();

    const loadAccounts = () => {
        setLoading(true);
        let api = API.getInstance();

        console.log(`mounted ${page}`);

        api.fetchFleetUnits(parseInt(page)).then(response => {
            setLoading(false);
            setData(response.data.data);
            setTotalPages(response.data.meta.pagination.total_count);

        });
    }


    useEffect(() => {

        loadAccounts()

        return () => {
            console.log('Component will be unmount');
        }
    }, [id]);


    const changePage = (page: Number) => {

        navigate("/fleet/" + page);
        loadAccounts();
    }


    const renderPanelHeader = (fleetUnit :any) => {
        return (
            <span><span>{fleetUnit.year} {fleetUnit.model} {fleetUnit.model} </span><strong style={{float: "right"}}>{fleetUnit.vin} {fleetUnit.license}</strong></span>
        )
    }


    if (isLoading) {
        return <Skeleton active />
    }
    else {
        return (
            <div>
                <Collapse collapsible="header">
                    {
                        data.map(fleetUnit => {
                            return (
                                <Panel key={fleetUnit.id} header={renderPanelHeader(fleetUnit)}>
                                    <FleetUnit {...fleetUnit} />
                                </Panel>
                            )
                        })
                    }
                </Collapse>


                <br />


                <Pagination defaultCurrent={parseInt(page)} defaultPageSize={25} total={totalPages} showSizeChanger={false} onChange={changePage} />
            </div>
        )
    }
}


export default FleetUnits;

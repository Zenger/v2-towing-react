import { useEffect, useState } from "react";
import API, { IUnit, IPageMeta, IPagination } from "../../API";

import { Button, Skeleton, Collapse, Pagination } from "antd";
import Unit from "./Unit";
import { useParams, useNavigate } from "react-router-dom";


type IPageParams = {
    page: string,
}

const { Panel } = Collapse;


const Units = (props: any) => {

    const [isLoading, setLoading] = useState(false);
    const [id, setId] = useState(0);

    const [data, setData] = useState([] as IUnit[]);
    const [totalPages, setTotalPages] = useState();

    const { page } = useParams<keyof IPageParams>() as IPageParams;


    let navigate = useNavigate();

    const loadUnits = () => {
        setLoading(true);
        let api = API.getInstance();

        console.log(`mounted ${page}`);

        api.fetchUnits(parseInt(page)).then(response => {
            setLoading(false);
            setData(response.data.data);
            setTotalPages(response.data.meta.pagination.total_count);

        });
    }


    useEffect(() => {

        loadUnits()

        return () => {
            console.log('Component will be unmount');
        }
    }, [id]);


    const changePage = (page: Number) => {

        navigate("/units/" + page);
        loadUnits();
    }


    const renderPanelHeader = (unit: any) => {
        return (
            <span><span>{unit.year} {unit.make} {unit.model}</span><span style={{ float: "right" }}>{unit.vin} {unit.color} <strong>{unit.license}</strong></span></span>
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
                        data.map(unit => {
                            return (
                                <Panel key={unit.id} header={renderPanelHeader(unit)}>
                                    <Unit {...unit} />
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


export default Units;

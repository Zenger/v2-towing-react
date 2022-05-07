import { useEffect, useState } from "react";
import API, {IUnit, IPageMeta, IPagination, IAccount} from "../../API";

import {Button, Skeleton, Collapse, Drawer, Result} from "antd";
import Unit from "./Unit";
import { useParams, useNavigate } from "react-router-dom";
import Pagination from "react-js-pagination";

import {PlusOutlined} from "@ant-design/icons";


type IPageParams = {
    page: string,
}

const { Panel } = Collapse;


const Units = (props: any) => {

    const [isLoading, setLoading] = useState(false);
    const [id, setId] = useState(0);
    const [isError, setError] = useState(false);
    const [errorReason, setErrorReason] = useState("");
    const [currentPage, setCurrentPage ] = useState(0 );


    const [data, setData] = useState([] as IUnit[]);
    const [totalPages, setTotalPages] = useState();

    const [ isCreateVisible, setCreateVisible ] = useState(false);


    let navigate = useNavigate();

    const loadUnits = () => {
        let params = new URLSearchParams(window.location.search);
        let page : number = Number(params.get('page'));
        if (page === 0 ) page = 1;
        setCurrentPage(page);

        setLoading(true);
        let api = API.getInstance();

        api.fetchUnits(page).then(response => {
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


    useEffect(() => {

        loadUnits()

        return () => {
            console.log('Component will be unmount');
        }
    }, [id]);


    const changePage = (page: Number) => {

        navigate("/units/?page=" + page);
        loadUnits();
    }


    const renderPanelHeader = (unit: any) => {
        return (
            <span><span>{unit.year} {unit.make} {unit.model}</span><span style={{ float: "right" }}>{unit.vin} {unit.color} <strong>{unit.license}</strong></span></span>
        )
    }

    const create = () => {
        setCreateVisible(true);
    }

    const unitCreated = (unit: IUnit) => {
        let d = data;
        d.slice().unshift(unit); // add to the top of the list
        setData(d);
        console.log(`set data ${unit}`);
        setCreateVisible(false);
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
                <Button onClick={create} type="primary" style={{"float": "right"}}><PlusOutlined /> Add New </Button> <br/> <br/>
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


                <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={25}
                    totalItemsCount={totalPages}
                    pageRangeDisplayed={5}
                    onChange={changePage}
                />
                <Drawer title="Add New" visible={isCreateVisible} width={720}  onClose={() => { setCreateVisible( !isCreateVisible )}} >
                    <Unit new={true} onCreated={unitCreated} />
                </Drawer>
            </div>
        )
    }
}


export default Units;

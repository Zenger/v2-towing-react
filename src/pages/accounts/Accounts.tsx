import { useEffect, useState } from "react";
import API, { IAccount } from "../../API";

import {Skeleton, Collapse, Button, Drawer, Result} from "antd";
import Account from "./Account";
import { useParams, useNavigate } from "react-router-dom";
import {PlusOutlined} from "@ant-design/icons";
import Pagination from "react-js-pagination";


type IPageParams = {
    page: string,
}

const { Panel } = Collapse;


const Accounts = (props: any) => {

    const [isLoading, setLoading] = useState(false);
    const [isError, setError] = useState(false);
    const [errorReason, setErrorReason] = useState("");
    const [currentPage, setCurrentPage ] = useState(0 );
    const [id, setId] = useState(0);

    const [data, setData] = useState([] as IAccount[]);
    const [totalPages, setTotalPages] = useState(0);



    const [ isCreateVisible, setCreateVisible ] = useState(false);

    let navigate = useNavigate();

    const loadAccounts = () => {

        let params = new URLSearchParams(window.location.search);
        let page : number = Number(params.get('page'));
        setCurrentPage(page);


        let api = API.getInstance();

        api.fetchAccounts(page).then(response => {
            setLoading(true);
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

        loadAccounts()
        return () => {
            console.log('Component will be unmount');
        }
    }, [id]);


    const changePage = (page: number) => {

        navigate("/accounts/?page=" + page);
        loadAccounts();
    }


    const renderPanelHeader = (acc :any) => {
        return (
            <span><span>{acc.name} </span><strong style={{float: "right"}}>{acc.phone}</strong></span>
        )
    }

    const create = () => {
        setCreateVisible(true);
    }

    const accountCreated = (acc: IAccount) => {
        let d = data;
        d.slice().unshift(acc); // add to the top of the list
        setData(d);
       console.log(`set data ${acc}`);
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
                        data.map(account => {
                            return (
                                <Panel key={account.id} header={renderPanelHeader(account)}>
                                    <Account {...account} />
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
                    <Account new={true} onCreated={accountCreated} />
                </Drawer>
            </div>
        )
    }
}


export default Accounts;

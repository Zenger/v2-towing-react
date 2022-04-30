import { useEffect, useState } from "react";
import API, { IAccount } from "../../API";

import {Skeleton, Collapse, Pagination, Button, Drawer, Result} from "antd";
import Account from "./Account";
import { useParams, useNavigate } from "react-router-dom";
import {PlusOutlined} from "@ant-design/icons";


type IPageParams = {
    page: string,
}

const { Panel } = Collapse;


const Accounts = (props: any) => {

    const [isLoading, setLoading] = useState(false);
    const [isError, setError] = useState(false);
    const [errorReason, setErrorReason] = useState("");

    const [id, setId] = useState(0);

    const [data, setData] = useState([] as IAccount[]);
    const [totalPages, setTotalPages] = useState(0);
    const [qs, setQs] = useState(0);

    const { page } = useParams();

    const [ isCreateVisible, setCreateVisible ] = useState(false);


    let navigate = useNavigate();

    const loadAccounts = () => {
        setLoading(true);
        const xs = page ? parseInt(page) : 0;
        setQs(xs);

        let api = API.getInstance();

        console.log(`Accounts mounted ${page}`);

        api.fetchAccounts(xs).then(response => {
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

        loadAccounts()

        return () => {
            console.log('Component will be unmount');
        }
    }, [id]);


    const changePage = (page: number) => {
        navigate("/accounts/" + page);
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


                <Pagination defaultPageSize={25} current={qs} total={totalPages} showSizeChanger={false} onChange={changePage} />

                <Drawer title="Add New" visible={isCreateVisible} width={720}  onClose={() => { setCreateVisible( !isCreateVisible )}} >
                    <Account new={true} onCreated={accountCreated} />
                </Drawer>
            </div>
        )
    }
}


export default Accounts;

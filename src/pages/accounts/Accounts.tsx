import { useEffect, useState } from "react";
import API, { IAccount } from "../../API";

import {Skeleton, Collapse, Pagination, Button, Modal} from "antd";
import Account from "./Account";
import { useParams, useNavigate } from "react-router-dom";
import {PlusOutlined} from "@ant-design/icons";


type IPageParams = {
    page: string,
}

const { Panel } = Collapse;


const Accounts = (props: any) => {

    const [isLoading, setLoading] = useState(false);

    const [id, setId] = useState(0);

    const [data, setData] = useState([] as IAccount[]);
    const [totalPages, setTotalPages] = useState();

    const { page } = useParams<keyof IPageParams>() as IPageParams;

    const [ isCreateVisible, setCreateVisible ] = useState(false);


    let navigate = useNavigate();

    const loadAccounts = () => {
        setLoading(true);
        let api = API.getInstance();

        console.log(`mounted ${page}`);

        api.fetchAccounts(parseInt(page)).then(response => {
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


    if (isLoading) {
        return <Skeleton active />
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


                <Pagination defaultCurrent={parseInt(page)} defaultPageSize={25} total={totalPages} showSizeChanger={false} onChange={changePage} />

                <Modal title="Add New" visible={isCreateVisible}  onCancel={() => { setCreateVisible( !isCreateVisible )}} footer={null}>
                    <Account new={true} />
                </Modal>
            </div>
        )
    }
}


export default Accounts;

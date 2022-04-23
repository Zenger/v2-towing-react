import {createRef, useEffect, useState} from "react";
import API, {IAccount, IJob, IPageMeta, IPagination, IUnit} from "../../API";

import {
    Button,
    Skeleton,
    Collapse,
    Dropdown,
    Row,
    Col,
    Card,
    Image,
    Modal,
    AutoComplete,
    Upload,
    message, Menu
} from "antd";
import Job from "./Job";
import { useParams, useNavigate } from "react-router-dom";
import Account from "../accounts/Account";
import Unit from "../units/Unit";
import PaymentDetails from "./PaymentDetails";
import {
    FilePdfOutlined,
    FileTextOutlined,
    LoadingOutlined,
    MailOutlined,
    MessageOutlined,
    PlusOutlined
} from "@ant-design/icons";
import axios from "axios";

type IPageParams = {
    page: string,
}

const { Panel } = Collapse;
interface MockFile {
    originFileObj: string | Blob,
    name: string
}
const JobView = (props: any) => {

    const [isLoading, setLoading] = useState(false);
    const [accountLoading, setAccountLoading ] = useState(false);
    const [unitLoading, setUnitLoading] = useState(false);

    const [isUploading, setIsUploading ] = useState( false );

    const [ attachments, setAttachments ] = useState({ fileList: [] });

    const [isSelectAccountVisible, setSelectAccountVisible] = useState(false);
    const [isSelectUnitVisible, setSelectUnitVisible]      = useState(false);
    const [selectEntityOptions, setSelectEntityOptions ] = useState<{ label:string,  value: string }[]>([]);
    const [selectedEntityValue, setSelectedEntityValue ] = useState("");

    const [job, setJob] = useState({} as IJob);
    const [account, setAccount] = useState({} as IAccount );
    const [unit, setUnit] = useState({} as IUnit );

    const uploadRef  = createRef<any>();

    const { id } = useParams();

    const setAccountSelection = (e:any) => {
        let j = job;
        let acc = JSON.parse(e) as IAccount;
        j.account = acc.id;
        j.account_data = acc;

        setJob(j);
        setAccount( acc );
        setSelectAccountVisible( !isSelectAccountVisible );

    }

    const setUnitSelection = (e:any) => {
        let j = job;
        let un = JSON.parse(e) as IUnit;

        j.unit = un.id;
        j.unit_data = un;

        setJob(j);
        setUnit( un );
        setSelectUnitVisible( !isSelectUnitVisible );
    }

    const searchEntity = (search: string, where: string ) => {
        setSelectedEntityValue( search );

        let searchWhere = ( where == "accounts") ? "accounts" : "units";

        if ( search.length > 2) {
            let api = API.getInstance();

            api.search(searchWhere, search).then( results => {
                if (results.data.length > 0) {
                    let ac: {label: string, value:string}[] = [];
                    results.data.forEach( (el:any) => {
                         let label = (searchWhere == "accounts") ? `${el.name} ${el.phone}`  : `${el.year} ${el.make} ${el.model} ${el.license} ${el.vin}`;
                         ac.push( { label: label,  value: JSON.stringify( el ) } )
                    });

                    setSelectEntityOptions(ac);
                } else {
                    setSelectEntityOptions([]);
                }
            }).finally( () => {

            });
        }

    }


    const loadJob = () => {
        setLoading( true );
        let api = API.getInstance();

        api.fetchJob( id ).then( response => {
            setJob( response.data  );
            setLoading( false );
            loadAccount( response.data.account );
            loadUnit( response.data.unit );

        })
    }


    const loadAccount = (id:number) => {

        let api = API.getInstance();

        setAccountLoading(true);

         api.fetchAccount( id ).then( response => {

                setAccount( response.data );
            }).finally( () => {
                setAccountLoading(false);
         })
    }

    const loadUnit = (id:number) => {
         let api = API.getInstance();

        setUnitLoading(true);

         api.fetchUnit( id ).then( response => {

                setUnit( response.data );
            }).finally( () => {
                setUnitLoading(false);
         })
    }



    useEffect(() => {

        loadJob()

        return () => {
            console.log('Component will be unmount');
        }
    }, []);


    const attachmentSelectionChanged = (fileList:any) => {
        setAttachments( fileList );

    }


    const uploadButton = () => {
        return isUploading ? <LoadingOutlined /> : <PlusOutlined />
    }


    const uploadRequest = (data:any, name: string = "") => {
        setIsUploading(true);

        let api = API.getInstance();
        api.createAttachment(
            job.id,
            name,
            data
        ).then( (response) => {
            console.log(response);
            if (response.status == 200) {
                setAttachments( { fileList: [] } );
            }
        }).finally( () => {
            setIsUploading( false );
        })
    }

    const uploadAttachments = (e:any) => {

       for (let i = 0; i < attachments.fileList.length; i++) {
            let fd = new FormData();
            let file: MockFile = attachments.fileList[i];
            fd.append('attachment', file.originFileObj, file.name );
            uploadRequest( fd , file.name );
        }

    }

    const uploadD = {  showUploadList: {
            showDownloadIcon: true,
            downloadIcon: 'download ',
            showRemoveIcon: true,

          },
    }

    const renderAttachments = () => {

        let images = [];
        let attachments = [];
        if (job.attachments) {
             for (let i = 0; i < job.attachments?.length; i++) {
                 if ( job.attachments[i].image ) {
                     images.push( job.attachments[i] );
                 } else {
                     attachments.push ( job.attachments[i] );
                 }
             }
        }

        return <>
            {
                  images.map( image => {
                          return <Image
                              width={100}
                              height={100}
                              src={image.url}
                              fallback="data:image/png;base64,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"
                          />
                  })

            }
            {
                attachments.map( attach => {
                    return (
                        <div className="ant-image ant-image-error" style={{ width: "100px", height: "100px"}}>
                            <a href={attach.url} target="_blank">
                                <img
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAXxJREFUeJzt2sFtgzAYQOGMmCtTIBZgEM5kICZgBm9QV5WooijBj6bmd/veiYOxfj4JCQlfkhV3OXuAlhILJBZILJBYILFAYoHEAokFEgskFkgskFggsUBigcQCiQUSCyQWSCyQWCCxQGKBxAKJBRILJBaoKtYwDFde13Xrutac81n1sPIDH5AK5VUPa1mWw1hBvE7AGsexZP3X4mma+r4P4hUda57nfB3Eqw2sFMOrGawUwKslrHS2V2NY6VSv9rDSvde7x3xVdKy8+PZQ/p7Yvr/ytr88+HfRsXYT67PtXROr9JZnbZRi7Zc3Eas0sUBigcQCiQUSCyQWSCyQWCCxQGKBxAKJBRILJBZILJBYILFA/wXrvf1NrJ8cZntRzZ/SVY9JFv7dKi9vWHN+D+CCxAKJBRILJBZILJBYILFAYoHEAokFEgskFkgskFggsUBigcQCiQUSCyQWSCyQWCCxQGKBxAKJBRILJBZILJBYILFAYoHEAokFEgv0Ab/7mtYnKS+uAAAAAElFTkSuQmCC"
                                    className="ant-image-img" />
                            </a>
                        </div> )
                })
            }
        </>



    }



    if (isLoading) {
        return <Skeleton active />
    }
    else {

        return (
            <div>

                <Row gutter={16}>
                    <Col span={12}>

                        <Card size="small" title="Account" extra={<div><Button type="primary" onClick={() => { setSelectAccountVisible( !isSelectAccountVisible ) }}>Change Account</Button></div>}>
                            { accountLoading ? <Skeleton />: <Account account={account} /> }
                        </Card>

                        <Modal title="Select Account" visible={isSelectAccountVisible} onOk={() => { setSelectAccountVisible( !isSelectAccountVisible )}} onCancel={ () => { setSelectAccountVisible( !isSelectAccountVisible )}}>
                            <AutoComplete
                                options={selectEntityOptions}
                                style={{ width: 400 }}
                                onSearch={(e) => { searchEntity(e, "accounts") }}
                                value={selectedEntityValue}
                                placeholder="Search Account"
                                onSelect={setAccountSelection}
                            />
                        </Modal>

                    </Col>
                    <Col span={12}>
                        <Card size="small" title="Unit" extra={<div><Button onClick={() => { setSelectUnitVisible( !isSelectUnitVisible ) }} type="primary">Change Unit</Button></div>}>
                            { unitLoading ? <Skeleton /> : <Unit unit={unit} />}
                        </Card>

                        <Modal title="Select Unit" visible={isSelectUnitVisible} onOk={() => { setSelectUnitVisible( !isSelectUnitVisible )}} onCancel={ () => { setSelectUnitVisible( !isSelectUnitVisible )}}>
                            <AutoComplete
                                options={selectEntityOptions}
                                style={{ width: 400 }}
                                onSearch={(e) => { searchEntity(e, "units") }}
                                value={selectedEntityValue}
                                placeholder="Search Unit"
                                onSelect={setUnitSelection}
                            />
                        </Modal>

                    </Col>
                </Row>
                <div style={{paddingTop:"25px"}}>
                        <Row gutter={16}>
                            <Col span={18}>
                                  <Card size="small" title="Job Details">
                                        <Job {...job} />
                                   </Card>
                            </Col>
                            <Col span={6}>
                                <Card size="small" title="Payment Info">
                                    <PaymentDetails id={job.payment_id} />

                                </Card>
                            </Col>
                        </Row>


                </div>

                <div style={{paddingTop:"25px"}}>

                     <Row gutter={16}>
                            <Col span={18}>
                                  <Card size="small" title="Photos / Documents">
                                { renderAttachments() }
                                <Upload name="attachment"
                                        accept=".jpg, .jpeg, .png, .doc, .docx, .pdf, .odt, .xml, .xls"
                                        listType="picture-card"
                                        multiple={true}
                                        action="http://localhost:3000/attachments/create/120"
                                        method="POST"
                                        onChange={attachmentSelectionChanged}
                                        customRequest={uploadAttachments}
                                        beforeUpload={() => { return false }}
                                        style={{padding:"5px"}}
                                        ref={uploadRef}
                                >

                                    {uploadButton()}
                                </Upload>
                                <br/>
                                <Button type="primary" disabled={isUploading} onClick={uploadAttachments}>Upload Attachments</Button>

                           </Card>
                            </Col>
                            <Col span={6}>
                               <Card size="small" title="Generators">
                                     <Dropdown.Button overlay={
                                       () => {
                                           return <Menu>
                                               <Menu.Item key="1">as text message</Menu.Item>
                                               <Menu.Item key="2">as email</Menu.Item>
                                               <Menu.Item key="3">as pdf</Menu.Item>
                                           </Menu>
                                       }
                                   }>
                                       Invoice
                                   </Dropdown.Button> <br/>
                                   <Dropdown.Button overlay={
                                       () => {
                                           return <Menu>
                                               <Menu.Item key="1">as text message</Menu.Item>
                                               <Menu.Item key="2">as email</Menu.Item>
                                               <Menu.Item key="3">as pdf</Menu.Item>
                                           </Menu>
                                       }
                                   }>
                                       Notice
                                   </Dropdown.Button> <br/>

                                    <Dropdown.Button overlay={
                                       () => {
                                           return <Menu>
                                               <Menu.Item key="1">as text message</Menu.Item>
                                               <Menu.Item key="2">as email</Menu.Item>
                                               <Menu.Item key="3">as pdf</Menu.Item>
                                           </Menu>
                                       }
                                   }>
                                       Intent
                                   </Dropdown.Button> <br/>

                                    <Dropdown.Button overlay={
                                       () => {
                                           return <Menu>
                                               <Menu.Item key="1">as text message</Menu.Item>
                                               <Menu.Item key="2">as email</Menu.Item>
                                               <Menu.Item key="3">as pdf</Menu.Item>
                                           </Menu>
                                       }
                                   }>
                                       Bill of Sale
                                   </Dropdown.Button> <br/>
                                   <Dropdown.Button overlay={
                                       () => {
                                           return <Menu>
                                               <Menu.Item key="1">as text message</Menu.Item>
                                               <Menu.Item key="2">as email</Menu.Item>
                                               <Menu.Item key="3">as pdf</Menu.Item>
                                           </Menu>
                                       }
                                   }>
                                       Damage Waiver
                                   </Dropdown.Button> <br/>
                                   <Dropdown.Button overlay={
                                       () => {
                                           return <Menu>
                                               <Menu.Item key="1">as text message</Menu.Item>
                                               <Menu.Item key="2">as email</Menu.Item>
                                               <Menu.Item key="3">as pdf</Menu.Item>
                                           </Menu>
                                       }
                                   }>
                                       Claim of Ownership
                                   </Dropdown.Button>





                               </Card>
                            </Col>
                        </Row>


                </div>



            </div>
        )
    }
}


export default JobView;

import { useEffect, useState } from "react";
import API, { IOption, IPageMeta, IPagination } from "../../API";

import {Button, Skeleton, Collapse, Pagination, Tabs, message, Popconfirm} from "antd";

import { useParams, useNavigate } from "react-router-dom";

import JSONInput from 'react-json-editor-ajrm';



const defaults = "[{\"name\":\"APD Daily\",\"charges\":[{\"name\":\"Towing Charge\",\"amount\":\"85\"},{\"name\":\"Mileage Charge\",\"amount\":\"56\"},{\"name\":\"Gate Fee\",\"amount\":\"25\"},{\"name\":\"Fuel Charge\",\"amount\":\"15\"},{\"name\":\"Labor\",\"amount\":\"120\"},{\"name\":\"Special Equipment\",\"amount\":\"25\"},{\"name\":\"Storage\",\"amount\":\"15\"}]},{\"name\":\"APD Nightly\",\"charges\":[{\"name\":\"Towing Charge\",\"amount\":\"105\"},{\"name\":\"Mileage Charge\",\"amount\":\"56\"},{\"name\":\"Gate Fee\",\"amount\":\"25\"},{\"name\":\"Fuel Charge\",\"amount\":\"15\"},{\"name\":\"Labor\",\"amount\":\"160\"},{\"name\":\"Special Equipment\",\"amount\":\"25\"},{\"name\":\"Storage\",\"amount\":\"15\"}]},{\"name\":\"PPI\",\"charges\":[{\"name\":\"Impound Charge\",\"amount\":\"250\"},{\"name\":\"Gate Fee\",\"amount\":\"25\"},{\"name\":\"Storage\",\"amount\":\"30\"}]}]";


type IPageParams = {
    page: string,
}

const { TabPane } = Tabs;


const schema = {
    type: 'object'
}

const Options = (props: any) => {

    const [isLoading, setLoading] = useState(false);

    const [data, setData] = useState({} as JSON);

    const tabPaneChanged = (tab:any) => {
        if (tab == "price_group") {
            loadPriceGroups();
        }
    }

    useEffect( () => {
        console.log('load default tab')
        loadPriceGroups();
    }, []);


    const loadPriceGroups = () => {
        setLoading( true );
        let api = API.getInstance();

        api.fetchOptions( "price_group" ).then( response => {
            setData(  JSON.parse( response.data.value ) );
        }).finally( () => {
            setLoading(false);
        })
    }


    const savePriceGroupOpt = (e:any) => {
        let api = API.getInstance();

        setLoading(true);
        let updateData = {
            name: "price_group",
            value: JSON.stringify(data)
        }
        api.updateOptions("price_group", updateData).then(response => {
              message.success('Settings Saved');
        }).finally( () => {
            setLoading(false);
        });
    }

    const setJSONObject = ( obj:any ) => {
        setData( obj.jsObject );
    }

    const resetDefaultPriceGroupOpt = () => {
        setData( JSON.parse(defaults));
    }

    if (isLoading) {
        return <Skeleton active />
    }
    else {
        return (
            <div>
                <Tabs defaultActiveKey="price_group" onChange={tabPaneChanged}>
                    <TabPane tab="Price Groups" key="price_group">
                            <div >
                                 <JSONInput
                                    id          = 'a_unique_id'
                                    placeholder = { data }
                                    height      = '550px'
                                    width = '800px'
                                    theme = 'light_mitsuketa_tribute'
                                    onChange={setJSONObject}
                                />
                            </div>
                            <br/>
                            <Button onClick={savePriceGroupOpt} >Save</Button> &nbsp;
                            <Popconfirm title="Are you sure you want to reset the settings to factory settings?" onConfirm={resetDefaultPriceGroupOpt} okText="Yes" cancelText="No" placement="right">
                                <Button danger>Reset</Button>
                            </Popconfirm>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}


export default Options;

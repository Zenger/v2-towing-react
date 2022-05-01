import {useEffect, useState} from "react";
import {Button, DatePicker, Descriptions, Form, Input, Select} from "antd";

import {Charges } from "../../../API";
import {PaymentMethod} from "../../../Types";
import {CopyOutlined, DeleteOutlined} from "@ant-design/icons";

const { Option } = Select;

const ChargeEntry = (props:any) => {

    const [charge, setCharge] = useState({} as Charges);
    const {onDelete, index, onEntryChanged} = props;

    useEffect( () => {
        setCharge(props.charge);
    }, [props.charge])

    const handleValueChange = (e:any) => {
       setCharge( charge => ({...charge, [e.target.name]: e.target.value }));
       onEntryChanged( index, e.target.value );
    }

    return (
        <div>
                <Input.Group compact>
                     <Input name="name"
                        style={{ width: '50%' }}
                        value={charge.name}
                        onChange={handleValueChange}
                      />
                      <Input name="amount"
                         style={{ width: '42%' }}
                        value={charge.amount}
                        onChange={handleValueChange}
                             type="number"
                      />

                        <Button style={{width: '8%'}} onClick={()=>{ onDelete(index)} }  icon={<DeleteOutlined />} />
                    </Input.Group>
        </div>
    )

}

export default ChargeEntry;

import React from 'react';
import { useState, useEffect } from 'react';

import { Card, Row, Col, Descriptions, Button, Form, Input, message, Select } from 'antd';
import API, { IUser } from '../../API';


const { TextArea } = Input;
const { Option } = Select;



const User = (props: any ) => {

    const [isEdit, setEdit] = useState(false);
    const [ user, setUser ] = useState({} as IUser);

    const { updateUser } = props;


    useEffect( () => {
    	setUser( props );
    }, [props])




    const handleChange = (e:any) => {
        setUser( userData => ( { ...userData, [e.target.name]: e.target.value}));

    }

    const setEditState = (e:any) => {
        setEdit( !isEdit )
    }

    const saveUser = () => {

      let api = API.getInstance();
       api.updateUser ( user as IUser ).then( (response) => {
            message.success("user information has been saved!");
            updateUser( user );
       }).catch(e => {
            message.error(e.message, 1.5);
       });

    }

    const renderDisplayMode = () => {
        return (
            <Descriptions bordered={true} size="small">
                <Descriptions.Item label="Name" span={2}>{user.name}</Descriptions.Item>
                <Descriptions.Item label="Phone" span={2}><a href="tel:">{user.phone}</a></Descriptions.Item>
                <Descriptions.Item label="Email" span={2}>{user.email}</Descriptions.Item>
                <Descriptions.Item label="Notes" span={2}>{user.meta}</Descriptions.Item>
                <Descriptions.Item label="Edit"><Button onClick={setEditState}>Edit</Button></Descriptions.Item>
            </Descriptions>
        )
    }

    useEffect(() => {
        console.log('Component mounted');
         console.log(props);
        return () => {
            console.log('Component will be unmount');
        }
    }, []);


    const renderEditMode = () => {


        return(
            <div>
                { <Form layout="horizontal" labelCol={{ span: 1 }} wrapperCol={{ span: 16 }}  initialValues={{ remember: true }}>
                    <Form.Item label="Name">
                        <Input name="name" value={user.name} placeholder="eg. Company Name LLC" onChange={handleChange} />
                    </Form.Item>
                    <Form.Item label="Phone">
                        <Input name="phone" value={user.phone} placeholder="907-111-2222" onChange={handleChange} />
                    </Form.Item>
                    <Form.Item label="Email">
                        <Input name="email" value={user.email} placeholder="test@test.com" onChange={handleChange} />
                    </Form.Item>

                    <Form.Item label="Token">
                    	<Input name="access_token" placeholder="Leave blank if unknown" onChange={handleChange} />
                    </Form.Item>
                    <Form.Item label="Notes">
                        <TextArea name="meta" value={user.meta} placeholder="eg. Additional Info" onChange={handleChange} />
                    </Form.Item>
                    <Form.Item label="Role">
                    	<Select  defaultValue={user.role }  onChange={(e) => { handleChange({ target: { name: "role", value: e }}) }}>
                    		<Option value={0}>Disabled</Option>
                    		<Option value={1}>Admin</Option>
                    		<Option value={2}>Office</Option>
                    		<Option value={3}>Driver</Option>

                    	</Select>

                    </Form.Item>
                    <Form.Item>
                    	<Button danger onClick={setEditState}>Cancel</Button> <Button type="primary" onClick={saveUser}>Save</Button>
                    </Form.Item>
                </Form>

               /* <>

                 </>*/

               }
            </div>
        )
    }


    return (
        <Card>
            { isEdit ? renderEditMode() : renderDisplayMode() }
        </Card>
    )
}


export default User;

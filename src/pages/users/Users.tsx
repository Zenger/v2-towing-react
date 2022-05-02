import { useEffect, useState } from "react";
import API, { IAccount, IPageMeta, IPagination, IUser } from "../../API";

import { Button, Skeleton, Collapse, Pagination, Tabs } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import User from './User';

const { TabPane } = Tabs;

const {Panel} = Collapse;





const Users = (props:any) => {

	const [isLoading, setLoading] = useState(false);

	const [users, setUsers] = useState({} as IUser[]);

	const [filteredUsers, setFilteredUsers] = useState({} as IUser[]);

	const [activeTab, setActiveTab] = useState(0);



	const getRoleFromTab = (tabTag: string) => {
		let tab = 0;

		if (tabTag == "disabled") {
			tab = 0;
		} else if (tabTag == 'admins') {
			tab = 1;
		} else if (tabTag == "office") {
			tab = 2;
		}
		else {
			tab = 3;
		}

		return tab;
	}


	const updateDataFromChild  = (data:IUser) => {
		console.log('hello from child');
		let new_data = [];
		for (let i =0; i < users.length; i++) {
			if (users[i].id == data.id) {
				new_data.push(data);
			} else {
				new_data.push(users[i]);
			}
		}


		setUsers(new_data);
		setFilteredUsers( filterUsersByRole(new_data, activeTab) );
	}


	const filterUsersByRole = (users: IUser[] , role:number) =>  {

		if (users.length > 0) {
			let f = users.filter( user => {
				let og_role = user.role;
				return og_role == role;
			} );
			console.log(f);
			return f;
		}
		else {
			return [];
		}
	}

	const loadUsers = () => {
		let api = API.getInstance();

		api.fetchUsers().then( response => {
			setLoading(true);
			setUsers( response.data.data );
			setFilteredUsers ( filterUsersByRole( response.data.data, 3 )  );

		}).finally( () => {
			setLoading(false);
		})
	}


	   useEffect(() => {

        loadUsers()



        return () => {
            console.log('Component will be unmount');
        }
    }, []);



	const tabChanged = (tabTag:any) => {

		let tab = getRoleFromTab(tabTag);

		setActiveTab(tab);

		setFilteredUsers ( filterUsersByRole( users, tab ) );
	}


	const renderLoading = () => {
		return <Skeleton />
	}

	const renderUserList = () => {
		return (
			<Collapse collapsible="header" bordered={false}>
                {
                 	filteredUsers.length > 0 ? filteredUsers.map( user => {
                        return (
                                <Panel key={user.id} header={user.name + " " + user.phone}>
                                    <User { ... user } updateUser={updateDataFromChild} />
                                </Panel>
                            )
                    }) : <p>No Users</p>
                }
            </Collapse>
		)
	}




	return (
		<div style={{padding:"25px"}}>

		 <Tabs defaultActiveKey="1" onChange={tabChanged}>
    		<TabPane tab="Drivers" key="drivers">
    			{  isLoading ? renderLoading() : renderUserList() }
    		</TabPane>
    		<TabPane tab="Admins" key="admins">
    			{  isLoading ? renderLoading() : renderUserList() }
    		</TabPane>
    		<TabPane tab="Office" key="office">
    			{  isLoading ? renderLoading() : renderUserList() }
    		</TabPane>
    		<TabPane tab="Disabled" key="disabled">
    			{  isLoading ? renderLoading() : renderUserList() }
    		</TabPane>
    	</Tabs>


		</div> )
}

export default Users;

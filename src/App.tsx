import React, { FunctionComponent, useEffect, useState } from 'react';
import { ManagerSearchComponent } from './component/ManagerSearchComponent';
import { Manager } from './interface';

import './App.css';

const API_URL = 'https://gist.githubusercontent.com/daviferreira/41238222ac31fe36348544ee1d4a9a5e/raw/5dc996407f6c9a6630bfcec56eee22d4bc54b518/employees.json';

export const App: FunctionComponent = () => {

  const [originalManagersList, setOriginalManagersList] = useState<Manager[]>([]);
  const [filteredManagersList, setFilteredManagersList] = useState<Manager[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const constructManagersList = (responseJson: any) => {
    const managersListArr = [];
    for (const employee of responseJson.data) {
      let manager: Manager = {
        id: '',
        firstName: '',
        lastName: '',
        name: '',
        emailId: ''
      };
      const employeeAccountId = employee.relationships?.account?.data?.id;
      if (employeeAccountId) {
        manager.id = employeeAccountId;
        manager.firstName = employee.attributes.firstName;
        manager.lastName = employee.attributes.lastName;
        manager.name = employee.attributes.name;
        const employeeAccountObjArr = responseJson.included.filter((accountObj: any) => { return accountObj.id === employeeAccountId });
        if (employeeAccountObjArr && employeeAccountObjArr.length > 0) {
          const employeeAccountObj = employeeAccountObjArr[0];
          manager.emailId = employeeAccountObj.attributes.email;
        }
      }
      managersListArr.push(manager);
    }
    setOriginalManagersList(managersListArr);
    setFilteredManagersList(managersListArr);
  }

  const onSearchInputChange = (event: any) => {
    const searchText = (event.target.value || '');
    if (originalManagersList && originalManagersList.length > 0) {
      const filteredArr = originalManagersList.filter((managerItem) => {
        const managerFullName = managerItem.name.replace(/\s/g, '');
        return (managerFullName.toLowerCase()).includes(searchText.replace(/\s/g, '').toLowerCase());
      });
      setFilteredManagersList(filteredArr);
    }
  }

  useEffect(() => {
    fetch(API_URL)
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        constructManagersList(responseJson);
        setLoading(false);
      })
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        Choose Manager
      </header>
      <div className="manager-search-component-div">
        {!loading &&
          <ManagerSearchComponent managersList={filteredManagersList} onSearchInputChange={onSearchInputChange} />
        }
      </div>
    </div>
  );
}

import { FunctionComponent, useEffect, useRef } from "react";
import { Manager } from "../interface";

import './ManagerSearchComponent.css';
import 'bootstrap/dist/css/bootstrap.min.css';

interface ManagerSearchComponentProps {
    managersList?: Manager[];
    onSearchInputChange: any;
}

export const ManagerSearchComponent: FunctionComponent<ManagerSearchComponentProps> = (props) => {
    const { managersList, onSearchInputChange } = props;
    const managerSearchInputRef = useRef<HTMLInputElement | null>(null);
    const managersListRef = useRef<HTMLUListElement | null>(null);

    const onManagerSelected = (managerItem: Manager) => {
        // just setting the search input text here. If we have to take the selected manager and process something then we can use another useState like selectedManager
        if (managerSearchInputRef.current) {
            managerSearchInputRef.current.value = managerItem.name;
        }
    }

    const getRandomColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    const moveFocus = () => {
        const managerListNodes = managersListRef.current;
        if (managerListNodes) {
            managerListNodes.addEventListener('keydown', function (e: any) {
                const active: any = e.target;
                if (e.code === 'ArrowDown' && active.nextSibling) {
                    active.nextSibling.focus();
                }
                if (e.code === 'ArrowUp' && active.previousSibling) {
                    active.previousSibling.focus();
                }
                if (e.code === 'Enter') {
                    const managerDetailsNode = e.target.childNodes[1];
                    const mangeNameNode = managerDetailsNode.childNodes[0];
                    const managerName = mangeNameNode.innerHTML;
                    if (managerSearchInputRef.current) {
                        managerSearchInputRef.current.value = managerName;
                    }
                    if (managersListRef.current) {
                        managersListRef.current.style.display = 'none';
                    }
                }
            });
        }
    }

    useEffect(() => {
        if (managerSearchInputRef.current) {
            managerSearchInputRef.current.addEventListener('click', (event: any) => {
                event.stopPropagation();
                if (managersListRef.current) {
                    managersListRef.current.style.display = 'flex';
                }
                onSearchInputChange(event);
            });
            managerSearchInputRef.current.addEventListener('focus', (event: any) => {
                event.stopPropagation();
                if (managersListRef.current) {
                    managersListRef.current.style.display = 'flex';
                }
                onSearchInputChange(event);
            });
            managerSearchInputRef.current.addEventListener('keydown', function (e) {
                if (e.code === 'ArrowDown') {
                    if (managersListRef.current) {
                        const managerListNodes = managersListRef.current;
                        const firstElementInMenuItem: any = managerListNodes.childNodes[0];
                        firstElementInMenuItem.focus();
                    }
                }
            });
            document.addEventListener('click', (event) => {
                if (managersListRef.current) {
                    managersListRef.current.style.display = 'none';
                }
            });
            if (managersListRef.current) {
                managersListRef.current.style.display = 'none';
                moveFocus();
            }
        }
    }, []);

    return (
        <div className="manager-search-dropdown">
            <input
                id="manager-search-bar"
                type="text"
                className="form-control manager-search-bar"
                placeholder="Choose Manager"
                ref={managerSearchInputRef}
                onChange={onSearchInputChange}
            />
            <ul id="managers-list" className="managers-list list-group" ref={managersListRef}>
                {(managersList && managersList.length > 0) ? managersList.map((managerItem, index) => {
                    return (
                        <div
                            className="manager-list-item list-group-item list-group-item-action row"
                            key={index}
                            tabIndex={index}
                            onClick={(e) => onManagerSelected(managerItem)} >
                            <div className="col-md-2 avatar" style={{ backgroundColor: getRandomColor() }}>
                                <span className="avatarName">
                                    {`${managerItem.firstName.charAt(0)}${managerItem.lastName.charAt(0)}`}
                                </span>
                            </div>
                            <div className="col-md-10 managerDetails">
                                <div className="managerName">{managerItem.name}</div>
                                <div className="managerEmail">{managerItem.emailId}</div>
                            </div>
                        </div>
                    );
                }) : <button className="manager-list-item list-group-item list-group-item-action" type="button">No Match Found</button>}
            </ul>

        </div>
    );
};